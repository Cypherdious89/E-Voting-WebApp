import React, {useState, useEffect} from 'react'

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
            </div>
          )
        })}
      </div>
    </>
  )
}

export default ViewElections