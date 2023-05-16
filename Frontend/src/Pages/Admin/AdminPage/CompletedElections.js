import React, { useState, useEffect } from "react";
import AdminNavbar from "./Components/AdminNavbar";

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

  return (
    <>
      <AdminNavbar />
      <h1>Completed Elections</h1>
      <div className="election-card">
        {electionList.map((election) => {
            console.log(election.winner)
          return (
            <div key={election._id}>
              <h3>{election.title}</h3>
              {election.open ? (
                <p>Area Contested : {election.area}</p>
              ) : (
                <p>Department Contested : {election.department}</p>
              )}
              <p>Contesting Candidates Count : {election.candidates.length}</p>
              <p>Winning Seat Count : {election.maxWinners}</p>
              <p>Winners: {election.winner.map((w) => w.Name).join(", ")}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Results;
