const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserData");
const Admin = require("../models/AdminData");

const adminAccessCode = "AdminLogin@2580_IIITA";
const jwtSecretKeyUser = "VGhpc0lzVGhlTG9naW5TZWNyZXQ=";
const jwtSecretKeyAdmin = "QWRtaW5Mb2dpbg==";

//! Authentiction Routes
//? User signup route
router.post("/signup", async (req, res) => {
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      username: req.body.username,
      email: req.body.email,
      password: newPassword,
      mobileNumber: req.body.mobileNumber,
      aadhar: req.body.aadhar,
      uid: req.body.uid,
      walletAddress: req.body.walletAddress
    });
    return res.status(201).json({status: "OK",message: "User registration successful. Please login to continue...",});
  } catch (err) {
    console.log(err);
    return res.status(501).json({ status: "error", message: err._message });
  }
});

//? User Login route
router.post("/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    mobileNumber: req.body.mobileNumber,
    uid: req.body.uid,
  });

  if (!user) {
    return res.status(401).json({status: "error", user: false, message: "Invalid credentials !"});
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  const userDetails = user;

  if (isPasswordValid) {
    const userToken = jwt.sign({
        username: user.username,
        email: user.email,
        address: user.walletAddress
      }, jwtSecretKeyUser);
    return res.status(200).json({status: "OK", user: userToken, details: userDetails, message: "Login Successful !",});
  } else {
    return res.status(403).json({status: "error", user: false, message: "Password Incorrect, Please try again !"});
  }
});

//? Admin Login route
router.post("/admin_login", async (req, res) => {
  const admin = await Admin.findOne({
    email: req.body.email,
    mobileNo: req.body.mobileNo,
  });

  if (!admin) {
    return res.status(403).json({status: "error", admin: false,message: "Invalid credentials !"});
  }

  const adminDetails = admin;
  // console.log(admin)
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    admin.password
  );

  if (isPasswordValid && req.body.accessCode === adminAccessCode) {
    const adminToken = jwt.sign({
        username: admin.name,
        email: admin.email,
        access: admin.roles[0],
        role: admin.roles[1],
        address: admin.walletAddress
      },
      jwtSecretKeyAdmin
    );
    return res.status(200).json({status: "OK!", admin: adminToken, details: adminDetails});
  } else {
    return res.status(403).json({status: "error", user: false, message: "Invalid credentials !"});
  }
});

//! Dashboard Routes
//? Userpage route
router.get('/user', async (req, res) => {
    const userToken = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(userToken, "VGhpc0lzVGhlTG9naW5TZWNyZXQ=")
        const email = decoded.email
        const user = await User.findOne({email: email})
        if(user)
            return res.status(200).json({ status: "OK" });
        else
            return res.status(403).json({ status: "error" });

    } 
    catch (error) {
        console.log(error)
        return res.status(501).json({ status: "error", error: error });
    }
})

//? Adminpage route
router.get('/admin', async (req, res) => {
    const adminToken = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(adminToken, "QWRtaW5Mb2dpbg==")
        const email = decoded.email
        const admin = await Admin.findOne({email: email})
        if (admin)
            return res.status(200).json({status: 'OK'})
        else
            return res.status(403).json({status: 'error'})
    } 
    catch (error) {
        console.log(error)
        return res.status(501).json({status: 'error', error: error})
    }
})

module.exports = router;