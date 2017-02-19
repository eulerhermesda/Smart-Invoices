pragma solidity ^0.4.8;

import "TCI_admin.sol";
//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------CLIENT TCI SOURCE CODE--------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
contract TCI_client {
	
	address admin;
	bytes32 public Name;
	TCI_admin public con;
	address public clientOwner;//the "owner" of this smart contract
	uint ch = 0;
	
	modifier onlyBy1(address _from){//useful to enter invoices
		if (tx.origin != _from) throw;
		
		_;
	}
	modifier onlyBy2(address _from1, address _from2){//useful to check the invoice
		if (tx.origin != _from1 && tx.origin != _from2)throw;

		_;
	}
	
//-------------------EVENT-------------------------------------------------------------------------
//does the same as hasPaid event from original admin contract, but alerts only the client linked to this smart contract
	event localHasPaid(uint _time, string _messageFor, bytes32  _client,bytes32  _who1, string _paid, bytes32  _who2);
	
//-------------------CONSTRUCTOR FUNCTION----------------------------------------------------------
	function TCI_client(bytes32 name, address client, address _admin){
		Name=name;
		clientOwner= client;
		
		admin=_admin;
		con = TCI_admin(admin);
		con.getNew(this, Name);
		
	}
	
//A function that accesses the manualEntry function of the main ADMIN CONTRACT, to store the invoices
	function localManualEntry(bytes32 you, bytes32 other, uint256 entry, uint256 exp, address t) onlyBy1(clientOwner) {
		con.manualEntry(you,other,entry,exp,t);
	}
	

	function localPaiementConfirmation(bytes32 fro, bytes32 t) onlyBy1(clientOwner) {
		con.paiementConfirmation(fro,t);
	}
	
	function localCheck(uint _time, string _messageFor, bytes32 _client, bytes32 _who1, string _paid, bytes32 _who2){
		ch = 1;
		localHasPaid(_time, _messageFor, _client, _who1, _paid, _who2);
		
	}
	
}

