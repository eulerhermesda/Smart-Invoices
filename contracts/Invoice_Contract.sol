pragma solidity ^0.4.8;
import "./TCI_Contract.sol";

//----------------------------------------------------
//------------------ Invoice -------------------------
//----------------------------------------------------
contract Invoice_Contract{
  /**********
  Definition of the data
  **********/
  struct Invoice{
    string amount;
    string currency;
    string dueAt;
    string issueAt;
    address sellerAddress;
    address buyerAddress;
    bool IsSeller;
    bool sellerHasValidate;
    bool buyerHasValidate;
    bool sellerGotPaid;
    bool HasTCI;
    uint indexSeller;
    uint indexBuyer;
  }
  Invoice _invoice;
  TCI_Contract _tci;

  /**********
  Restriction
  **********/
  modifier sellerOwnly(){
      if(msg.sender != _invoice.sellerAddress) throw;
      _;
  }
  modifier IsValidate(){
      if(!_invoice.sellerHasValidate || !_invoice.buyerHasValidate) throw;
      _;
  }

  /**********
  Events
  **********/
  //For the payement in ether
  event sendAmount (address indexed _to, string indexed _value);

  /**********
  Constructor
  **********/
  function Invoice_Contract (string amount, string currency, string dueAt, string issueAt, address sellerAddress, address buyerAddress, uint indexSeller, uint indexBuyer){
    _invoice.amount = amount;
    _invoice.currency = currency;
    _invoice.dueAt = dueAt;
    _invoice.issueAt = issueAt;
    _invoice.sellerAddress = sellerAddress;
    _invoice.buyerAddress = buyerAddress;
    _invoice.indexSeller = indexSeller;
    _invoice.indexBuyer = indexBuyer;
  }
  function secondInitialisation(bool sellerHasValidate){
    if(sellerHasValidate){
      _invoice.sellerHasValidate = true;
      _invoice.buyerHasValidate = false;
    }
    else{
      _invoice.sellerHasValidate = false;
      _invoice.buyerHasValidate = true;
    }
  }

  /**********
  Creation of TCI
  **********/
  function createTCI(string idTransaction, string amount, string currency) IsValidate(){
      _tci = new TCI_Contract(idTransaction, amount, currency);
      _invoice.HasTCI = true;
  }

  /**********
  Display contract
  **********/
  function displayContract() public constant returns (string, string, string, string){
    return(_invoice.amount, _invoice.currency, _invoice.dueAt, _invoice.issueAt);
  }

  /**********
  Validation
  **********/
 function Validation(bool IsSeller){
      if(_invoice.sellerHasValidate){
          _invoice.buyerHasValidate = true;
      }
      else{
          _invoice.sellerHasValidate = true;
      }
  }

  /**********
  Modification
  **********/
  //Amount
  function modifcation_Amount(string amount, bool IsSeller){
    _invoice.amount = amount;
    if(IsSeller){
        _invoice.buyerHasValidate = false;
    }
    else{
        _invoice.sellerHasValidate = false;
    }
  }
  //DueDate
  function modifcation_DueDate(string dueDate, bool IsSeller){
    _invoice.dueAt = dueDate;
    if(IsSeller){
        _invoice.buyerHasValidate = false;
    }
    else{
        _invoice.sellerHasValidate = false;
    }
  }
  //Both
  function modifcation_DueDate(string dueDate, string amount, bool IsSeller){
    _invoice.dueAt = dueDate;
    _invoice.amount = amount;
    if(IsSeller){
        _invoice.buyerHasValidate = false;
    }
    else{
        _invoice.sellerHasValidate = false;
    }
  }


  /**********
  Paid
  **********/
  function gotPaid(bool IsPaid) IsValidate(){
    if(IsPaid){
        _invoice.sellerGotPaid = true;
        _tci.SetStatusPayement(true);
    }
  }

  /**********
  Premium
  **********/
   // /!\ The contract must have an amout of ether
  /*function premiumPayement (string tci_amount) sellerOwnly(){
      if(!_invoice.owner.send(parseInt(tci_amount))){
        _invoice.IsPaid = false;
      }
      else{
        _invoice.IsPaid = true;
        sendAmount(_invoice.owner, tci_amount);
      }
  }*/

}
