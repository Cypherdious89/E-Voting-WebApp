import React, {useState, useEffect} from 'react'
import AdminNavbar from './Components/AdminNavbar';

function Results() {
  const [electionList, setElectionList] = useState([]);

  useEffect (() => {
    fetch("http://localhost:5500/api/election/completed", {
      method: 'GET'
    }).then((res) => res.json())
      .then((elections) => {
        setElectionList(elections.data)
    });
  }, [])
  return (
    <>
      <AdminNavbar />
      <h1>Completed Elections</h1>
      <div className="election-card">
        {electionList.map(ele  => {
          // console.log(ele)
          return (
            <div key={ele._id}>
              <h3>{ele.title}</h3>
              {ele.open ?
              <p>Area Contested : {ele.area}</p>
              :
              <p>Department Contested : {ele.department}</p>
              }
              <p>Contesting Candidates : {ele.maxCandidates}</p>
              {/* <p>Winner : {ele.winner[0].Name}</p> */}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Results