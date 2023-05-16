// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.2 <0.9.0;

contract Election{
	
	struct Contestant{
		uint id;
		string name;
		uint voteCount;
        string uniqueId;
		uint age;
	}

	struct Voter{
		bool isRegistered;
		bool hasVoted;
		uint votesRemaining;
    	mapping(string => bool) votedFor;
	}

	address admin;
	mapping(string => Contestant) public contestants; 
    mapping(address => Voter) public voters;
	uint public contestantsCount;
	uint public maxVoteCount;
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

	constructor(uint _maxVoteCount) {
		admin=msg.sender;
        state=PHASE.reg;
		maxVoteCount = _maxVoteCount;
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
		require(voters[user].isRegistered == false);
		voters[user].isRegistered=true;
		voters[user].votesRemaining = maxVoteCount;
	}

	function vote(string memory _contestantId) public validState(PHASE.voting){
        require(voters[msg.sender].isRegistered);
		require(voters[msg.sender].votesRemaining > 0);
		require(!voters[msg.sender].votedFor[_contestantId]);

        Contestant storage contestant = contestants[_contestantId];
		require(bytes(contestant.name).length > 0); // check if the contestant exists
		contestant.voteCount++;

		voters[msg.sender].hasVoted=true;
		voters[msg.sender].votesRemaining--;
		voters[msg.sender].votedFor[_contestantId] = true;
	}

	function destruct() public onlyAdmin {
		require(msg.sender == admin);
		address payable owner = payable(msg.sender);
		selfdestruct(owner);
	}
}