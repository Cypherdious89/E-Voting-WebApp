import React, {useState, useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import CandidateTable from './Components/CandidateTable';
import UserNavbar from './Components/UserNavbar';

function CandidateList() {
    const navigate = useNavigate();
    const location = useLocation();
    const election = location.state?.data
    const electionType = election.open ? 'open' : 'closed';
    const [candidateList, setCandidateList] = useState([])

    useEffect(() => {
        fetch(`http://localhost:5500/api/candidate/${election._id}/get`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((candidate) => {
            setCandidateList(candidate.data);
          });
    }, [election._id])

    return (
        <>
            <UserNavbar />
            <h1 style={{fontSize: '36px', textAlign: 'center'}}>Candidate List for {election.title} - {election.open ? election.area : election.department}</h1>
            {candidateList?.length ? <CandidateTable candidateList={candidateList} /> : <h3>No candidates Found</h3>}
            <div>
                <Button variant="contained" color="primary" sx={{ width: 150, mx: 1, my: 2 }}
                    onClick={() => navigate(`/user/elections/view/${electionType}`, {
                    state: {data: {...election}}
                    })}
                    >
                    Go Back
                </Button>
            </div>
        </>
    )
}

export default CandidateList