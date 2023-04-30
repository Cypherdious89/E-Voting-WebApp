import React, {useState} from 'react'
import styles from './assets/Modal.module.css'

import { RiCloseLine } from "react-icons/ri";

function CandidateModal({setEditModal, candidate, electionID}) {
    const candidateID = candidate._id;
    const [candidateName, setCandidateName] = useState(candidate.candidateName)
    const [candidateUID, setCandidateUID] = useState(candidate.candidateUID)
    const [candidateImage, setCandidateImage] = useState(candidate.candidatePhoto)
    const [candidateDOB, setCandidateDOB] = useState(candidate.candidateDOB)
    var [candidateAge, setCandidateAge] = useState(candidate.candidateAge)
    var [candidateImageName, setCandidateImageName] = useState()

    function convertToBase64(hash) {
        const reader = new FileReader();
        candidateImageName = hash.target.files[0].name;
        reader.readAsDataURL(hash.target.files[0]);
        reader.onload = () => {
            setCandidateImage(reader.result);
            setCandidateImageName(candidateImageName);
        };
        reader.onerror = (error) => {
            console.log("Error : ", error)
        }
    }

    function ageCalculator(input) {
        var dob = new Date(input);
        var month_diff = Date.now() - dob.getTime();
        var age_dt = new Date(month_diff);
        var year = age_dt.getUTCFullYear();
        candidateAge = Math.abs(year - 1970);
        setCandidateAge(candidateAge);
    }

    async function editCandidate(event){
        event.preventDefault()
        const response = await fetch(`http://localhost:5500/api/${electionID}/edit_candidate_details`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                candidateID,
                candidateName,
                candidateUID,
                candidateImage,
                candidateImageName,
                candidateAge,
                candidateDOB,
                electionID
            })
        });
        const data = await response.json();
        if (data.status === 'OK') {
            alert('Successfully modified candidate details !');
            setEditModal(false);
            window.location.href = `/view-elections/${electionID}/candidate-list`
        } else {
            alert('Some error occurred, please try again !')
        }
    }
    return (
    <>
        <div className={styles.darkBG} onClick={() => setEditModal(false)} />
        <div className={styles.centered}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h5 className={styles.heading}>Edit Candidate Details</h5>
                </div>
                <button className={styles.closeBtn} onClick={() => setEditModal(false)}>
                    <RiCloseLine style={{ marginBottom: "-3px" }} />
                </button>
                <div className={styles.modalContent}>
                    <form className={styles.candidateForm} autoComplete='off'>
                        <div className={styles.formData}>
                            <label className={styles.modalLabel}>Full Name</label>
                            <input 
                                type='text' autoComplete='false' required
                                value={candidateName}
                                onChange={(e) => setCandidateName(e.target.value)}
                                name="hidden" 
                                id="name" 
                                className={styles.textField} 
                            />
                        </div>
                        <div className={styles.formData}>
                            <label className={styles.modalLabel}>Unique ID</label>
                            <input 
                                type="text" autoComplete="false" required
                                value={candidateUID}
                                onChange={(e) => setCandidateUID(e.target.value)}
                                name="hidden" 
                                id="uid" 
                                className={styles.textField} 
                            />
                        </div>
                        <div className={styles.formData}>
                            <label className={styles.modalLabel}>Date of Birth</label>
                            <input 
                                type="date" required
                                value={candidateDOB}
                                onChange={(e) => {setCandidateDOB(e.target.value); ageCalculator(candidateDOB)}}
                                name="age" 
                                id="age" 
                                className={styles.datePicker}

                            />
                        </div>
                        <div className={styles.formData}>
                            <label className={styles.modalLabel}>Candidate Image</label>
                            <input 
                                type="file" required
                                // value=""
                                onChange={convertToBase64}
                                accept="image/*"
                            />
                            {candidateImage==="" || candidateImage==null ? "" : <img className={styles.imagePreview} alt="Candidate Phtoto" width={100} height={100} src={candidateImage}/>}
                        </div>
                    </form>
                </div>
                <div className={styles.modalActions}>
                    <div className={styles.actionsContainer}>
                        <button className={styles.addBtn} onClick={editCandidate}>Confirm</button>
                        <button className={styles.cancelBtn} onClick={() => setEditModal(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default CandidateModal