var central = artifacts.require("Central_Contract");
//var oraclize = artifacts.require("OraclizeI");
var tci = artifacts.require("TCI_Contract");
var invoice = artifacts.require("Invoice_Contract");

module.exports = function(deployer) {
  deployer.deploy(central);
  //deployer.deploy(oraclize);
  deployer.deploy(tci);
  deployer.deploy(invoice);
  //deployer.autolink();
};
