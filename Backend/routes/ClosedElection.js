const express = require("express");200
const router = express.Router();
const checkRoleAuth = require("../middleware/RoleAuthorization");
const Election = require("../models/ElectionData");
const ObjectID = require("mongodb").ObjectId;

//* Closed Elections
//? Add Election Route
router.post("/add", checkRoleAuth,async (req, res) => {
    try {
      const newElection = await Election.create({
        open: false,
        title: req.body.title,
        description: req.body.description,
        department: req.body.department,
        constraints: [req.body.branch, req.body.year, req.body.maxVoters],
        maxCandidates: req.body.maxCandidates,
        maxVoter: req.body.maxVoters,
        maxWinners: req.body.maxWinners,
        active: true,
      });
      return res.status(200).json({ status: "OK", election: newElection });
    } catch (err) {
      console.log(err);
      return res.status(403).json({ status: "error" });
    }
  }
);

//? Modify Election Details - Closed
router.post("/:_id/edit", checkRoleAuth, async (req, res) => {
    const electionID = req.params._id;
    const phase = req.body.phase;
    if (phase === 0) {
      try {
        const filter = { _id: new ObjectID(`${electionID}`) };
        const update = {
          $set: {
            title: req.body.title,
            description: req.body.description,
            department: req.body.department,
            constraints: [req.body.branch, req.body.year, req.body.maxVoters],
            maxCandidates: req.body.maxCandidates,
            maxVoter: req.body.maxVoters,
            maxWinners: req.body.maxWinners,
          },
        };
        const result = await Election.updateOne(filter, update);
        console.log("Items matched : ", result.matchedCount);
        console.log("Items modified : ", result.modifiedCount);
        const updatedElections = await Election.findOne(filter);
        return res.status(200).json({ status: "OK", election: updatedElections });
      } catch (err) {
        console.log(err);
        return res.status(204).json({ status: "error", data: err.message });
      }
    } else {
      return res.status(501).json({ status: "error" });
    }
  }
);

//? Show all ongoing closed elections
router.get("/get", async (req, res) => {
  try {
    const getElectionList = await Election.find({
      active: { $all: true },
      open: { $all: false },
    });
    return res.status(200).json({ status: "OK!", data: getElectionList });
  } catch (err) {
    console.log(err);
    return res.status(403).json({ status: "error" });
  }
});

module.exports = router