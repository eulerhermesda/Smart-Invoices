//var contract = artifacts.require("contract.sol");
var TCI_admin = artifacts.require("TCI_admin.sol");
var TCI_client = artifacts.require("TCI_client.sol");

module.exports = function(deployer) {
  deployer.deploy(TCI_admin);
  deployer.link(TCI_admin,TCI_client);
  deployer.deploy(TCI_client);
};
