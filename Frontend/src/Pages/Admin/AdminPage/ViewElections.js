import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import '../Styles/active_elections.css';

function ViewElections() {
  const [electionList, setElectionList] = useState([]);

  useEffect (() => {
    fetch("http://localhost:5500/api/get_election_data", {
      method: 'GET'
    }).then((res) => res.json())
      .then((elections) => {
        setElectionList(elections.data)
    });
  }, [])

  const ElectionCard = ({ election }) => {
    return (
      <div className="election-card">
        <div className="election-card-header">{election.title}</div>
        <div className="election-card-body">
          <ul className="election-card-text">
            <li>Department: {election.area}</li>
            <li>Contesting Candidates: {election.maxCandidate}</li>
            <li>Winning Seats: {election.maxVoteCount}</li>
            {/* add more election details here */}
          </ul>
          <div className="election-button-container">
            <Link to={`${election._id}/candidate-list`} state={{data: {...election}}}>
              <button className="election-card-button">Candidate List</button>
            </Link>
            <Link to={`${election._id}/edit-election-details`} state={{data: {...election}}}>
              <button className="election-card-button">Modify Election Details</button>
            </Link>
            <Link to={`${election._id}/change-election-phase`} state={{data: election.phase}}>
              <button className="election-card-button">Change Election Phases</button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const ElectionList = ({ electionsList}) => {
    return (
      <div className='election-container'>
        {electionList?.map((election) => (
          <ElectionCard key={election._id} election={election} />
        ))}
      </div>
    );
  };
  return (
    <>
      <div className='active-election-body'>
        <h1 className='active-election-title'>Active Elections</h1>
        <ElectionList electionList={electionList}/>
      </div>
    </>
  )
}

export default ViewElections