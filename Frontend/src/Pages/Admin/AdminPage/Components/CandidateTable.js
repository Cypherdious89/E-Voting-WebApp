import React, {useState } from 'react'
import { styled } from '@mui/material/styles';
import {IconButton, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditModal from './EditModal'
import DeleteModal from './DeleteModal'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {backgroundColor: theme.palette.common.black, color: theme.palette.common.white},
    [`&.${tableCellClasses.body}`]: {fontSize: 14},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {backgroundColor: theme.palette.action.hover},
  '&:last-child td, &:last-child th': {border: 0,},
}));


function CandidateTable({candidateList, electionID}) {
    const [editModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [candidate, setCandidate] = useState([])

    async function findCandidate(electionID, candidateID, buttonClicked) {
        const response = await fetch(`http://localhost:5500/api/${electionID}/find_candidate_details`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                candidateID
            })
        });
        const data = await response.json();
        if (data.status === 'OK'){
            setCandidate(data.candidate)
            if(buttonClicked === "EDIT")    setEditModal(true)
            else setDeleteModal(true)
        }
        else
            console.log(data.error)
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
                        <StyledTableCell align="center">Actions</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {candidateList?.map((candidate) => (
                        <StyledTableRow key = {candidate._id}>
                            <StyledTableCell component="th" scope="row">
                                <img  alt="Candidate Phtoto" width={100} height={100} src={candidate.candidatePhoto.file}/>
                            </StyledTableCell>
                            <StyledTableCell align="center">{candidate.candidateName}</StyledTableCell>
                            <StyledTableCell align="center">{candidate.candidateUID}</StyledTableCell>
                            <StyledTableCell align="center">{candidate.candidateAge}</StyledTableCell>
                            <StyledTableCell align="center">
                                <IconButton 
                                    aria-label = "edit" 
                                    color = "secondary" 
                                    onClick = {(e) => {findCandidate(electionID, candidate._id, "EDIT")}}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton 
                                    aria-label="delete"
                                    color="error" 
                                    onClick={(e) => {findCandidate(electionID, candidate._id, "DELETE")}}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        {editModal && <EditModal setEditModal={setEditModal} candidate={candidate} electionID={electionID}/>}
        {deleteModal && <DeleteModal setDeleteModal={setDeleteModal} electionID={electionID} candidateID={candidate._id} />}
        </>

    )
}

export default CandidateTable