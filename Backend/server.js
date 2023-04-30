const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/UserData')
const Admin = require('./models/AdminData')
const Election = require('./models/ElectionData')
const jwt = require('jsonwebtoken')
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
    // console.log(req.body);
    try{
        await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
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
        password: req.body.password,
        mobileNumber: req.body.mobileNumber,
    })

    const userDetails = user;

    if(user){
        const token = jwt.sign({
            username : user.username,
            email : user.email
        }, "VGhpc0lzVGhlTG9naW5TZWNyZXQ=")
        return res.json({status: 'OK', user: token, details: userDetails});
    }
    else
        return res.json({status: 'error', user: false});
})

//? Admin Login route
app.post('/api/admin_login', async (req, res) => {
    const user = await Admin.findOne({
        email: req.body.email,
        password: req.body.password,
    })

    const adminDetails = user;

    if (user && (req.body.accessCode === adminAccessCode)) {
        const token = jwt.sign({
            username: user.name,
            email: user.email,
        }, "QWRtaW5Mb2dpbg==")
        return res.json({
            status: 'OK!',
            user: token,
            details: adminDetails
        });
    } else
        return res.json({
            status: 'error',
            user: false
        });
})

//! Dashboard Routes
//? Userpage route
app.get('/api/user', async (req, res) => {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, "VGhpc0lzVGhlTG9naW5TZWNyZXQ=")
        const email = decoded.email
        const user = await User.findOne({email: email})
        if(user)
            return res.json({status: 'ok'})
        else
            return res.json({status: 'error'})

    } 
    catch (error) {
        console.log(error)
        res.json({status: 'error', error: 'invalid token'})
    }
})

//? Adminpage route
app.get('/api/admin', async (req, res) => {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, "QWRtaW5Mb2dpbg==")
        const email = decoded.email
        const admin = await Admin.findOne({email: email})
        if (admin)
            return res.json({status: 'ok'})
        else
            return res.json({status: 'error'})
    } 
    catch (error) {
        console.log(error)
        res.json({status: 'error', error: 'invalid token'})
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