const express = require("express");
const router = express.Router();
const checkRoleAuth = require("../middleware/RoleAuthorization");
const Election = require("../models/ElectionData");
const ObjectID = require("mongodb").ObjectId;

//! Candidate Functionality Routes
//? Add Candidate Route
router.post("/:election_id/add", checkRoleAuth, async (req, res) => {
  const phase = req.body.phase;
  const electionID = req.params.election_id;
  if (phase === 1) {
    try {
      const candidateDetails = {
        Name: req.body.candidateName,
        Age: req.body.candidateAge,
        Photo: {
          name: req.body.candidateImageName,
          file: req.body.candidateImage,
          uploadTime: new Date(),
        },
        UID: req.body.candidateUID,
        DOB: req.body.candidateDOB,
      };

      const filter = { _id: new ObjectID(`${electionID}`) };
      const update = { $push: { candidates: candidateDetails } };
      const result = await Election.updateOne(filter, update);
      console.log("Items matched : ", result.matchedCount);
      console.log("Items modified : ", result.modifiedCount);
      const updatedElections = await Election.findOne(filter);
      return res.status(200).json({
        status: "OK",
        election: updatedElections,
        candidate: candidateDetails,
      });
    } catch (err) {
      console.log(err);
      return res.status(403).json({ status: "error", data: err.message });
    }
  } else {
    return res.status(501).json({ status: "error" });
  }
});

//? Find candidate and update its details
router.post("/:election_id/edit", checkRoleAuth, async (req, res) => {
  const electionID = req.params.election_id, candidateID = req.body.candidateID;
  const phase = req.body.phase;
  if (phase === 1) {
    try {
      const updatedElections = await Election.findOneAndUpdate(
        {
          _id: new ObjectID(`${electionID}`),
          "candidates._id": new ObjectID(`${candidateID}`),
        },
        {
          $set: {
            "candidates.$.Name": req.body.candidateName,
            "candidates.$.Age": req.body.candidateAge,
            "candidates.$.Photo": {
              name: req.body.candidateImageName,
              file: req.body.candidateImage,
              uploadTime: new Date(),
            },
            "candidates.$.UID": req.body.candidateUID,
            "candidates.$.Age": req.body.candidateAge,
            "candidates.$.DOB": req.body.candidateDOB,
          },
        },
        { new: true }
      ).exec();
      return res.status(200).json({ status: "OK", election: updatedElections });
    } catch (err) {
      console.log(err);
      return res.status(403).json({ status: "error", data: err.message });
    }
  } else {
      return res.status(501).json({ status: "error" });
    }
  }
);

//? Get Candidate List for particular election
router.get("/:election_id/get", async (req, res) => {
  const electionID = req.params.election_id;
  try {
    const getElectionList = await Election.findOne({
      _id: new ObjectID(`${electionID}`),
    });
    const candidateList = getElectionList.candidates;
    if (candidateList.length != 0)
      return res.status(200).json({ status: "OK", data: candidateList });
    else return res.status(403).json({ status: "error", data: [] });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ status: "error", data: err.message });
  }
});

//? Find particular candidate details in a particular election
router.post("/:election_id/find/:candidate_id", async (req, res) => {
  const electionID = req.params.election_id, candidateID = req.params.candidate_id;
  try {
    const getCandidate = await Election.findOne(
      { _id: new ObjectID(`${electionID}`) },
      { candidates: { $elemMatch: { _id: new ObjectID(`${candidateID}`) } } }
    ).exec();
    return res.status(200).json({ status: "OK", candidate: getCandidate.candidates[0] });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ status: "error", data: err.message });
  }
});

//? Find particular candidate in a election & delete it
router.delete("/:election_id/delete/:candidate_id", checkRoleAuth, async (req, res) => {
    const electionID = req.params.election_id, candidateID = req.params.candidate_id;
    const phase = req.body.phase;
    if (phase === 1) {
      try {
        const filter = { _id: electionID };
        const update = { $pull: { candidates: { _id: candidateID } } };
        const result = await Election.updateOne(filter, update);
        console.log("Items matched : ", result.matchedCount);
        console.log("Items modified : ", result.modifiedCount);
        const updatedElections = await Election.findOne(filter);
        return res.status(200).json({
          status: "OK",
          election: updatedElections,
          message: "Candidate Deleted Successfully !",
        });
      } catch (err) {
        console.log(err);
        return res.status(403).json({
          status: "Error",
          data: err.message,
          message: "Server Error",
        });
      }
    } else {
      return res.status(501).json({
        status: "Error",
        message: "Cannot delete candidate in this phase",
      });
    }
  }
);

module.exports = router