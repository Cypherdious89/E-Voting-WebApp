import React, { useState, useEffect } from "react";
import UserNavbar from "./Components/UserNavbar";
import styles from "../Styles/result.module.css";

function Results() {
  const [electionList, setElectionList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5500/api/election/completed", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((elections) => {
        setElectionList(elections.data);
      });
  }, []);

  const ElectionCard = ({ electionList }) => {
    return (
      <div className={styles.electionCard}>
        {electionList?.map((election) => {
          const electionType = election.open ? "open" : "closed";
          return (
            <>
              <div key={election._id}>
                <h3>{election.title}</h3>
                <p>Election Type : {electionType}</p>
                {election.open ? (
                  <p>Area Contested : {election.area}</p>
                ) : (
                  <p>Department Contested : {election.department}</p>
                )}
                <p>
                  Contesting Candidates Count : {election.candidates.length}
                </p>
                <p>Winning Seat Count : {election.maxWinners}</p>
                <p className={styles.winners}>
                  Winners: {election.winner.map((w) => w.Name).join(", ")}
                </p>
              </div>
            </>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <UserNavbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Completed Elections</h1>
        {electionList.length > 0 ? (
          <ElectionCard electionList={electionList} />
        ) : (
          <h3>No inactive elections found !</h3>
        )}
      </div>
    </>
  );
}

export default Results;
