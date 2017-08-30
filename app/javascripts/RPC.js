
// This function generates the right dat
function generate(_from,_to,_data,_type){
	var extraParam = (_type == "eth_call")?',"latest"':''	
	console.log(gas);
	return '{"jsonrpc":"2.0","method": "'+ _type +'", "params": [{"from": "' + _from +'", "to": "'+ _to +'", "data": "'+ _data +'","gas":"' + gas + '" }'+ extraParam+'], "id": 1}';
}

function estimateGas(_from,_to,_data){

	return new Promise(function(resolve, reject){
		var http = new XMLHttpRequest();
		var url = "http://127.0.0.1:8545";
		var params = '{"jsonrpc":"2.0","method": "eth_estimateGas", "params": [{"from": "' + _from +'", "to": "'+ _to +'", "data": "'+ _data +'" }], "id": 1}';
		
		http.open("POST", url, true);

		http.onreadystatechange = function(){
			if(http.readyState == 4 && http.status == 200) {
				result = http.responseText;
				result = JSON.parse(result);
				result = result.result;
				resolve(result);
			}
		};
		http.send(params);
	});
	
}

function unlockAccount(_account,_pwd){
	// This function will unlock the account passed in parameter.
	// The geth node should expose the personal API through the parameter --rcpapi="personal"

	var http = new XMLHttpRequest();
	var url = "http://127.0.0.1:8545";
	var params = '{"jsonrpc":"2.0","method":"personal_unlockAccount","params":["' + _account + '", "' + _pwd +'", 3600],"id":67}';

	http.open("POST", url, true);
	http.onreadystatechange = function(){
		if(http.readyState == 4 && http.status == 200) {
			if (JSON.parse(http.responseText).hasOwnProperty("error")){
				console.log(http.responseText);
			}
			else
				console.log("Account successfully unlocked")

    }};
	http.send(params);
}

// Send the transaction to the local RPC
async function sendTransaction(_from,_to,data,cb, callback){// cb = original callback
	var http = new XMLHttpRequest();
	var url = "http://127.0.0.1:8545";
	gas = await estimateGas(_from,_to,data);
	var params = generate(_from,_to,data,"eth_sendTransaction",gas);
	console.log(params);
	http.open("POST", url, true);

	http.onreadystatechange = function(){callback(http,cb);};
	
	http.send(params);
}

async function sendCall(_from,_to,data,cb, callback){// cb = original callback
	var http = new XMLHttpRequest();
	var url = "http://127.0.0.1:8545";
	gas = await estimateGas(_from,_to,data);
	var params = generate(_from,_to,data,"eth_call",gas);
	console.log(params);
	http.open("POST", url, true);

	http.onreadystatechange = function(){callback(http,cb);};

	http.send(params);
}


class Contract{

	constructor(){
		this.address = null;
		this.abi = null;
	}

	generateFunctions(){

		for (var i = 0; i< this.abi.length;i++){
			var funcname = this.abi[i].name; // #TODO find a way to generate the name of the function from the name found in the ABI
			var argsName = [];
			var argsType = [];
			var index = 0;
			// Looping through the name of the inputs to get all the inputs plus types
			for (var j=0; j< this.abi[i].inputs.length;j++){

				if (this.abi[i].inputs[j].name != ""){
					argsName[index]=this.abi[i].inputs[j].name;
					argsType[index]=this.abi[i].inputs[j].type;
					index++;
				}
			}

			var index = 0;
			var outputsType=[];
			var outputsName=[];
			if (this.abi[i].outputs){
				for (var j=0; j<this.abi[i].outputs.length; j++){
					outputsType[index] = this.abi[i].outputs[j].type;
					outputsName[index] = this.abi[i].outputs[j].name;
					index++;
				}
			}


			// adding the body of the function
			var args = argsName;
			var funcHash = this.generateFunctionHash(funcname,argsType);
			var funcType = this.abi[i].constant?'sendCall':'sendTransaction'


			var tmpCode = 'var funcString="";'+ 'console.log(arguments.length);' +
						'var string = "";';

			for (var j=0; j < args.length;j++){
				if (argsType[j] == "address"){
					tmpCode = tmpCode +
					'var tmp = "0000000000000000000000000000000000000000000000000000000000000000" + arguments['+j+'].toString().substr(-40);'+
					'tmp = tmp.substring(tmp.length-64,tmp.length);'+
					'string = string + tmp;'
				}
				else{
					tmpCode = tmpCode +
					'var tmp = "0000000000000000000000000000000000000000000000000000000000000000" + arguments['+j+'].toString();'+
					'tmp = tmp.substring(tmp.length-64,tmp.length);'+
					'string = string + tmp;'
				}
			}

			// Adding the callback function
			//tmpCode = tmpCode + 'var callBackFunc = function(){arguments[arguments.length](err,res)}'

			tmpCode = tmpCode +	'funcString = "0x'+funcHash+'"+ string;'+
								funcType+'(currentAccount,this.address,funcString,arguments[arguments.length-1],function(http) {'+
									    'if(http.readyState == 4 && http.status == 200) {';

			// Code for handling the response from the RPC server here
			if (this.abi[i].constant){
				// If we have a call, the result of the operation is returned in the result field of the response
			tmpCode = tmpCode +	'var response = JSON.parse(http.responseText);'+
				'var res=[];'+
				'var err=undefined;'+
				'if (response.error){'+
					'console.log(response);'+
					'err = response.error;'+
				'}'+
				'else {'+
					'for (var i=0; i<'+outputsType.length+';i++){'+
						'res[i]="0x"+response.result.substring(2+64*i,66+64*i);'+
					'}'+
				'}'+
				'console.log(arguments[arguments.length-1]); arguments[arguments.length-1](err,res);';

			}
			tmpCode = tmpCode +	' console.log(http.responseText);'+
									   ' }});';
			args[args.length]=tmpCode

			this[funcname] = Function.apply(null,args);
		}
	}


	at(address){
		this.address = address;
	}

	parseAbi(_abi){
		this.abi = JSON.parse(_abi);
		console.log(this.abi);
		this.generateFunctions();

	}

	setAbi(_abi){
		this.abi = _abi;
		this.generateFunctions();
	}



	generateFunctionHash(funcName,type){
		
		var tmp = funcName + '(';

		for (var i=0; i < type.length;i++ ){
			if (type[i] == 'uint')
				tmp=tmp+'uint256';
			else if (type[i] == 'int')
				tmp=tmp+'int256';
			else
				tmp=tmp+type[i]
			if (i != type.length -1){
				tmp=tmp+','
			}

		}
		tmp=tmp+')';
		//console.log(tmp)

		return keccak256(tmp).substring(0,8);
	}
}

class Web3{
	constructor(address){
		this.address = addres;
		this.contract = Contract();
	}
}

function testArguments(){
	var funcString=""
	var string = "";
	for (var i = 0; i < arguments.length  ; i ++){

		var tmp = "0000000000000000000000000000000000000000000000000000000000000000" + arguments[i].toString()
		tmp = tmp.substring(tmp.length-64,tmp.length)

		string = string + tmp;
	}
	string="0000000000000000000000000000000000000000000000000000000000000000" + string
	funcString = '0x'+funcString + string.substring(string.length-64,string.length)

	sendTransaction(currentAccount,contract.address,funcString,function(http) {//Call a function when the state changes.
		    if(http.readyState == 4 && http.status == 200) {
		        console.log(http.responseText);
		    }})
}