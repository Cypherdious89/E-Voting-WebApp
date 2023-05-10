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
const nodemailer = require("nodemailer")
const twilio = require('twilio')

//! Environment Variables
const port = 5500;
const mongoURI = "mongodb://0.0.0.0:27017/e-voting-webapp";
const adminAccessCode = "AdminLogin@2580_IIITA";
const jwtSecretKeyUser = "VGhpc0lzVGhlTG9naW5TZWNyZXQ=";
const jwtSecretKeyAdmin = "QWRtaW5Mb2dpbg==";
const twilioAccountSid = "ACe9d2620f5465782ba0b1328ac5adbc38";
const twilioAuthToken = "9bfae6a5e6848adb1df49c0adef75588";
const twilioPhoneNumber = "+18622929574";
const emailUsername = "priyanshsingh1@gmail.com";
const emailPassword = "lpdjfrjachhqrrnh";


app.use(cors());
app.use(express.json({limit: '5mb'}));

mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Connection Error:", err));


//* Middleware to check for role based authorization on admin module
function checkAdminReadWrite(req, res, next) {
    console.log("Checking admin access")
    const isAdmin = req.body.adminRoles[1] === 'Admin';
    const hasReadWrite = req.body.adminRoles[0] === 'readwrite';
    if (isAdmin && hasReadWrite) {
        console.log("Admin access approved !")
        // User has the necessary permissions, so allow them to continue
        next();
    } else {
        // User does not have the necessary permissions, so return an error response
        console.log('Only admins can modify permissions and data')
        res.status(403).json({status:'error', error: 'Forbidden'});
    }
}

//* Generate a random 4-digit OTP
function generateOTP() {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 4; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

//* Send OTP to email using Nodemailer
function sendOTPEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUsername,
      pass: emailPassword,
    },
  });
  const mailOptions = {
    from: emailUsername,
    to: email,
    subject: "OTP Verification for your account",
    text: `Your OTP for email verification is ${otp}`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

//* Send OTP to mobile using Twilio
function sendOTPMobile(mobile, otp) {
  const accountSid = twilioAccountSid;
  const authToken = twilioAuthToken;
  const reqMobileNumber = "+91"+mobile
    console.log(reqMobileNumber);
  const client = twilio(accountSid, authToken);
  client.messages
    .create({
      body: `Your OTP for mobile verification is ${otp}`,
      from: twilioPhoneNumber,
      to: reqMobileNumber,
    })
    .then((message) => console.log(message.sid));
}

//! Home route
app.get('/', (req, res) => {
    return res.json('Node server running !!!')
})

let mailOTP, mobileOTP;
//! OTP Sending & Verification routes
//? Send OTP to mail and mobile
app.post('/api/otp/send', (req, res) => {
    try {
        const email = req.body.email;
        const mobile = req.body.mobile;
        mailOTP = generateOTP();
        mobileOTP = generateOTP();
        sendOTPEmail(email, mailOTP);
        sendOTPMobile(mobile, mobileOTP);
        return res.json({ status: 'OK' , message: "OTP sent successfully !"});
    }
    catch(err){
        return res.json({ status: 'error', message: "Some error occured" });
    }
})

//? Verify email and mobile number
app.post('/api/otp/verify', (req, res) => {
    try {
        const mailVerification = (req.body.otpMail === mailOTP);
        const mobileVerification = (req.body.otpMobile === mobileOTP);

        if(mailVerification && mobileVerification){
            console.log('Verification Successful')
            return res.json({ status: 'OK' , message: "OTP verified successfully! Please login to continue" });
        }
        else{
            console.log("Invalid OTP");
            return res.json({ status: 'error', message: "Invalid OTP! Please try again..." });
        }
        
        mailOTP = "", mobileOTP = "";
    }
    catch(err){
        return res.json({ status: 'error', message: "Some error occured" });
    }
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
        return res.json({'status' :'OK', message: 'User registration successful. Please login to continue...'});
    } catch(err){
        console.log(err)
        return res.json({status: 'error', message:'User already exists'})
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
            username: user.username, 
            email: user.email,
        }, jwtSecretKeyUser, {expiresIn: '1h'});
        return res.json({status: 'OK', user: userToken, details: userDetails, message: 'Login Successful !'});
    }
    else{
        return res.json({status: 'error', user: false, message: "Invalid Credentials, Please try again !"});
    }
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
            access: admin.roles[0],
            role: admin.roles[1],
        }, jwtSecretKeyAdmin, {expiresIn: '15m'})
        return res.json({status: 'OK!', admin: adminToken, details: adminDetails});
    } else {
        return res.json({status: 'error', user: false, message: "Invalid username or email !"});
    }
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
        console.log(error)
        return res.json({status: 'error', error: error})
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
        console.log(error)
        return res.json({status: 'error', error: error})
    }
})

//! Election Functionality Routes
//* Open Elections
//? Add Election Route
app.post('/api/add_open_election_data', checkAdminReadWrite, async (req, res) => {
    try {
        const newElection = await Election.create({
            open: true,
            title: req.body.title,
            description: req.body.description,
            area: req.body.area,
            constraints: [req.body.code],
            maxCandidates: req.body.maxCandidates,
            maxVoter: req.body.maxVoters,
            maxWinners: req.body.maxWinners,
            ageRestriction: req.body.ageRestriction,
            active: true,
        })
        return res.json({'status': 'OK', election: newElection});
    }
    catch (err) {
        console.log(err)
        return res.json({status: 'error', data: err.message});
    }
})

//? Modify Election Details
app.post('/api/:_id/edit_open_election', checkAdminReadWrite, async(req, res) => {
    const electionID = req.params._id
    const phase = req.body.phase;
    if(phase === 0){
        try {
        const filter = { _id: new ObjectID(`${electionID}`) };
        const update = {
            $set: {
            title: req.body.title,
            description: req.body.description,
            area: req.body.area,
            constraints: [req.body.code],
            maxCandidates: req.body.maxCandidates,
            maxVoter: req.body.maxVoters,
            maxWinners: req.body.maxWinners,
            ageRestriction: req.body.ageRestriction,
            },
        };
        const result = await Election.updateOne(filter, update);
        console.log("Items matched : ", result.matchedCount);
        console.log("Items modified : ", result.modifiedCount);
        const updatedElections = await Election.findOne(filter);
        return res.json({ status: "OK", election: updatedElections });
        } catch (err) {
        console.log(err);
        return res.json({ starus: "error", data: err.message });
        }
    } else {
        return res.json({ starus: "error", data: err.message });
    }
    
})

//? Show all ongoing elections
app.get('/api/get_open_election_data', async (req, res) => {
    try {
        const getElectionList = await Election.find({active: {$all : true}, open: {$all : true}})
        return res.json({status: 'OK!', data: getElectionList});
    } 
    catch (err) {
        console.log(err);
        return res.json({status: 'error', data: err.message});
    }
})

//* Closed Elections
//? Add Election Route
app.post('/api/add_closed_election_data', checkAdminReadWrite, async (req, res) => {
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
        })
        return res.json({'status': 'OK', election: newElection});
    }
    catch (err) {
        console.log(err)
        return res.json({status: 'error'})
    }
})

//? Modify Election Details - Closed
app.post('/api/:_id/edit_closed_election', checkAdminReadWrite, async(req, res) => {
    const electionID = req.params._id
    const phase = req.body.phase;
    if(phase === 0){
        try {
            const filter = {_id: new ObjectID(`${electionID}`)};
            const update = {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    department: req.body.department,
                    constraints: [req.body.branch, req.body.year, req.body.maxVoters],
                    maxCandidates: req.body.maxCandidates,
                    maxVoter: req.body.maxVoters,
                    maxWinners: req.body.maxWinners,
                }
            };
            const result = await Election.updateOne(filter, update);
            console.log("Items matched : ", result.matchedCount);
            console.log("Items modified : ", result.modifiedCount);
            const updatedElections = await Election.findOne(filter);
            return res.json({status: 'OK', election: updatedElections});
        }
        catch(err) {
            console.log(err);
            return res.json({status: 'error', data: err.message})
        }
    } else {
        return res.json({status: 'error', data: err.message})
    }
})

//? Show all ongoing closed elections
app.get('/api/get_closed_election_data', async (req, res) => {
    try {
        const getElectionList = await Election.find({active: {$all : true}, open: {$all : false}})
        return res.json({status: 'OK!', data: getElectionList});
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
        return res.json({status: 'OK!', data: getElectionList});
    }
    catch (err) {
        console.log(err);
        return res.json({status: 'error'});
    }
})

//? Change Election Phase & Status
app.put('/api/change_election_phase', checkAdminReadWrite, async(req, res) => {
    const electionID = req.body.electionID;
    try{
        const filter = {"_id": new ObjectID(`${electionID}`)}
        const update = {$set : {phase: req.body.phase, active: req.body.active}}
        const result = await Election.updateOne(filter, update);
        return res.json({status: 'OK'})
    } 
    catch (err) {
        console.log(err);
        return res.json({status: 'error', data: err});
    }
})

//! Candidate Functionality Routes
//? Add Candidate Route
app.post('/api/add_candidate', checkAdminReadWrite, async(req, res) => {
    const phase = req.body.phase;
    if(phase === 1){
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

          const filter = { _id: new ObjectID(`${req.body.electionID}`) };
          const update = { $push: { candidates: candidateDetails } };
          const result = await Election.updateOne(filter, update);
          console.log("Items matched : ", result.matchedCount);
          console.log("Items modified : ", result.modifiedCount);
          const updatedElections = await Election.findOne(filter);
          return res.json({
            status: "OK",
            election: updatedElections,
            candidate: candidateDetails,
          });
        } catch (err) {
          console.log(err);
          return res.json({ status: "error", data: err.message });
        }
    } else {
        return res.json({status: 'error', data: err.message});
    }
})

//? Find candidate and update its details
app.post('/api/:_id/edit_candidate_details', checkAdminReadWrite, async(req, res) => {
    const electionID = req.params._id, candidateID = req.body.candidateID;
    const phase = req.body.phase;
    if(phase === 1){
        try {
            const updatedElections = await Election.findOneAndUpdate(
                {_id: new ObjectID(`${electionID}`), 'candidates._id': new ObjectID(`${candidateID}`)},
                {$set: {
                    'candidates.$.Name': req.body.candidateName,
                    'candidates.$.Age': req.body.candidateAge,
                    'candidates.$.Photo': {
                        name: req.body.candidateImageName,
                        file: req.body.candidateImage,
                        uploadTime: new Date()
                    },
                    'candidates.$.UID': req.body.candidateUID,
                    'candidates.$.Age' : req.body.candidateAge,
                    'candidates.$.DOB' : req.body.candidateDOB
                }},
                {new: true}
            ).exec()
            return res.json({status: 'OK', election: updatedElections});
        }
        catch (err) {
            console.log(err);
            return res.json({status: 'error', data: err.message});
        }
    } else {
            return res.json({ status: "error", data: err.message });
    }
})

//? Get Candidate List for particular election
app.get('/api/get_candidates/:_id', async(req, res) => {
    const electionID = req.params._id
    try{
        const getElectionList = await Election.findOne({_id: new ObjectID(`${electionID}`)})
        const candidateList = getElectionList.candidates;
        if(candidateList.length != 0)
            return res.json({status: 'OK', data: candidateList});
        else
            return res.json({status: 'error', data: []})
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
        return res.json({status: 'OK', candidate: getCandidate.candidates[0]});

    }
    catch (err) {
        console.log(err);
        return res.json({status: 'error', data: err});
    }
})


//? Find particular candidate in a election & delete it
app.delete('/api/:election_id/delete_candidate/:candidate_id', checkAdminReadWrite, async(req, res) => {
    const electionID = req.params.election_id, candidateID = req.params.candidate_id;
    const phase = req.body.phase;
    if(phase === 1){
        try {
            const filter = {_id: electionID};
            const update = {$pull : {candidates: {_id: candidateID}}};
            const result = await Election.updateOne(filter, update);
            console.log("Items matched : ", result.matchedCount);
            console.log("Items modified : ", result.modifiedCount);
            const updatedElections = await Election.findOne(filter);
            return res.json({status: "OK", election: updatedElections, message: "Candidate Deleted Successfully !"})
        }
        catch (err){
            console.log(err);
            return res.json({status: "Error", data: err, message: "Server Error"})
        }
    } else {
            return res.json({status: "Error", data: err, message: "Cannot delete candidate in this phase"}) 
 
    }
})

//! Listening port Route
app.listen(port, () => {
    console.log('Server running on PORT 5500');
})