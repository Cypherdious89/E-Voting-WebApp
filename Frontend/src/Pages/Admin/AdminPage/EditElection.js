import React from 'react'
import {Avatar, Button,TextField, Box, Typography, Container, FormGroup, FormControlLabel, Switch} from "@mui/material";
import PollRoundedIcon from '@mui/icons-material/PollRounded';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';


function EditElection() {

  const location = useLocation();
  const election = location.state?.data

  const [title, setTitle] = useState(election.title);
  const [dept, setDept] = useState(election.area);
  const [maxCandidate, setMaxCandidate] = useState(election.maxCandidate);
  const [maxVoters, setMaxVoters] = useState(election.maxVoter);
  const [maxVoteCount, setMaxVoteCount] = useState(election.maxVoteCount);
  const [ageRestriction, setAgeRestriction] =useState(election.ageRestriction);

  const min_candidates = 1, max_candidates = 100;
  const min_voters = 1, max_voters = 99999999;
  const min_winners = 1, max_winners = 10;

  async function EditElection(event) {
    event.preventDefault();
    const response = await fetch(`http://localhost:5500/api/${election._id}/edit_election_details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        dept,
        maxCandidate,
        maxVoters,
        maxVoteCount,
        ageRestriction
      })
    });

    const data = await response.json();
    if (data.status === 'OK') {
      alert('Successfully modified election details !');
      window.location.href = '/admin/elections'
    } else {
      alert('Some error occurred, please try again !')
    }
  }

  return (
    <Container component="main" maxWidth="md">
        <Box
            sx={{
                boxShadow: 3,
                borderRadius: 2,
                px: 4,
                py: 4,
                marginTop: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            < PollRoundedIcon / >
        </Avatar>
        <Typography component="h1" variant="h5">
            Add Election
        </Typography>
        <Box component = "form" onSubmit = {EditElection} noValidate sx = {{mt: 1}} >
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
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                name = "department" required fullWidth
                id="department"
                label="Department"
                type="text"
                margin="normal"
                autoComplete="false"
            />
            <TextField
                value={maxCandidate}
                onChange = {
                  (e) => {
                    var val = parseInt(e.target.value, 10);
                    if (val > max_candidates) val = max_candidates;
                    if (val < min_candidates) val = min_candidates;
                    setMaxCandidate(val);
                  }
                }
                name = "maxCandidate" required fullWidth
                id = "maxCandidate"
                label="Maximum Candidate Count"
                InputProps={{ inputProps: { type: 'number', min: min_candidates, max: max_candidates } }}
                margin="normal"
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
                name = "maxVoters" required fullWidth
                id = "maxVoters"
                label="Maximum Voters Count"
                InputProps={{ inputProps: { type: 'number', min: min_voters, max: max_voters } }}
                margin="normal"
            />
            <TextField
                value={maxVoteCount}
                onChange = {
                  (e) => {
                    var val = parseInt(e.target.value, 10);
                    if (val > max_winners) val = max_winners;
                    if (val < min_winners) val = min_winners;
                    setMaxVoteCount(val);
                  }
                }
                name = "maxVoteCount" required fullWidth
                id = "maxVoteCount"
                label="Maximum Winning Candidates"
                InputProps={{ inputProps: { type: 'number', min: min_winners, max: max_winners }}}
                margin="normal"
            />
            <FormGroup>
              <FormControlLabel
                checked={ageRestriction}
                onChange={(e) => setAgeRestriction(e.target.checked)}
                id="ageRestriction"
                name="ageRestriction" required
                control={<Switch />} 
                label="Age Restriction"
                margin="normal"
              />
            </FormGroup>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
              Edit Election Details
            </Button>
            </Box>
        </Box>
    </Container>
  )
}

export default EditElection