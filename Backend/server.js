const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/UserData')
const Admin = require('./models/AdminData')
const Election = require('./models/ElectionData')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const ObjectID = require('mongodb').ObjectId

app.use(cors());
app.use(express.json({limit: '5mb'}));

mongoose.connect('mongodb://0.0.0.0:27017/e-voting-webapp')

const adminAccessCode = "AdminLogin@2580_IIITA"; //* Admin Access Code

//! Home route
app.get('/', (req, res) => {
    res.send('Node server running !!!')
})

//! Authentiction Routes
//? User signup route
app.post('/api/signup', async (req, res) => {
    try{
        const newPassword = await bcrypt.hash(req.body.password, 10)
        // const newAadhar = await bcrypt.hash(req.body.aadhar, 10)
        await User.create({
            username: req.body.username,
            email: req.body.email,
            password: newPassword,
            mobileNumber: req.body.mobileNumber,
            aadhar: req.body.aadhar,
            uid: req.body.uid
        })
        res.json({'status' :'OK!'});
    } catch(err){
        res.json({status: 'error', error:'Duplicate Email'})
    }
})

//? User Login route
app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
    })

    if(!user){
        return res.json({status: 'error', user: false, message: "Invalid email or mobile number !"});
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)

    const userDetails = user;

    if (isPasswordValid) {
        const userToken = jwt.sign({
            username : user.username,
            email : user.email
        }, "VGhpc0lzVGhlTG9naW5TZWNyZXQ=")
        return res.json({status: 'OK', user: userToken, details: userDetails});
    }
    else
        return res.json({status: 'error', user: false, message: "Invalid username or email !"});
})

//? Admin Login route
app.post('/api/admin_login', async (req, res) => {
    const admin = await Admin.findOne({
        email: req.body.email,
        mobileNo: req.body.mobileNo
    })

    if(!admin){
        return res.json({status: 'error', admin: false, message: "Invalid email or mobile number !"});
    }

    const adminDetails = admin;
    const isPasswordValid = await bcrypt.compare(req.body.password, admin.password);

    if (isPasswordValid && (req.body.accessCode === adminAccessCode)) {
        const adminToken = jwt.sign({
            username: admin.name,
            email: admin.email,
        }, "QWRtaW5Mb2dpbg==")
        return res.json({status: 'OK!', admin: adminToken, details: adminDetails});
    } else
        return res.json({status: 'error', user: false, message: "Invalid username or email !"});
})

//! Dashboard Routes
//? Userpage route
app.get('/api/user', async (req, res) => {
    const userToken = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(userToken, "VGhpc0lzVGhlTG9naW5TZWNyZXQ=")
        const email = decoded.email
        const user = await User.findOne({email: email})
        if(user)
            return res.json({status: 'OK'})
        else
            return res.json({status: 'error'})

    } 
    catch (error) {
        res.json({status: 'error', error: error})
    }
})

//? Adminpage route
app.get('/api/admin', async (req, res) => {
    const adminToken = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(adminToken, "QWRtaW5Mb2dpbg==")
        const email = decoded.email
        const admin = await Admin.findOne({email: email})
        if (admin)
            return res.json({status: 'OK'})
        else
            return res.json({status: 'error'})
    } 
    catch (error) {
        res.json({status: 'error', error: error})
    }
})

//! Election Functionality Routes
//? Add Election Route
app.post('/api/add_election_data', async (req, res) => {
    // console.log(req.body)
    try {
        await Election.create({
            title: req.body.title,
            area: req.body.dept,
            maxCandidate: req.body.maxCandidate,
            maxVoter: req.body.maxVoters,
            maxVoteCount: req.body.maxVoteCount,
            ageRestriction: req.body.ageRestriction,
        })
        res.json({'status': 'OK!'});
    }
    catch (err) {
        console.log(err)
        res.json({status: 'error'})
    }
})

//? Modify Election Details
app.post('/api/:_id/edit_election_details', async(req, res) => {
    const electionID = req.params._id
    try {
        const filter = {_id: new ObjectID(`${electionID}`)};
        const update = {
            $set: {
                title: req.body.title,
                area: req.body.dept,
                maxCandidate: req.body.maxCandidate,
                maxVoter: req.body.maxVoters,
                maxVoteCount: req.body.maxVoteCount,
                ageRestriction: req.body.ageRestriction,
            }
        };
        const result = await Election.updateOne(filter, update);
        console.log(result);
        res.send({status: 'OK'})
    }
    catch(err) {
        console.log(err);
        res.send({starus: 'error', data: err})
    }
})

//? Show all ongoing elections
app.get('/api/get_election_data', async (req, res) => {
    try {
        const getElectionList = await Election.find({active: {$all : true}})
        res.send({status: 'OK!', data: getElectionList});
    } 
    catch (err) {
        console.log(err);
        return res.json({status: 'error'});
    }
})

//? Show all completed elections
app.get('/api/get_completed_elections', async (req, res) => {
    try {
        const getElectionList = await Election.find({active: {$all : false}})
        res.send({status: 'OK!', data: getElectionList});
    }
    catch (err) {
        console.log(err);
        return res.json({status: 'error'});
    }
})

//? Change Election Phase & Status
app.put('/api/change_election_phase', async(req, res) => {
    const electionID = req.body.electionID;
    try{
        const filter = {"_id": new ObjectID(`${electionID}`)}
        const update = {$set : {phase: req.body.phase, active: req.body.active}}
        const result = await Election.updateOne(filter, update);
        res.send({status: 'OK'})
    } 
    catch (err) {
        console.log(err);
        return res.json({status: 'error', data: err});
    }
})

//! Candidate Functionality Routes
//? Add Candidate Route
app.post('/api/add_candidate', async(req, res) => {
    try {
        const candidateDetails = {
            candidateName: req.body.candidateName,
            candidateAge: req.body.candidateAge,
            candidatePhoto: {
                name: req.body.candidateImageName,
                file: req.body.candidateImage,
                uploadTime: new Date()
            },
            candidateUID: req.body.candidateUID,
            candidateDOB: req.body.candidateDOB
        }

        const filter = {_id: new ObjectID(`${req.body.electionID}`)};
        const update = {$push: {candidates: candidateDetails}};
        const result = await Election.updateOne(filter, update);
        res.send({status: 'OK'});
    } 
    catch (err) {
        console.log(err);
        return res.json({status: 'error', data: err});
    }
})

//? Find candidate and update its details
app.post('/api/:_id/edit_candidate_details', async(req, res) => {
    const electionID = req.params._id, candidateID = req.body.candidateID;
    try {
        const query = await Election.findOneAndUpdate(
            {_id: new ObjectID(`${electionID}`), 'candidates._id': new ObjectID(`${candidateID}`)},
            {$set: {
                'candidates.$.candidateName': req.body.candidateName,
                'candidates.$.candidateAge': req.body.candidateAge,
                'candidates.$.candidatePhoto': {
                    name: req.body.candidateImageName,
                    file: req.body.candidateImage,
                    uploadTime: new Date()
                },
                'candidates.$.candidateUID': req.body.candidateUID,
                'candidates.$.candidateAge' : req.body.candidateAge,
                'candidates.$.candidateDOB' : req.body.candidateDOB
            }},
            {new: true}
        ).exec()
        res.send({status: 'OK'});
    }
    catch (err) {
        console.log(err);
        return res.json({status: 'error', data: err});
    }
})

//? Get Candidate List for particular election
app.get('/api/get_candidates/:_id', async(req, res) => {
    const electionID = req.params._id
    try{
        const getElectionList = await Election.findOne({_id: new ObjectID(`${electionID}`)})
        const candidateList = getElectionList.candidates;
        if(candidateList.length != 0)
            res.send({status: 'OK', data: candidateList});
        else
            res.send({status: 'error', data: []})
    }
    catch(err){
        console.log(err);
        return res.json({status: 'error', data: err});
    }
})

//? Find particular candidate details in a particular election
app.post('/api/:_id/find_candidate_details', async (req, res) => {
    const electionID = req.params._id, candidateID = req.body.candidateID;
    try {
        const getCandidate = await Election.findOne(
            {"_id": new ObjectID(`${electionID}`)},
            {candidates: {$elemMatch: {"_id": new ObjectID(`${candidateID}`)}}}
        ).exec()
        res.send({status: 'OK', candidate: getCandidate.candidates[0]});

    }
    catch (err) {
        console.log(err);
        return res.json({status: 'error', data: err});
    }
})


//? Find particular candidate in a election & delete it
app.delete('/api/:election_id/delete_candidate/:candidate_id', async(req, res) => {
    const electionID = req.params.election_id, candidateID = req.params.candidate_id;
    try {
        const filter = {_id: electionID};
        const update = {$pull : {candidates: {_id: candidateID}}};
        const result = await Election.updateOne(filter, update);
        return res.json({status: "OK", message: "Candidate Deleted Successfully !"})
    }
    catch (err){
        console.log(err);
        return res.json({satus: "Error", data: err, message: "Server Error"})
    }
})

//! Listening port Route
app.listen(5500, () => {
    console.log('Server running on PORT 5500');
})