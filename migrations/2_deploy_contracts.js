var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Blockbeats = artifacts.require("./Blockbeats.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Blockbeats);
};
