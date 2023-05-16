import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import AdminNavbar from "./Components/AdminNavbar";
import {
  Table,
  TableBody,
  tableCellClasses, 
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableCell,
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

function VoterList() {
  const navigate = useNavigate();
  const location = useLocation();
  const election = location.state?.data;
  const electionType = election?.open ? "open" : "closed";
  const [voterList, setVoterList] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5500/api/election/${election?._id}/voters`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((voter) => {
        setVoterList(voter.data);
      });
  }, [election?._id]);

  console.log(voterList)
  return (
    <>
      <AdminNavbar />
      <h1 style={{ fontSize: "36px", textAlign: "center" }}>
        Voter List for {election?.title} -{" "}
        {election?.open ? election?.area : election?.department}
      </h1>
      
      {voterList?.length ? (
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 700, alignContent: "center" }}
            aria-label="customized table"
          >
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="center">Verified Voters</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {voterList?.map((voter, idx) => (
                <StyledTableRow key={idx}>
                  <StyledTableCell align="center">{voter}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <h3>No registered voters found !</h3>
      )}
      <div>
        <Button
          variant="contained"
          color="primary"
          sx={{ width: 150, mx: 1, my: 2 }}
          onClick={() =>
            navigate(`/admin/elections/view/${electionType}`, {
              state: { data: { ...election } },
            })
          }
        >
          Go Back
        </Button>
      </div>
    </>
  );
}

export default VoterList;