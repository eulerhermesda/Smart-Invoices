var testContract = new Contract();
var clientContractAddress = "0xd325bef9592f29381364ec65ed0281b2c16fe9ba";
testContract.at(clientContractAddress);
testContract.setAbi(abiClient);

var adminContract = new Contract();
var adminContractAddress = "0xa74fcad868965555baf2f999e5b57ccfa2d14fe4";
adminContract.at(adminContractAddress);
adminContract.setAbi(abiAdmin);

currentAccount = "0x0658e04b00b45b3ec30a8f0d5175396773e12c81";

function setClient(){

	clientContractAddress=document.getElementById('clientContract').value;
	localStorage.setItem("clientContractAddress", clientContractAddress);
}

//var testContract=testContract.at(clientContractAddress);

function paiementConfirmation() {
	var froOpt = document.getElementById('yourName');
	var tOpt = document.getElementById('hisConfirmation');
	var fro = froOpt.options[froOpt.selectedIndex].text;
	var t = tOpt.options[tOpt.selectedIndex].text;
	
	testContract.localPaiementConfirmation(a2hex(fro).substr(2),a2hex(t).substr(2),function(err,res){
		if (err)
			console.log(err);
		else
			console.log(res);
	});
	return false;
}

function manualEntry() {
	var youOpt = document.getElementById('yourName');
	var otherOpt = document.getElementById('otherName');

	var you = youOpt.options[youOpt.selectedIndex].text;

	var other = otherOpt.options[otherOpt.selectedIndex].text;
	var entry = document.getElementById('Amount').value;
	
	var exp = 2000000000;
	
	t = document.getElementById('otherName').value+"";//conversion to string
	unlockAccount(you,"test")
	testContract.localManualEntry(a2hex(you).substr(2),a2hex(other).substr(2),int2hex(entry).substr(2),int2hex(exp).substr(2),t,function(err,res){
		if (err)
			console.log(err);
		else
			console.log(res);
	});
	return false;
	
}

function callScheduler(){
	//var res = testContract.callScheduler();
}

function checkFunction(){
	var _client = document.getElementById('yourName').value;	
	var r = document.getElementById('whichR').value;
	_client = _client.substr(2);
	adminContract.checkFunction(_client,r,function(err,res){
		if (err)
			console.log(err);
		else
			console.log(res);
	});
	return false;
}

async function checkAlerts(){
	testContract.getEventSize(async function(err,res){
		var message;
		if (err){
			console.log(err);
		}
		else {
			for (var i=0; i < res; i++){
				await testContract.getEvent(i,function(err,res){
					console.log(res);
				});
			}
		}
		
	});
}


//var event=testContract.allEvents();
// event.watch(function(error,value){
	
// 	if (error){
// 		document.getElementById('message').value = error;
		
// 	}
// 	else{
// 		var p = value.args;
// 		document.getElementById('alerts').value=p._messageFor+" "+web3.toAscii(p._client)+", at "+p._time+", "+web3.toAscii(p._who1)+" "+p._paid+" "+web3.toAscii(p._who2);
// 	}
	
// });

function setCurrentAccount(){
	currentAccount = document.getElementById('yourName').value
}

//Convert hexadecimal to ASCII
function hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
        var v = parseInt(hex.substr(i, 2), 16);
        if (v) str += String.fromCharCode(v);
    }
    return str;
}

//Convert int to hexadecimal
function int2hex(int){
  var hex = ("000000000000000000000000000000" + int.toString(16)).substr(-32);
  hex = "0x" + hex;
  return hex;
}

function a2hex(str)
  {
	var arr1 = [];
	for (var n = 0, l = str.length; n < l; n ++) 
     {
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
	 }
	return arr1.join('');
   }