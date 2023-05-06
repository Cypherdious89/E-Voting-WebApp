import React, {useState, useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import CandidateTable from './Components/CandidateTable';
import AdminNavbar from './Components/AdminNavbar';


function CandidateList() {
    const navigate = useNavigate();
    const location = useLocation();
    const election = location.state?.data
    const electionType = election.open ? 'open' : 'closed';
    const [candidateList, setCandidateList] = useState([])

    useEffect(() => {
        fetch(`http://localhost:5500/api/get_candidates/${election._id}`, {
                method: 'GET',
            }).then((res) =>
                res.json()
            )
            .then((candidate) => {
                setCandidateList(candidate.data)
            });
    }, [election._id])

    return (
        <>
            <AdminNavbar />
            <h1 style={{fontSize: '36px', textAlign: 'center'}}>Candidate List for {election.title} - {election.open ? election.area : election.department}</h1>
            {candidateList?.length ? <CandidateTable candidateList={candidateList} electionID={election._id}/> : <h3>No candidates Found</h3>}
            <Button variant="contained" color="primary" sx={{ width: 150, mx: 1, my: 2 }}
                onClick={() => navigate(`/admin/elections/view/${electionType}`, {
                state: {data: {...election}}
                })}
                >
                Go Back
            </Button>
        </>
    )
}

export default CandidateList