import React from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import styles from '../../Styles/Modal.module.css'
import { RiCloseLine } from "react-icons/ri";
import Web3 from "web3";
import ElectionJSON from "../../../../contracts/Election.json";


const VoteModal = ({setVoteModal, election, candidate}) => {
    const navigate = useNavigate();
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    const userID = userDetails.uid;
    console.log(`User UID ${userID}`)
    console.log(`Candidate UID ${candidate.UID}`)
    async function castVoteTransaction() {
      const web3 = new Web3(window.ethereum);
      const liveElection = new web3.eth.Contract(
        ElectionJSON.abi,
        election.address
      );
      const txReceipt = await liveElection.methods.vote(candidate.UID).send({
        from: sessionStorage.getItem("walletAddress"),
        gasLimit: 2100000,
      });
      console.log(txReceipt);
      return txReceipt;
    }

    async function VoteCandidate() {
        await castVoteTransaction();
        const response = await fetch(`http://localhost:5500/api/election/${election._id}/vote/${candidate._id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userID
        })
        });
        const data = await response.json();
        if(data.status === 'OK') {
            toast.success(data.message, {
                position: "top-center",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "dark"
            })
            setTimeout(() => {
                navigate(`/user/dashboard`, {
                state: { data: { ...data.election } },
                });
            }, 500);
        } else {
            console.log(data.data)
            toast.error(data.message, {
            position: "top-center",
            autoClose: 500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "dark"
            })
            setTimeout(() => {
              navigate(`/user/dashboard`, {
                state: { data: { ...data.election } },
              });
            }, 500);
        }
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
    return (
        <>
            <div className={styles.darkBG} onClick={() => setVoteModal(false)} />
            <div className={styles.centered}>
                <div className={styles.voteModal}>
                <div className={styles.modalHeader}>
                    <h5 className={styles.heading}>Dialog</h5>
                </div>
                <button className = {styles.closeBtn} onClick = {() => setVoteModal(false)}>
                    <RiCloseLine style={{ marginBottom: "-3px" }} />
                </button>
                <div className={styles.modalContent}>
                    Are you sure you want to vote theis candidate ?
                </div>
                <div className={styles.modalActions}>
                    <div className={styles.actionsContainer}>
                    <button className={styles.primaryBtn} onClick={() => VoteCandidate()}>Confirm</button>
                    <button className={styles.cancelBtn} onClick={() => setVoteModal(false)}>Cancel</button>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
};

export default VoteModal;