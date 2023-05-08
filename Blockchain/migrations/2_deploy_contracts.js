const Election = artifacts.require("Election");

export default function (deployer) {
  deployer.deploy(Election);
};