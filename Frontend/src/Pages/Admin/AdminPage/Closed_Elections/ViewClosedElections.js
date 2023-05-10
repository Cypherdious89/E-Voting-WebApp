import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../Styles/view_elections.module.css";
import AdminNavbar from "../Components/AdminNavbar";


function ViewElections() {
  const [electionList, setElectionList] = useState([]);

  const phaseMap = {
    0: "Creation phase",
    1: "Registration phase",
    2: "Voting phase",
    3: "Result Phase",
    4: "Election end phase",
  };

  useEffect(() => {
    fetch("http://localhost:5500/api/get_closed_election_data", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((elections) => {
        setElectionList(elections.data);
      });
  }, []);

  const PropertiesGrid = ({ election }) => {
    const properties = [
      { title: "Department", value: election.department },
      { title: "Candidates", value: election.maxCandidates },
      { title: "Seats", value: election.maxWinners },
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
          <h4 className={styles.description}>{election.description}</h4>
          <PropertiesGrid election={election} />
          <div className={styles.btn_container}>
            {election.phase > 0 ? 
              <Link
                to={`/admin/elections/${election._id}/candidates`}
                state={{data: {...election}}}
              >
                <button className={styles.cardBtn}>Candidate List</button>
              </Link>
              :
              ""
            }
            {election.phase > 0 ? 
              <Link
              to={`/admin/elections/closed/${election._id}/voters`}
              state={{data: {...election}}}
            >
              <button className = {styles.cardBtn}>
                Registered Voters
              </button>
            </Link>
            :
            <Link
              to={`/admin/elections/edit/closed/${election._id}`}
              state={{data: {...election}}}
            >
              <button className = {styles.cardBtn}>
                Modify Election Details
              </button>
            </Link>
            }
            <Link
              to={`/admin/elections/${election._id}/phase`}
              state={{data: {...election}}}
            >
              <button className={styles.cardBtn}>
                Change Election Phase
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
        {electionList.length > 0 ? (
          <ElectionList electionList={electionList} />
        ) : (
          <h3 className={styles.subheading}>No election found !</h3>
        )}
      </div>
    </>
  );
}

export default ViewElections;
