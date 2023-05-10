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

module.exports = router;