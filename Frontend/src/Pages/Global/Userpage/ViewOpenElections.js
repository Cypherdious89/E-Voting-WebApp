import React, { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import styles from "../Styles/view_elections.module.css";
import UserNavbar from "./Components/UserNavbar";

function ViewElections() {
  const [electionList, setElectionList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5500/api/election/open/get/user", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((elections) => {
        setElectionList(elections.data);
      });
  }, []);

  const PropertiesGrid = ({ election }) => {
    const properties = [
      { title: "Area", value: election.area },
      { title: "Candidates", value: election.maxCandidates },
      { title: "Seats", value: election.maxWinners },
      {title: "Status", value: election.active === true ? "Active" : "Closed"},
      {title: "Age Restriction", value: election.ageRestriction === true ? "Yes" : "No"},
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
    const phaseToLink = {
      1: {
        path: `/user/elections/${election._id}/verification`,
        text: "Verify & Register",
      },
      2: { path: `/user/elections/${election._id}/vote`, text: "Vote Now" },
      3: { path: `/user/elections/${election._id}/results`, text: "Results" },
    };

    const { path, text } = phaseToLink[election.phase] || {};
    return (
      <div className={styles.card}>
        <div className={styles.header}>{election.title}</div>
        <div className={styles.body}>
          <h4 className={styles.description}>{election.description}</h4>
          <PropertiesGrid election={election} />
          <div className={styles.btn_container}>
            {election.phase === 1 && (
              <Link
                to={`/user/elections/${election._id}/candidates`}
                state={{ data: { ...election } }}
              >
                <button className={styles.cardBtn}>Candidate List</button>
              </Link>
            )}
            {election.phase >= 1 && (
              <Link
                to={`/user/elections/${election._id}/details`}
                state={{ data: { ...election } }}
              >
                <button className={styles.cardBtn}>Election Details</button>
              </Link>
            )}
            {election.phase >= 1 && election.phase <= 3 && (
              <Link to={path} state={{ data: { ...election } }}>
                <button className={styles.cardBtn}>{text}</button>
              </Link>
            )}
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
      <UserNavbar />
      <div className={styles.mainbody}>
        <h1 className={styles.title}>Active Open Elections</h1>
        {electionList.length > 0 ? <ElectionList electionList={electionList} />: <h3 className={styles.subheading}>No election found !</h3>}
      </div>
    </>
  );
}

export default ViewElections;
