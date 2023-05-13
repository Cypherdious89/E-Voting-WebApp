import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: { fontSize: 14 },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
  "&:last-child td, &:last-child th": { border: 0 },
}));

function Results() {
  const [candidates, setCandidates] = useState([]);
  const [winner, setWinner] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const election = location.state?.data
  const electionType = election.open ? 'open' : 'closed';

  useEffect(() => {
    // fetch the election data from the backend API
    fetch(`http://localhost:5500/api/election/${election._id}/results`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((candidate) => {
        setCandidates(candidate.data.candidates);
        setWinner(candidate.data.winner);
      });
  }, [election._id]);

  console.log(candidates);
  console.log(winner);

  return (
    <div>
      <h1>Results for {election.title}</h1>
      <h3>Winner: {winner.map((w) => w.Name).join(", ")}</h3>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Candidate</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">UID</StyledTableCell>
              <StyledTableCell align="center">Date of Birth</StyledTableCell>
              <StyledTableCell align="center">Votes</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates?.map((candidate) => (
              <StyledTableRow key={candidate._id}>
                <StyledTableCell component="th" scope="row">
                  <img
                    alt="Candidate Phtoto"
                    width={100}
                    height={100}
                    src={candidate.Photo.file}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  {candidate.Name}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {candidate.UID}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {candidate.DOB}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {candidate.votes.length}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <Button
          variant="contained"
          color="primary"
          sx={{ width: 150, mx: 1, my: 2 }}
          onClick={() =>
            navigate(`/user/elections/view/${electionType}`, {
              state: { data: { ...election } },
            })
          }
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}

export default Results;
