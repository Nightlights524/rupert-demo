const PenguinCoin = artifacts.require("PenguinCoin");
const Rupert = artifacts.require("Rupert");

module.exports = function (deployer) {
  deployer.deploy(PenguinCoin).then(function() {
    return deployer.deploy(Rupert, PenguinCoin.address);
  });
};