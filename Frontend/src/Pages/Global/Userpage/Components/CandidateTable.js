import React from "react";
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

function CandidateTable({ candidateList }) {
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Candidate Photo</StyledTableCell>
              <StyledTableCell align="center">Candidate Name</StyledTableCell>
              <StyledTableCell align="center">Candidate ID</StyledTableCell>
              <StyledTableCell align="center">Candidate Age</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidateList?.map((candidate) => (
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
                  {candidate.Age}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default CandidateTable;