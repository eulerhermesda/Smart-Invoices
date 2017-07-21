var contract = artifacts.require("./contract.sol");

module.exports = function(deployer) {
  deployer.deploy(contract);
};
