web3.eth.defaultAccount=web3.eth.accounts[0];
//web3.eth.defaultAccount=web3.eth.accounts[1];
//web3.eth.defaultAccount=web3.eth.accounts[2];
//web3.eth.defaultAccount=web3.eth.accounts[3];

var clientContractAddress=localStorage.getItem("clientContractAddress");
var TestContract=web3.eth.contract(contracts['TCI_client'].interface);


function setClient(){
	clientContractAddress=document.getElementById('clientContract').value;
	localStorage.setItem("clientContractAddress", clientContractAddress);
}

var testContract=TestContract.at(clientContractAddress);





function paiementConfirmation() {
	var fro = document.getElementById('yourConfirmation').value;
	var t = document.getElementById('hisConfirmation').value;
	var res = testContract.localPaiementConfirmation(fro,t);
}

function manualEntry() {
	var you = document.getElementById('yourName').value;
	var other = document.getElementById('otherName').value;
	var entry = 300;
	var exp = 2000000000;
	
	
	if (other=='Mr White'){//user1
		var t = 0x38f388fadf4a6a35c61c3f88194ec5ae162c8944;
	}else if(other=='Mr Blonde'){//user2
		var t = 0x06400992be45bc64a52b5c55d3df84596d6cb4a1;
	}else if(other=='Mr Pink'){//user3
		var t = 0xfa4b795b491cc1975e89f3c78972c3e2e827c882;
	}else if(other=='Mr Blue'){//user4
		var t = 0xb0dcdc575ef06dc30aaea069d8043c9d463c931c;
	}
	
	t = t+"";//conversion to string
	
	var res = testContract.localManualEntry(you,other,entry,exp,t);
}

function callScheduler(){
	var res = testContract.callScheduler();
}

function checkFunction(){
	var _client = document.getElementById('whichP').value;
	
	var r = document.getElementById('whichR').value;
	var res = contracts['TCI_admin'].contract.checkFunction(_client,r);
}



var event=testContract.allEvents();
event.watch(function(error,value){
	
	if (error){
		document.getElementById('message').value = error;
		
	}
	else{
		var p = value.args;
		document.getElementById('message').value=p._messageFor+" "+web3.toAscii(p._client)+", at "+p._time+", "+web3.toAscii(p._who1)+" "+p._paid+" "+web3.toAscii(p._who2);
	}
	
});







							 


