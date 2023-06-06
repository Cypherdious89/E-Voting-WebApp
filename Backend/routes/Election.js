const express = require("express");
const router = express.Router();
const checkRoleAuth = require("../middleware/RoleAuthorization");
const Election = require("../models/ElectionData");
const ObjectID = require("mongodb").ObjectId;

//! Election Functionality Routes
//? Show all completed elections
router.get("/completed", async (req, res) => {
  try {
    const getElectionList = await Election.find({ active: { $all: false } });
    return res.status(200).json({ status: "OK!", data: getElectionList });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ status: "error" });
  }
});

//? Get voter List of particular election
router.get("/:election_id/voters", async (req, res) => {
  const electionID = req.params.election_id;
  // console.log(electionID);
  try {
    const getElection = await Election.findOne({
      _id: new ObjectID(`${electionID}`),
    });
    const voterList = getElection.voters;
    if (voterList.length != 0)
      return res.status(200).json({ status: "OK", data: voterList });
    else return res.status(204).json({ status: "error", data: [] });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ status: "error", data: err.message });
  }
});

//? Get Candidate List and winner for particular election
router.post("/:election_id/results", async (req, res) => {
  const electionID = req.params.election_id;
  const maxWinners = req.body.winnerCount
  try {
    const getElectionList = await Election.findOne({
      _id: new ObjectID(`${electionID}`),
    });
    const candidateList = getElectionList.candidates;
    const sortedCandidates = [...candidateList].sort(
      (a, b) => b.votes.length - a.votes.length
    );
    const winners = sortedCandidates.slice(0, maxWinners);

    const filter = {_id: new ObjectID(`${electionID}`)}
    const update = {$set: {winner: winners}}

    const result = await Election.updateOne(filter, update);

    if (candidateList.length !== 0) {
      return res.status(200).json({status: "OK", data: {candidates: candidateList, winners: winners}});
    } else {
      return res.status(204).json({ status: "error", data: [] });
    }
  } catch (err) {
    console.log(err);
    return res.status(501).json({ status: "error", data: err.message });
  }
});

//? Change Election Phase
router.put("/phase", checkRoleAuth, async (req, res) => {
  const electionID = req.body.electionID;
  try {
    const filter = { _id: new ObjectID(`${electionID}`) };
    let update = null;
    if (!!req.body.address) {
      update = {
        $set: { phase: req.body.phase, address: req.body.address },
      };
    } else {
      update = {
        $set: { phase: req.body.phase },
      };
    }
    const result = await Election.updateOne(filter, update);
    return res.status(200).json({ status: "OK" });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ status: "error", data: err.message });
  }
});

//? Close election
router.put('/:election_id/close', checkRoleAuth, async (req, res) => {
  const electionID = req.params.election_id;
  try {
    const filter = { _id: new ObjectID(`${electionID}`) };
    update = {$set: { active: false }};
    const result = await Election.updateOne(filter, update);
    return res.status(200).json({ status: "OK" });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ status: "error", data: err.message });
  }
});

//? Add voter to election
router.post('/:election_id/voter/add', async (req, res) => {
  const electionID = req.params.election_id;
  const voterID = req.body.userID;
  const verifiedVoter = req.body.isVerified;
  console.log(electionID, voterID, verifiedVoter);
  try {
    if (verifiedVoter) {
      const findVoter = await Election.findOne({ _id: new ObjectID(`${electionID}`), voters: voterID }).exec();
      if (findVoter) {
        return res.status(403).json({ status: "error", message: "Error ! Voter already registered for this election." });
      }
      const result = await Election.updateOne(
        { _id: new ObjectID(`${electionID}`) },
        { $push: { voters: voterID } },
        { upsert: true }
      ).exec();
      console.log(result);
      return res.status(200).json({ status: "OK", message: "Voter registered successfully !" });
    } else {
      return res.status(403).json({ status: "error", message: "Error ! Voter not verified." });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(501).json({ status: "error", message: "Server Error" });
  }
})

//? Find candidate and add vote
router.post("/:election_id/vote/:candidate_id", async (req, res) => {
  const electionID = req.params.election_id, candidateID = req.params.candidate_id;
  const voterID = req.body.userID;
  const maxWinners = req.body.winnerCount;
  console.log(voterID)
  try {
    const getCandidate = await Election.findOne(
      { _id: new ObjectID(`${electionID}`) },
      { candidates: { $elemMatch: { _id: new ObjectID(`${candidateID}`) } } }
    ).exec();

    const candidate = getCandidate.candidates[0];
    // console.log(candidate)
    const voteIndex = candidate.votes.indexOf(voterID);
    if (voteIndex === -1) {
      // console.log(voterID)
      candidate.votes.push(voterID);
      // console.log(candidate.votes)
      await getCandidate.save();
      return res.status(200).json({ status: "OK", message: "Vote Registered Successfully." });
    } else {
      return res.status(403).json({ status: "error", message: "Vote limit exceeded for voter." });
    }

  } catch (err) {
    console.log(err);
    return res.status(501).json({ status: "error", data: err.message, message: "Server Error" });
}});

//? Find election by ID and delete
router.delete("/:election_id/delete", checkRoleAuth, async (req, res) => {
  try {
    const electionId = req.params.election_id;
    // Find the election by ID and delete it
    const deletedElection = await Election.findByIdAndDelete(electionId);
    if (!deletedElection) {
      return res.status(404).json({ status: "err", error: "Election not found" });
    }
    return res.json({ status: "OK", message: "Election deleted successfully" });
  } catch (error) {
    console.error("Failed to delete election", error);
    return res.status(500).json({status: "err", error: "Failed to delete election" });
  }
});

module.exports = router;