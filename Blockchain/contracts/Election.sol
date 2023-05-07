// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract Election{
	
	struct Contestant{
		uint id;
		string name;
		uint voteCount;
        string uniqueId;
		uint age;
	}

	struct Voter{
		bool hasVoted;
		string vote;
		bool isRegistered;
	}

	address admin;
	mapping(string => Contestant) public contestants; 
   // mapping(address => bool) public voters;
    mapping(address => Voter) public voters;
	uint public contestantsCount;
	// uint public counter;
	enum PHASE{reg, voting , done}
	PHASE public state;

	modifier onlyAdmin(){
		require(msg.sender==admin);
		_;
	}
	
	modifier validState(PHASE x){
	    require(state==x);
	    _;
	}

	constructor() {
		admin=msg.sender;
        state=PHASE.reg;
		// counter = 0;

	}

    function changeState(PHASE x) onlyAdmin public{
		require(x > state);
        state = x;
    }

	function addContestant(string memory _name , uint _age , string memory _uniqueId) public onlyAdmin validState(PHASE.reg){
		require(keccak256(abi.encodePacked(contestants[_uniqueId].uniqueId)) != keccak256(abi.encodePacked(_uniqueId)));
        contestantsCount++;
		contestants[_uniqueId]=Contestant(contestantsCount,_name,0 , _uniqueId ,_age);
	}

	function voterRegisteration(address user) public validState(PHASE.reg){
        require(msg.sender == user);
		voters[user].isRegistered=true;
	}

	function vote(string memory _contestantId) public validState(PHASE.voting){
        
		require(voters[msg.sender].isRegistered);
		require(!voters[msg.sender].hasVoted);
        require(keccak256(abi.encodePacked(contestants[_contestantId].uniqueId)) == keccak256(abi.encodePacked(_contestantId)));
		contestants[_contestantId].voteCount++;
		voters[msg.sender].hasVoted=true;
		voters[msg.sender].vote=_contestantId;
	}
}