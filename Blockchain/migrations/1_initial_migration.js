const Migrations =  artifacts.require('Election');

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};