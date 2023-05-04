import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
// import { useLocation } from 'react-router-dom';
import styles from "../Styles/view_elections.module.css";
import AdminNavbar from "./Components/AdminNavbar";

function ViewElections() {
  const [electionList, setElectionList] = useState([]);
  const location = useLocation();
  const roles = location.state?.data

  const phaseMap = {
    0: "Creation phase",
    1: "Registration phase",
    2: "Voting phase",
    3: "Finalization phase",
    4: "Result Phase",
    5: "Election end phase",
  };

  useEffect(() => {
    fetch("http://localhost:5500/api/get_election_data", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((elections) => {
        setElectionList(elections.data);
      });
  }, []);

  const PropertiesGrid = ({ election }) => {
    const properties = [
      { title: "Department", value: election.area },
      { title: "Candidates", value: election.maxCandidate },
      { title: "Seats", value: election.maxVoteCount },
      { title: "Phase", value: phaseMap[election.phase] },
      {
        title: "Status",
        value: election.active === true ? "Active" : "Closed",
      },
    ];

    return (
      <div className={styles.grid_container}>
        {properties.map((property, index) => (
          <div key={index} className={styles.grid_item}>
            <div className={styles.grid_title}>{property.title}</div>
            <div className={styles.grid_value}>{property.value}</div>
          </div>
        ))}
      </div>
    );
  };

  const ElectionCard = ({ election }) => {
    return (
      <div className={styles.card}>
        <div className={styles.header}>{election.title}</div>
        <div className={styles.body}>
          <PropertiesGrid election={election} />
          <div className={styles.btn_container}>
            <Link
              to={`/admin/elections/${election._id}/candidates`}
              state={{data: {...election}, adminRoles: roles}}
            >
              <button className={styles.cardBtn}>Candidate List</button>
            </Link>
            <Link
              to={`/admin/elections/${election._id}/edit`}
              state={{data: {...election}, adminRoles: roles}}
            >
              <button className = {styles.cardBtn}>
                Modify Election Details
              </button>
            </Link>
            <Link
              to={`/admin/elections/${election._id}/phase`}
              state={{data: {...election}, adminRoles: roles}}
            >
              <button className={styles.cardBtn}>
                Change Election Phases
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const ElectionList = () => {
    return (
      <div className={styles.listContainer}>
        {electionList?.map((election) => (
          <ElectionCard key={election._id} election={election} />
        ))}
      </div>
    );
  };
  return (
    <>
      <AdminNavbar />
      <div className={styles.mainbody}>
        <h1 className={styles.title}>Active Elections</h1>
        <ElectionList electionList={electionList} />
      </div>
    </>
  );
}

export default ViewElections;
