import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/active_elections.css";
import AdminNavbar from "./Components/AdminNavbar";

function ViewElections() {
  const [electionList, setElectionList] = useState([]);

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
      {title: "Department", value: election.area},
      {title: "Candidates", value: election.maxCandidate},
      {title: "Seats", value: election.maxVoteCount},
      {title: "Phase", value: phaseMap[election.phase]},
      {title: "Status", value: election.active === true? "Active" : "Closed"},
    ]

    return (
      <div className="property-grid-container">
      {properties.map((property, index) => (
        <div key={index} className="property-grid-item">
          <div className="property-title">{property.title}</div>
          <div className="property-value">{property.value}</div>
        </div>
      ))}
    </div>
    );
  }

  const ElectionCard = ({ election }) => {
    return (
      <div className="election-card">
        <div className="election-card-header">{election.title}</div>
        <div className="election-card-body">
            <PropertiesGrid election={election} />
            <div className="election-button-container">
              <Link
                to={`/admin/elections/${election._id}/candidates`}
                state={{ data: { ...election } }}
              >
                <button className="election-card-button">Candidate List</button>
              </Link>
              <Link
                to={`/admin/elections/${election._id}/edit`}
                state={{ data: { ...election } }}
              >
                <button className="election-card-button">
                  Modify Election Details
                </button>
              </Link>
              <Link
                to={`/admin/elections/${election._id}/phase`}
                state={{ data: { ...election } }}
              >
                <button className="election-card-button">
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
      <div className="election-container">
        {electionList?.map((election) => (
          <ElectionCard key={election._id} election={election} />
        ))}
      </div>
    );
  };
  return (
    <>
      <AdminNavbar />
      <div className="active-election-body">
        <h1 className="active-election-title">Active Elections</h1>
        <ElectionList electionList={electionList} />
      </div>
    </>
  );
}

export default ViewElections;