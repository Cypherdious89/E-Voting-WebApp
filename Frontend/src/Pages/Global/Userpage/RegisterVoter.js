import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import UserNavbar from './Components/UserNavbar';
import Web3 from 'web3';
import ElectionJSON from '../../../contracts/Election.json'

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

    async function addVoterTransaction() {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        if (accounts[0] === userDetails.walletAddress){
            const liveElection = new web3.eth.Contract(
              ElectionJSON.abi,
              election.address
            );
            const txReceipt = await liveElection.methods
              .voterRegisteration(userDetails.walletAddress)
              .send({
                from: accounts[0],
                gasLimit: 2100000
              });
            console.log(txReceipt);
            return txReceipt;
        } else {
            throw Error('Select correct account');
        }
    }

    async function registerVoter() {
        try {
            await addVoterTransaction();
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
        } catch(err) {
            console.log(err);
        }
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