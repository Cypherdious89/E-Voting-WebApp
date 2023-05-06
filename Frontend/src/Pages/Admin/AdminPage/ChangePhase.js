import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import styles from '../Styles/phase.module.css'
import AdminNavbar from "./Components/AdminNavbar";

const ChangeElectionPhase = () => {  
  const navigate = useNavigate();
  const location = useLocation();
  const election = location.state?.data;
  const roles = sessionStorage.getItem("adminRoles");
  const adminRoles = JSON.parse(roles);

  
  const phaseMap = {
    0: "Creation phase",
    1: "Registration phase",
    2: "Voting phase",
    3: "Finalization phase",
    4: "Result phase",
    5: "Election end",
  };
  const status = election.active === true ? "Active" : "Closed";
  const type = election.open === true ? "open" : "closed";
  const electionID = election._id;
  let phase = election.phase, active = election.active;

  async function handlePhaseChange() {
    if (phase === 4) active = false;
    else phase += 1

    const response = await fetch('http://localhost:5500/api/change_election_phase', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        electionID,
        phase,
        active,
        adminRoles
      })
    });
    const data = await response.json();
    if (data.status === 'OK') {
      alert('Successfully updated Election Phase !');
      navigate('/admin/elections/view/'+type)
    } else {
      alert('Some error occurred, please try again !')
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
          <span className={styles.phaseStatus}>{status}</span>
        </p>
        <button className={styles.phaseBtn} onClick={()=>handlePhaseChange()}>Update Phase</button>
      </div>
    </>
  );
};

export default ChangeElectionPhase;
