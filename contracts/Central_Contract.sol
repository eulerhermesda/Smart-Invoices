pragma solidity ^0.4.8;
import "./Invoice_Contract.sol";
import "./TCI_Contract.sol";

//----------------------------------------------------
//------------------ Central -------------------------
//----------------------------------------------------
contract Central_Contract {
 /**********
  Definition of the data
 **********/
 mapping (address => Invoice_Contract[]) public seller;
 mapping (address => Invoice_Contract[]) public buyer;
 mapping (address => bool) IsRegister;
 address [] addressList;

 //tableau
 uint [] public tab;
 function insertElement(uint value){
   tab.push(value);
 }
 function getTabLength() public constant returns (uint){
   return tab.length;
 }

 //uint
 uint public testNum;
 function changeValue (uint value){
   testNum = value;
 }
 function getNum () public constant returns (uint){
   return testNum;
 }

 //Ajouter les modifier buyer validate

 /**********
 Create Invoice
 **********/
 function createInvoice (string amount, string currency, string dueAt, string issueAt, address sellerAddress, address buyerAddress){
    //Création du contrat
    uint indexSeller = seller[sellerAddress].length;
    uint indexBuyer = buyer[buyerAddress].length;

    Invoice_Contract newInvoiceAddress = new Invoice_Contract(amount, currency, dueAt, issueAt, sellerAddress, buyerAddress, indexSeller, indexBuyer);
    buyer[buyerAddress].push(newInvoiceAddress);
    seller[sellerAddress].push(newInvoiceAddress);

    if(!IsRegister[buyerAddress]){
        addressList.push(buyerAddress);
        IsRegister[buyerAddress] = true;
    }
    if(!IsRegister[sellerAddress]){
        addressList.push(sellerAddress);
        IsRegister[sellerAddress] = true;
    }
 }

 function searchIndex (address adresse) public constant returns (uint){
   uint last = 0;
   last = seller[adresse].length - 1;
   return last;
 }

 function getLengthSeller(address adresse) public constant returns (uint){
   return seller[adresse].length;
 }

 function getLengthBuyer(address adresse) public constant returns (uint){
   return buyer[adresse].length;
 }

}
