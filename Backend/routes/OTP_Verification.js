const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const twilio = require("twilio");

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const emailUsername = process.env.EMAIL_USERNAME;
const emailPassword = process.env.EMAIL_PASSWORD;

let mailOTP, mobileOTP;

//* Generate a random 4-digit OTP
function generateOTP() {
  const digits = "0123456789";
  let otp = "";
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
      console.log("Email sent: " + info.response);
    }
  });
}

//* Send OTP to mobile using Twilio
function sendOTPMobile(mobile, otp) {
  const accountSid = twilioAccountSid;
  const authToken = twilioAuthToken;
  const reqMobileNumber = "+91" + mobile;
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

//! OTP Sending & Verification routes
//? Send OTP to mail and mobile
router.post("/send", (req, res) => {
  try {
    const email = req.body.email;
    const mobile = req.body.mobile;
    mailOTP = generateOTP();
    mobileOTP = generateOTP();
    sendOTPEmail(email, mailOTP);
    sendOTPMobile(mobile, mobileOTP);
    return res.status(200).json({ status: "OK", message: "OTP sent successfully !" });
  } catch (err) {
    return res.status(403).json({ status: "error", message: "Some error occured" });
  }
});

//? Verify email and mobile number
router.post("/verify", (req, res) => {
  try {
    const mailVerification = req.body.otpMail === mailOTP;
    const mobileVerification = req.body.otpMobile === mobileOTP;
    if (mailVerification && mobileVerification) {
      console.log("Verification Successful");
      mailOTP = "", mobileOTP = "";
      return res.status(200).json({
        status: "OK",
        message: "OTP verified successfully! Please login to continue",
      });
    } else {
      console.log("Invalid OTP");
      return res.status(403).json({
        status: "error",
        message: "Invalid OTP! Please try again...",
      });
    }

  } catch (err) {
    return res.status(501).json({ status: "error", message: "Some error occured" });
  }
});

module.exports = router;
