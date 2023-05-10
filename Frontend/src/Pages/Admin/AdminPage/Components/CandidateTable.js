import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";

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

function CandidateTable({ candidateList, election }) {
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [candidate, setCandidate] = useState([]);
  const roles = sessionStorage.getItem("adminRoles");
  const adminRoles = JSON.parse(roles);
  const electionID = election._id;
  const phase = election.phase;

  async function findCandidate(electionID, candidateID, buttonClicked) {
    const response = await fetch(
      `http://localhost:5500/api/candidate/${electionID}/find/${candidateID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (data.status === "OK") {
      setCandidate(data.candidate);
      if (buttonClicked === "EDIT") setEditModal(true);
      else setDeleteModal(true);
    } else console.log(data.error);
  }

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
              {phase === 1 ? (
                <StyledTableCell align="center">Actions</StyledTableCell>
              ) : (
                ""
              )}
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
                {phase === 1 ? (
                  <StyledTableCell align="center">
                    <IconButton
                      aria-label="edit"
                      color="secondary"
                      onClick={() => {
                        if (
                          adminRoles[0] === "readwrite" &&
                          adminRoles[1] === "Admin"
                        )
                          findCandidate(electionID, candidate._id, "EDIT");
                        else
                          toast.error(
                            "Only admins can add or modify candidates",
                            {
                              position: "top-center",
                              autoClose: 1000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              theme: "dark",
                            }
                          );
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      color="error"
                      onClick={() => {
                        if (
                          adminRoles[0] === "readwrite" &&
                          adminRoles[1] === "Admin"
                        )
                          findCandidate(electionID, candidate._id, "DELETE");
                        else {
                          toast.error(
                            "Only admins can add or modify candidates",
                            {
                              position: "top-center",
                              autoClose: 1000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              theme: "dark",
                            }
                          );
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </StyledTableCell>
                ) : (
                  ""
                )}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {editModal && (
        <EditModal
          setEditModal={setEditModal}
          candidate={candidate}
          election={election}
        />
      )}
      {deleteModal && (
        <DeleteModal
          setDeleteModal={setDeleteModal}
          electionID={electionID}
          candidateID={candidate._id}
          phase={phase}
        />
      )}
    </>
  );
}

export default CandidateTable;
