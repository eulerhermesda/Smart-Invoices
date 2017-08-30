var ConvertLib = artifacts.require("./contract.sol");


module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  
};
