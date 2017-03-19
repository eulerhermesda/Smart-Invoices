pragma solidity ^0.4.8;

import "./TCI_lib.sol";

contract TCI_contract{

//GLOBAL BASE PARAMETERS-------------------------------------------





//------------------------------------------------------------------
//STRUCTURE TO STORE THE INVOICES-----------------------------------
	struct Invoice{
		address buyerAddress;
		address sellerAddress;
		bool	buyerValidated;
		bool	sellerValidated;
		int	dueDate;
		bool	buyerPaid;
		bool	sellerGotPaid;
		string  ID;
	}


	mapping(address=>Invoice[]) invoices;
	mapping (bytes32=> address) invoiceIDMatching;
//-----------------------------------------------------------------------

//FUNCTIONS---------------------------------------------------------

	function registerInvoice(address buyer, address seller, int dueDate, string ID){
	/* Function for registering a new invoice
	 * If it is either the buyer of the seller that is entering the invoice, then the
	 * buyerValidated or sellerValidated are respectively set to True
	 * If it is a third party pushing the invoice, then those two booleans are
	 * left at false
	 */
		invoice = new Invoice();
		invoice.buyerAddress = buyer;
		invoice.sellerAddress = seller;
		invoice.dueDate = dueDate;
		invoice.ID = ID;
		invoice.buyerPaid = false;
		invoice.sellerGotPaid = false;


		// If the buyer is creating the invoice then the invoice is validated from
		// the buyer side. Reciprocally from the seller side

		if (tx.origin == buyer){ //@TODO faire gaffe a la difference entre tx.origin et msg.sender, dans le premier cas c'est l'origine absolue de la transaction,
															//dans l'autre c'est l'interlocuteur précédent (peut etre un contrat)
			invoice.buyerValidated = true;
			invoice.sellerValidated = false;
		}
		if (tx.origin == seller){
			invoice.sellerValidated = true;
			invoice.buyerValidated = false;
		}
		invoices[buyer]=invoice;
		invoiceIDMatching[keccak256(ID)] = buyer;
	}

	function validateInvoice(string ID) TCI_lib.onlyBy2ByID(ID){
	/* Function for validating an invoice:
	 * ID : ID of the invoice to be validated
	 * For this function we should check whether the person calling this function is
	 * either the buyer or the seller. If that is true then we set the matching boolean
	 * to true.
	 */
	 _invoice = invoices[invoiceIDMatching[keccak256(ID)]];

	 if (tx.origin == buyer){
		 _invoice.buyerValidated=true;
	 }

	 if (tx.origin == seller){
		 _invoice.sellerValidated=true;
	 }
	}

	function payInvoice(address buyerSeller, string ID) TCI_lib.onlyby2ByID(ID){
	/* Function to mark that the buyer paid the invoice or that the seller got paid
	 * We could imagine having a trustable third party, or a zkp being used to check that
	 * the transfer was really made.
	 * For this demo we will assume that only the buyer and the seller can validate the
	 * payment
	 */
	}

	function sendMessage(Invoice Inv){

	}

	function lookUpInvoice(string ID){
	}
