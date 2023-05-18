import React, {useState, useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { toast } from "react-toastify";
import CandidateTable from './Components/CandidateTable';
import AdminNavbar from './Components/AdminNavbar';
import CandidateModal from "./Components/CandidateModal";


function CandidateList() {
    const navigate = useNavigate();
    const location = useLocation();
    const election = location.state?.data;
    const electionType = election?.open ? 'open' : 'closed';
    const [candidateList, setCandidateList] = useState([])
    const roles = sessionStorage.getItem("adminRoles");
    const adminRoles = JSON.parse(roles);
    const adminWalletAddress = sessionStorage.getItem("walletAddress");
    console.log(adminWalletAddress);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const checkCandidatesCount = candidateList.length < election?.maxCandidates;
    console.log(adminRoles)
    
    useEffect(() => {
        fetch(`http://localhost:5500/api/candidate/${election?._id}/get`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((candidate) => {
            setCandidateList(candidate.data);
          });
    }, [election?._id])

    return (
        <>
            <AdminNavbar />
            <h1 style={{fontSize: '36px', textAlign: 'center'}}>Candidate List for {election?.title} - {election?.open ? election?.area : election?.department}</h1>
            {candidateList?.length ? <CandidateTable candidateList={candidateList} election={election} /> : <h3>No candidates Found</h3>}
            <div>
                {election?.phase === 1 && checkCandidatesCount &&
                <Button variant="contained" color="primary"sx={{ width: 200, mx: 1, my: 2 }}
                    onClick={() => {
                    if (adminRoles[0] === "readwrite" && adminRoles[1] === "Admin")
                        setIsModalOpen(true);
                    else 
                        toast.error("Only admins can add or modify candidates", {
                        position: "top-center",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        theme: "dark"
                        });
                    }}
                >
                    Add Candidate
                </Button>
                }
                <Button variant="contained" color="primary" sx={{ width: 150, mx: 1, my: 2 }}
                    onClick={() => navigate(`/admin/elections/view/${electionType}`, {
                    state: {data: {...election}}
                    })}
                    >
                    Go Back
                </Button>
            </div>
            {isModalOpen && (<CandidateModal setIsModalOpen={setIsModalOpen} election={election} />)}
        </>
    )
}

export default CandidateList