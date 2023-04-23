import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';

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
  return (
    <>
      <h1>Ongoing Elections</h1>
      <div className="election-card">
        {electionList.map(ele  => {
          return (
            <div key={ele._id}>
              <h3>{ele.title}</h3>
              <p>Election Department/Zone : {ele.area}</p>
              <p>Contesting Candidates : {ele.maxCandidate}</p>
              <p>Winning Seats : {ele.maxVoteCount}</p>
              <div>
                <Link to={`${ele._id}/candidate-list`} state={{data: {...ele}}}>
                  <button className='primaryBtn'>Candidate List</button>
                </Link>
                <Link to={`${ele._id}/edit-election-details`} state={{data: {...ele}}}>
                  <button className='primaryBtn'>Modify Election Details</button>
                </Link>
                <Link to={`${ele._id}/change-election-phase`} state={{data: ele.phase}}>
                  <button className='primaryBtn'>Change Election Phase</button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default ViewElections