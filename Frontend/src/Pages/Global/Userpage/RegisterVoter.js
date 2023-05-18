import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import UserNavbar from './Components/UserNavbar';
import styles from '../Styles/register.module.css'
import Web3 from 'web3';
import ElectionJSON from '../../../contracts/Election.json'

function Registration() {
    const navigate = useNavigate();
    const location = useLocation();
    const election = location.state?.data;
    // const isVerified = location.state?.isVerified;
    const electionType = election.open ? "open" : "closed";
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    const userID = userDetails.uid;
    const userinfo = {
        name: userDetails.username,
        email: userDetails.email,
        mobile: userDetails.mobileNumber,
        uid: userDetails.uid
    }
    const [isVerified, setIsVerified] = useState(false)
    // const [tokenHash, setTokenHash] = useState("")

    console.log(userID, isVerified)

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
            // setTokenHash(txReceipt.tokenHash)
            return txReceipt;
        } else {
            throw Error('Select correct account');
        }
    }

    const handleUIDVerification = (userID) => {
      if (election.open) {
        const userIDparams = userID.slice(0, 3);
        if (userIDparams !== election.constraints[0]) {
          toast.error(
            `Your Unique ID should start with ${election.constraints[0]}`,
            {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              theme: "dark",
            }
          );
          setIsVerified(false);
          return;
        } else {
          toast.success(
            "Your Unique ID is Verified. You can vote in this election.",
            {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              theme: "dark",
            }
          );
          setIsVerified(true);
          return;
        }
      } else {
        const branch = userID.slice(0, 3);
        const year = userID.slice(3, 7);
        const rollNo = userID.slice(7, 10);

        if (branch !== election.constraints[0]) {
          toast.error(`Your branch should be ${election.constraints[0]}`, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "dark",
          });
          setIsVerified(false);
          return;
        } else if (parseInt(year) !== election.constraints[1]) {
          toast.error(`Your batch year should be ${election.constraints[1]}`, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "dark",
          });
          setIsVerified(false);
          return;
        } else if (
          parseInt(rollNo) > election.constraints[2] &&
          parseInt(rollNo) > 0
        ) {
          toast.error(
            `Your roll no should be less than ${election.constraints[2]}`,
            {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              theme: "dark",
            }
          );
          setIsVerified(false);
          return;
        } else {
          toast.success("Your Unique ID is Verified", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "dark",
          });
          setIsVerified(true);
          return;
        }
      }
    };

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
        <div className={styles.container}>
          <h1 className={styles.title}>Voter Registration</h1>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <h3 className={styles.subtitle}>Your Details</h3>
              <p className={styles.details}>Name: {userinfo.name}</p>
              <p className={styles.details}>Email: {userinfo.email}</p>
              <p className={styles.details}>Mobile: {userinfo.mobile}</p>
              <p className={styles.details}>Unique ID: {userinfo.uid}</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <h3 className={styles.subtitle}>Election Details</h3>
              <p className={styles.details}>Title: {election.title}</p>
              <p className={styles.details}>{election.description}</p>
            </div>
          </div>
          {isVerified ? (
            <div className={styles.buttonContainer}>
              <Button
                variant="contained"
                color="primary"
                className={styles.button}
                onClick={() => registerVoter()}
              >
                Register
              </Button>
            </div>
          ) : (
            <div className={styles.buttonContainer}>
              <Button
                variant="contained"
                color="primary"
                className={styles.button}
                onClick={() => handleUIDVerification(userID)}
              >
                Verify UID
              </Button>
            </div>
          )}
        </div>
      </>
    );
}

export default Registration