//var testContract = new Contract();
var clientContractAddress = "0x1881bce162963027df2d53cd77c008190f526ad4";
var testContract.at(clientContractAddress);

function setClient(){
	clientContractAddress=document.getElementById('clientContract').value;
	localStorage.setItem("clientContractAddress", clientContractAddress);
}

//var testContract=TestContract.at(clientContractAddress);

function paiementConfirmation() {
	var fro = document.getElementById('yourConfirmation').value;
	var t = document.getElementById('hisConfirmation').value;
	testContract.localPaiementConfirmation(fro,t,function(err,res){
		if (err)
			console.log(err);
		else
			console.log(res);
	});
}

function manualEntry() {
	var you = document.getElementById('yourName').value;
	var other = document.getElementById('otherName').value;
	var entry = document.getElementsById('Amount').value;
	var exp = 2000000000;
	alert('test');
	return true;
	/*if (other=='Mr White'){//user1
		var t = "0x0658e04b00b45b3ec30a8f0d5175396773e12c81";
	}else if(other=='Mr Blonde'){//user2
		var t = "0x3d8619512771fb7c2b5df2cc64d766c320cc99c2";
	}else if(other=='Mr Pink'){//user3
		var t = "0x2f48ce3c1d472d1a4ec4ee0950b06ec59860716e";
	}else if(other=='Mr Blue'){//user4
		var t = "0x2f48ce3c1d472d1a4ec4ee0950b06ec59860716e";
	}*/
	
	t = t+"";//conversion to string
	unlockAccount(you,"test")
	testContract.localManualEntry(you,other,entry,exp,t,function(err,res){
		if (err)
			console.log(err);
		else
			console.log(res);
	});
	
}

function callScheduler(){
	//var res = testContract.callScheduler();
}

function checkFunction(){
	var _client = document.getElementById('whichP').value;
	
	var r = document.getElementById('whichR').value;
	contracts['TCI_admin'].contract.checkFunction(_client,r);
}


async function checkAlerts(){
	contract.getEventSize(function(err,res){
		var message;
		for (var i=0; i < res; i++){
			await contract.getEvent(i,function(err,res){
				console.log(res);
			});
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







							 


