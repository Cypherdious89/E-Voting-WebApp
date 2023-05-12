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

//? Change Election Phase & Status
router.put("/phase", checkRoleAuth, async (req, res) => {
  const electionID = req.body.electionID;
  try {
    const filter = { _id: new ObjectID(`${electionID}`) };
    const update = { $set: { phase: req.body.phase, active: req.body.active } };
    const result = await Election.updateOne(filter, update);
    return res.status(200).json({ status: "OK" });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ status: "error", data: err.message });
  }
});

//? Add voter to election
router.post('/:_id/voter/add', async (req, res) => {
  const electionID = req.params._id;
  const voterUID = req.body.userID;
  const verifiedVoter = req.body.isVerified;
  console.log(electionID, voterUID, verifiedVoter);
  try {
    if (verifiedVoter) {
      const findVoter = await Election.findOne({ _id: new ObjectID(`${electionID}`), voters: voterUID }).exec();
      if (findVoter) {
        return res.status(403).json({ status: "error", message: "Error ! Voter already registered for this election." });
      }
      const result = await Election.updateOne(
        { _id: new ObjectID(`${electionID}`) },
        { $push: { voters: voterUID } },
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
  const voterID = req.body.userID
  const filter = {_id: electionID, "candidates._id": candidateID, "candidates.votes": { $ne: voterID }}
  const update = {$addToSet: { "candidates.$.votes": voterID }}
  const param = { new: true }
  Election.findOneAndUpdate(filter, update, param)
    .then((updatedElection => {
      if (updatedElection) {
        return res.status(200).json({ status: "OK", message: "Vote recorded successfully"});
      } else {
        return res.status(403).json({ status: "error", message: "Voter has already voted"});
      }
    }))
    .catch((err) => {
      console.log(err);
      return res.status(501).json({ status: "error", message: "Server error"});
    });
});

module.exports = router;