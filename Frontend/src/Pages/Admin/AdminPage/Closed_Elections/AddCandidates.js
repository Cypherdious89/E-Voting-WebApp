import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"
import { Button } from "@mui/material";
import CandidateModal from "../Components/CandidateModal";
import AddCandidateTable from "../Components/AddCandidateTable";

function AddCandidates() {
  const navigate = useNavigate();
  const location = useLocation();
  const election = location.state?.data;
  const roles = sessionStorage.getItem("adminRoles");
  const adminRoles = JSON.parse(roles);
  console.log(adminRoles)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidateList, setCandidateList] = useState([]);

  const checkCandidatesCount = candidateList.length < election.maxCandidates;

  useEffect(() => {
    fetch(`http://localhost:5500/api/get_candidates/${election._id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((candidate) => {
        console.log(candidate.data);
        setCandidateList(candidate.data);
      });
  }, [election._id]);

  return (
    <>
      <h1 style={{ fontSize: "36px", textAlign: "center" }}>
        Add Candidates for {election.title} - {election.department}
      </h1>
      {candidateList?.length ? (
        <AddCandidateTable candidateList={candidateList} />
      ) : (
        <h3>No candidates Found</h3>
      )}
      <div>
        {checkCandidatesCount &&
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
        <Button variant="contained" color="primary" sx={{ width: 250, mx: 1, my: 2 }}
            onClick={() => navigate('/admin/elections/view/closed', {
              state: {data: {...election}}
            })}
            >
            Submit Candidate Details !
        </Button>
      </div>
      {isModalOpen && (<CandidateModal setIsModalOpen={setIsModalOpen} election={election} open={election.open} />
      )}
    </>
  );
}

export default AddCandidates;