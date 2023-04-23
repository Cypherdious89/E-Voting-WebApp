const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/UserData')
const Admin = require('./models/AdminData')
const Election= require('./models/ElectionData')
const jwt = require('jsonwebtoken')

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://0.0.0.0:27017/e-voting-webapp')

const adminAccessCode = "AdminLogin@2580_IIITA";

//Homepage route
app.get('/', (req, res) => {
    res.send('Node server running !!!')
})

//User signup route
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

//User Login route
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

//Userpage route
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

//Admin Login route
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
        return res.json({status: 'OK!', user: token, details: adminDetails});
    } 
    else
        return res.json({status: 'error', user: false});
})

//Adminpage route
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

//Add Election Route
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

//Show all ongoing elections
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

//Show all completed elections
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

//Listening port
app.listen(5500, () => {
    console.log('Server running on PORT 5500');
})