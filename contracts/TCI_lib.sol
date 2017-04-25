pragma solidity ^0.4.8;

library TCI_lib{

  modifier onlyBy1(address _from){//useful to enter invoices
    if (tx.origin != _from) throw;
    _;
  }

  modifier onlyBy2(address _from1, address _from2){//useful to check the invoice
    if (tx.origin != _from1 && tx.origin != _from2) throw;
    _;
  }

  modifier onlyBy2ByID(string ID){//@TODO
    buyer = invoices[invoiceIDMatching[keccak256(ID)]].buyerAddress
    seller = invoices[invoiceIDMatching[keccak256(ID)]].sellerAddress
    if (tx.origin != buyer && tx.origin != seller) throw;
    _;
  }
}
