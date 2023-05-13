import React, {useState, useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import CandidateCard from './Components/CandidateCard';
import UserNavbar from './Components/UserNavbar';

function Voting() {
    const navigate = useNavigate();
    const location = useLocation();
    const election = location.state?.data
    const electionType = election.open;
    const [candidateList, setCandidateList] = useState([])
    const [getElection, setGetElection] = useState([]);
    const [getElectionType, setGetElectionType] = useState(electionType)
    // const electionType = useRef(false);

    useEffect(() => {
        if (location.state && location.state?.data) {
          setGetElection(location.state?.data);
          setGetElectionType(getElectionType)
        }
        fetch(`http://localhost:5500/api/candidate/${election._id}/get`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((candidate) => {
            setCandidateList(candidate.data);
          });
    }, [election._id, location.state, getElectionType])

    const targetPage = election.open ? "open" : "closed";
    // console.log(electionType)

    return (
        <>
          <UserNavbar />
          <h1 style={{fontSize: '36px', textAlign: 'center'}}>Voting for {election.title} - {election.open ? election.area : election.department}</h1>
          {candidateList?.length ? <CandidateCard candidateList={candidateList} election={getElection} /> : <h3>No candidates Found</h3>}
          <div>
            <Button variant="contained" color="primary" sx={{ width: 150, mx: 1, my: 2 }}
                onClick={() => navigate(`/user/elections/view/${targetPage}`, {
                state: {data: {...election}}
                })}
                >
                Go Back
            </Button>
          </div>
        </>
    )
}

export default Voting;