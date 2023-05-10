import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import {Avatar, Button,TextField, Box, Typography, Container} from "@mui/material";
import PollRoundedIcon from '@mui/icons-material/PollRounded';


function AddClosedElection() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [maxVoters, setMaxVoters] = useState('');
  const [maxCandidates, setMaxCandidates] = useState('');
  const [maxWinners, setMaxWinners] = useState('');

  const min_candidates = 1, max_candidates = 20;
  const min_voters = 1, max_voters = 300;
  const min_winners = 1, max_winners = 10;
  const min_year = 2015, max_year = 2023;
  const navigate = useNavigate();
  const roles = sessionStorage.getItem("adminRoles");
  const adminRoles = JSON.parse(roles);


  const handleKeyDown = (e) => {
    if (/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleNumKeyDown = (e) => {
    if (/![0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };


  async function AddElectiontoDB(event) {
    event.preventDefault();
    const response = await fetch('http://localhost:5500/api/election/closed/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        department,
        branch,
        year,
        maxVoters,
        maxCandidates,
        maxWinners,
        adminRoles
      })
    });

    const data = await response.json();
    if (data.status === 'OK') {
      toast.success("Successfully added election details !", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
      setTimeout(() => {
        navigate(`/admin/elections/view/closed`, {
          state: { data: { ...data.election } },
        });
      }, 500);
    } else {
      toast.error("Some error occurred, please try again !", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
    }
  }

  return (
    <>
      <Container component="main" maxWidth="md">
        <Box sx={{
              boxShadow: 3,
              borderRadius: 2,
              px: 2, py: 2,
              mx: 2, my: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><PollRoundedIcon /></Avatar>
          <Typography component="h1" variant="h5">Add Closed Election</Typography>
          <Box component = "form" onSubmit = {AddElectiontoDB} noValidate sx = {{mt: 1}} >
            <TextField
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                name = "title" required fullWidth
                id="title"
                label="Election Title"
                type="text"
                autoFocus
                margin="normal"
            />
            <TextField
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                name = "description" required fullWidth
                id="description"
                label="Election Description"
                type="text"
                margin="normal"
            />
            <TextField
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                name = "department" required fullWidth
                id="department"
                label="Department"
                type="text"
                margin="normal"
                autoComplete="false"
            />
            <TextField
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                name = "branch" required
                id="branch"
                label="Enter Branch Code"
                type="text"
                margin="normal"
                autoComplete="false"
                inputProps={{maxLength: 3}}
                onKeyDown={handleKeyDown}
                sx={{width: "40%", marginRight: "10px"}}
            />
            <TextField
                value={year}
                onChange={
                  (e) => {
                    var val = parseInt(e.target.value, 10);
                    if (val > max_year) val = max_year;
                    if (val < min_year) val = min_year;
                    setYear(val);
                  }
                }
                name = "branch" required
                id="branch"
                label="Enter Year"
                margin="normal"
                autoComplete="false"
                InputProps={{ inputProps: { type: 'number', min: 2013, max: 2023 }}}
                onKeyDown={handleNumKeyDown}
                sx={{width: "28.2%", marginRight: "10px"}}
            />
            <TextField
                value={maxVoters}
                onChange = {
                  (e) => {
                    var val = parseInt(e.target.value, 10);
                    if (val > max_voters) val = max_voters;
                    if (val < min_voters) val = min_voters;
                    setMaxVoters(val);
                  }
                }
                name = "maxVoters" required
                id = "maxVoters"
                label="Maximum Voters"
                InputProps={{ inputProps: { type: 'number', min: min_voters, max: max_voters } }}
                margin="normal"
                sx={{width: "29.2%"}}
            />
            <TextField
                value={maxCandidates}
                onChange = {
                  (e) => {
                    var val = parseInt(e.target.value, 10);
                    if (val > max_candidates) val = max_candidates;
                    if (val < min_candidates) val = min_candidates;
                    setMaxCandidates(val);
                  }
                }
                name = "maxCandidates" required fullWidth
                id = "maxCandidate"
                label="Maximum Candidate Count"
                InputProps={{ inputProps: { type: 'number', min: min_candidates, max: max_candidates } }}
                margin="normal"
            />
            <TextField
                value={maxWinners}
                onChange = {
                  (e) => {
                    var val = parseInt(e.target.value, 10);
                    if (val > max_winners) val = max_winners;
                    if (val < min_winners) val = min_winners;
                    setMaxWinners(val);
                  }
                }
                name = "maxVoteCount" required fullWidth
                id = "maxVoteCount"
                label="Maximum Winning Candidates"
                InputProps={{ inputProps: { type: 'number', min: min_winners, max: max_winners }}}
                margin="normal"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
              Add Election
            </Button>
          </Box>
        </Box>
    </Container>
    </>
  )
}

export default AddClosedElection