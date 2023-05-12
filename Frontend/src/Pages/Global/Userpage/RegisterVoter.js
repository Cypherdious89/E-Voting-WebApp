import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import UserNavbar from './Components/UserNavbar';

function Registration() {
    const navigate = useNavigate();
    const location = useLocation();
    const election = location.state?.data;
    const isVerified = location.state?.isVerified;
    const electionType = election.open ? "open" : "closed";
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    const userID = userDetails.uid;
    const userinfo = {
        name: userDetails.username,
        email: userDetails.email,
        mobile: userDetails.mobileNumber
    }

    async function registerVoter() {
        const response = await fetch(`http://localhost:5500/api/election/${election._id}/voter/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userID,
              isVerified
            }),
          }
        );
        const data = await response.json();
        if (data.status === "OK") {
            toast.success(data.message, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "dark"
            })
        } else {
            toast.error(data.message, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "dark"
            })
        }
        setTimeout(() => {
          navigate("/user/elections/view/" + electionType);
        });
    }

    return (
        <>
            <UserNavbar />
            <h1>Voter Registration</h1>
            <h3>Your Details</h3>
            <p>Name: {userinfo.name}</p>
            <p>Email: {userinfo.email}</p>
            <p>Mobile: {userinfo.mobile}</p>
            <h3>Election Details</h3>
            <p>Title: {election.title}</p>
            <Button variant="contained" color="primary" sx={{ width: 150, mx: 1, my: 2 }}
                onClick={() => registerVoter()}
            >
                Register
            </Button>
        </>
    )
}

export default Registration