import React, { useState, useEffect } from "react";
import AdminNavbar from "./Components/AdminNavbar";
import styles from '../Styles/result.module.css'
import { Button } from "@mui/material";
import DeleteModal from "./Components/DeleteModal";


function Results() {
  const [electionList, setElectionList] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [electionId, setElectionId] = useState("")

  useEffect(() => {
    fetch("http://localhost:5500/api/election/completed", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((elections) => {
        setElectionList(elections.data);
      });
  }, []);

  const ElectionCard = ({electionList}) => {
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
                <Button
                  variant="contained"
                  color="error"
                  className={styles.deleteBtn}
                  onClick={() => {
                    setDeleteModal(true);
                    setElectionId(election._id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Completed Elections</h1>
        {electionList.length > 0 ? 
          <ElectionCard electionList={electionList}/> 
          : 
          <h3>No inactive elections found !</h3>
        }
      </div>
      {deleteModal && (
        <DeleteModal
          setDeleteModal={setDeleteModal}
          electionID={electionId}
        />
      )}
    </>
  );
}

export default Results;
