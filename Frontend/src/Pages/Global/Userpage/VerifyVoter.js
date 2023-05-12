import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import UserNavbar from './Components/UserNavbar';

function VerifyVoter() {
    const navigate = useNavigate();
    const location = useLocation();
    const election = location.state?.data;

    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    const user = {
      uid: userDetails.uid,
    };
    const [isVerified, setIsVerified] = useState(false);

    const verifyUID = (userID) => {
        if(election.open){
            const userIDparams = userID.slice(0, 3);
            if(userIDparams !== election.constraints[0]){
                toast.error(`Your Unique ID should start with ${election.constraints[0]}`, {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: "dark",
                })
                setIsVerified(false);
                return;
            } else {
                toast.success('Your Unique ID is Verified. You can vote in this election.', {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: "dark",
                })
                setIsVerified(true);
                return;
            }
        } else {
            const branch = userID.slice(0, 3);
            const year = userID.slice(3, 7)
            const rollNo = userID.slice(7, 10);

            // console.log(typeof branch, typeof parseInt(year), typeof parseInt(rollNo))

            if (branch !== election.constraints[0]){
                toast.error(`Your branch should be ${election.constraints[0]}`, {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: "dark",
                })
                setIsVerified(false);
                return;
            } else if (parseInt(year) !== election.constraints[1]){
                toast.error(`Your batch year should be ${election.constraints[1]}`, {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: "dark",
                })
                setIsVerified(false);
                return;
            } else if (parseInt(rollNo) > election.constraints[2] && parseInt(rollNo) > 0){
                toast.error(`Your roll no should be less than ${election.constraints[2]}`, {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: "dark",
                })
                setIsVerified(false);
                return;
            } else {
                toast.success("Your Unique ID is Verified. You can vote in this election.", {
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
    }

    return (
      <>
        <UserNavbar />
        <h1>Voter Verification</h1>
        <Button variant="contained" color="primary" sx={{ width: 150, mx: 1, my: 2 }}
          onClick={() => verifyUID(user.uid)}
        >
            Verify UID
        </Button>
        {isVerified ? (
          <Button
            variant="contained"
            color="primary"
            sx={{ width: 200, mx: 1, my: 2 }}
            onClick={() =>
              navigate(`/user/elections/${election._id}/registration`, {
                state: { data: { ...election }, isVerified: isVerified },
              })
            }
          >
            Go to Registration
          </Button>
        ) : (
          ""
        )}
      </>
    );
}

export default VerifyVoter