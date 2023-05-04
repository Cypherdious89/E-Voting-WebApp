import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import { Button } from '@mui/material';
import CandidateModal from './Components/CandidateModal';
import CandidateTable from './Components/CandidateTable';
import AdminNavbar from './Components/AdminNavbar';


function CandidateList() {
    const location = useLocation();
    const election = location.state?.data
    const roles = location.state?.adminRoles;
    // console.log(roles)
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            <h1 style={{fontSize: '36px', textAlign: 'center'}} >Candidate List for {election.title} - {election.area}</h1>
            {candidateList?.length ? <CandidateTable candidateList={candidateList} electionID={election._id} adminRoles={roles}/> : <h3>No candidates Found</h3>}
            <Button 
                variant="contained" 
                color="primary" 
                sx={{width: 200, mx:1, my:2}}
                onClick={() => {
                    if(roles[0] === 'readwrite' && roles[1] === 'Admin')
                        setIsModalOpen(true)
                    else
                        alert('Only admins can add or modify candidates')
                }}
            >
                Add Candidate
            </Button>
            {isModalOpen && <CandidateModal setIsModalOpen={setIsModalOpen} electionID={election._id} roles={roles}/>}
        </>
    )
}

export default CandidateList