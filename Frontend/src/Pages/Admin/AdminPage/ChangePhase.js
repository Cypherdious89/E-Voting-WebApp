import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"
import styles from '../Styles/phase.module.css'
import AdminNavbar from "./Components/AdminNavbar";
import Web3 from "web3"
import electionContract from "../../../contracts/Election.json"
// import {AccountData} from "@drizzle/react-components";
// import { useDrizzle } from "@drizzle/react-plugin";


const ChangeElectionPhase = () => {  
  const navigate = useNavigate();
  const location = useLocation();
  //const {drizzle, drizzleState} = useDrizzle();
  //const { status, send } = useContractDeployer();
  const election = location.state?.data;
  const roles = sessionStorage.getItem("adminRoles");
  const adminRoles = JSON.parse(roles);

  
  const phaseMap = {
    0: "Creation phase",
    1: "Registration phase",
    2: "Voting phase",
    3: "Result phase",
  };
  const electionStatus = election.active === true ? "Active" : "Closed";
  const type = election.open === true ? "open" : "closed";
  const electionID = election._id;
  const maxWinners = election.maxWinners;
  let phase = election.phase, active = election.active;

  async function createElectionContract() {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(electionContract.abi);
    const deployer = contract.deploy({
      data: electionContract.bytecode,
      arguments: [maxWinners]
    });
    const adminWalletAddress = await web3.eth.getAccounts();
    const deployedElection = await deployer.send({
      from: adminWalletAddress[0],
      gasLimit: 2100000,
    });
    console.log(deployedElection.options.address);
    return deployedElection;
  }

  async function phaseChangeTransaction(phase) {
    const web3 = new Web3(window.ethereum);
    const liveElection = new web3.eth.Contract(electionContract.abi , election.address);
    const walletAddresses = await web3.eth.getAccounts();
    const txReceipt = await liveElection.methods.changeState(phase - 1).send({
      from: walletAddresses[0],
      gasLimit: 2100000,
    });
    console.log(txReceipt);
    return txReceipt;
  }

  async function handlePhaseChange() {
    let deployedElectionContract = null;
    let creationBody = {
      electionID,
      phase,
      active,
      adminRoles,
    };
    if (phase === 3){ 
      active = false;
    } else {
      if (phase === 0){
        deployedElectionContract = await createElectionContract();
        creationBody.address = deployedElectionContract.options.address;
      } else {
        console.log("Before Try")
        try {
          console.log("Before Txn")
          await phaseChangeTransaction(phase + 1);
        } catch (err) {
          return;
        }
      }
      phase += 1;
      creationBody.phase = phase;
    }
    const response = await fetch('http://localhost:5500/api/election/phase', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(creationBody)
    });
    const data = await response.json();
    if (data.status === 'OK') {
      toast.success('Successfully updated Election Phase !', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
      setTimeout(() => {
        navigate('/admin/elections/view/'+type)
      }, 1500)
    } else {
      toast.error("Some error occurred, please try again !", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
      console.log(data);
      console.log(data.status);

    }
  }

  return (
    <>
      <AdminNavbar />
      <div className={styles.phaseContainer}>
        <h1 className={styles.phaseTitle}>Change Election Phase</h1>
        <p>
          <span className={styles.phaseSubheading}>Current phase : </span> 
          <span className={styles.phaseStatus}>{phaseMap[election.phase]}</span>
        </p>
        <p>
          <span className={styles.phaseSubheading}>Next Phase : </span> 
          <span className={styles.phaseStatus}>{phaseMap[election.phase+1]}</span>
        </p>
        <p>
          <span className={styles.phaseSubheading}>Status : </span> 
          <span className={styles.phaseStatus}>{electionStatus}</span>
        </p>
        <button className={styles.phaseBtn} onClick={()=>handlePhaseChange()}>Update Phase</button>
        {/* <AccountData accountIndex={0} units={'ether'} precision={3}/> */}
      </div>
    </>
  );
};

export default ChangeElectionPhase;
