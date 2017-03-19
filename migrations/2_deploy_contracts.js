module.exports = function(deployer) {
  deployer.deploy(TCI_lib);
  deployer.autolink();
  deployer.deploy(TCI_contract);
};
