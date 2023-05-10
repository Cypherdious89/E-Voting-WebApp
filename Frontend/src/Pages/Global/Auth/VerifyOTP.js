import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Styles/verifyOtp.module.css";
import { toast } from "react-toastify";

function OTPVerification() {
    const navigate = useNavigate();
    const [otpMail, setOtpMail] = useState("");
    const [otpMobile, setOtpMobile] = useState("");
    const [otpVerified, setOtpVerified] = useState(false)

      const handleKeyDown = (e) => {
        if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
          e.preventDefault();
        }
      };

    // useEffect(() => {
    //   setOtpSent(true);
    // }, []);

   async function verifyOTP() {
    //  if (!otpSent) {
    //    // check if OTP has been sent before making the API call
    //    toast.error("Please send OTP first.");
    //    return;
    //  }
     const response = await fetch("http://localhost:5500/api/otp/verify", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         otpMail: otpMail,
         otpMobile: otpMobile,
       }),
     });

     console.log("data fetched...");

     toast.info("Verifying OTP...")

     const data = await response.json();
     console.log("response data", data);

     if (data.status === "OK") {
        setOtpVerified(true)
        localStorage.setItem("otpVerified", otpVerified)
        navigate("/user/login");
        toast.success(data.message);
     } else {
       localStorage.clear();
       toast.error(data.message);
       navigate("/user/signup");
     }
   }

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>OTP Verification</h1>
            <p className={styles.message}>
                Please enter the 4-digit OTP that was sent to you on your registered
                email and mobile number
            </p>
            <form onSubmit={verifyOTP} className={styles.form}>
                <div className={styles.input_area}>
                    <label htmlFor="otpMail" className={styles.field_label}>
                        Mail OTP
                    </label>
                    <input
                        className={styles.otp_input}
                        type="password"
                        name="otpMail"
                        value={otpMail}
                        onChange={(e) => setOtpMail(e.target.value)}
                        onKeyDown={handleKeyDown}
                        maxLength={4}
                    />
                </div>
                <div className={styles.input_area}>
                    <label htmlFor="otpMail" className={styles.field_label}>
                        Mobile OTP
                    </label>
                    <input
                        className={styles.otp_input}
                        type="password"
                        name="otpMobile"
                        value={otpMobile}
                        onChange={(e) => setOtpMobile(e.target.value)}
                        onKeyDown={handleKeyDown}
                        maxLength={4}
                    />
                </div>
                <button className={styles.submit_button} type="submit" onClick={() => verifyOTP()}>
                    Verify OTP
                </button>
            </form>
        </div>
    );
}

export default OTPVerification;