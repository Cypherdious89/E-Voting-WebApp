import React, {useState} from 'react'
import { useNavigate } from 'react-router';
import { toast } from "react-toastify";
import styles from './assets/Modal.module.css'
import { RiCloseLine } from "react-icons/ri";

function CandidateModal({ setIsModalOpen, election, open}) {
    const navigate = useNavigate();
    const electionID = election._id;
    const roles = sessionStorage.getItem("adminRoles");
    const adminRoles = JSON.parse(roles);
    const [candidateName, setCandidateName] = useState('')
    const [candidateUID, setCandidateUID] = useState('')
    const [candidateImage, setCandidateImage] = useState('')
    const [candidateDOB, setCandidateDOB] = useState('')
    var [candidateAge, setCandidateAge] = useState()
    var [candidateImageName, setCandidateImageName] = useState('')

    function convertToBase64(hash){
        const reader = new FileReader();
        candidateImageName = hash.target.files[0].name;
        reader.readAsDataURL(hash.target.files[0]);
        reader.onload = () => {
            setCandidateImage(reader.result);
            setCandidateImageName(candidateImageName);
        };
        reader.onerror = (error) => {
            console.log("Error : ", error);
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

    async function populateCandidate(event) {
        event.preventDefault()
        const response = await fetch('http://localhost:5500/api/add_candidate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                candidateName,
                candidateUID,
                candidateImage,
                candidateImageName,
                candidateDOB,
                candidateAge,
                electionID,
                adminRoles
            })
        });
        const data = await response.json();
        if (data.status === 'OK') {
            toast.success('Successfully added candidate details !', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "dark"
            });
            setIsModalOpen(false);
            if(open)
                navigate(`/admin/elections/open/${electionID}/addCandidates`, {
                    state: {data: {...data.election}}
                });
            else
                navigate(`/admin/elections/closed/${electionID}/addCandidates`, {
                    state: {data: {...data.election}}
                });
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
        window.location.reload();
    }

    return (
    <>
        <div className={styles.darkBG} onClick={() => setIsModalOpen(false)} />
        <div className={styles.centered}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h5 className={styles.heading}>Add Candidate</h5>
                </div>
                <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
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
                                onChange={(e) => {setCandidateDOB(e.target.value.toString()); ageCalculator(candidateDOB)}}
                                name="age" 
                                id="age" 
                                className={styles.datePicker}

                            />
                        </div>
                        <div className={styles.formData}>
                            <label className={styles.modalLabel}>Candidate Image</label>
                            <input 
                                type="file" required
                                onChange={convertToBase64}
                                accept="image/*" 
                            />
                            {candidateImage==="" || candidateImage==null ? "" : <img className={styles.imagePreview} alt="Candidate Phtoto" width={100} height={100} src={candidateImage}/>}
                        </div>
                    </form>
                </div>
                <div className={styles.modalActions}>
                    <div className={styles.actionsContainer}>
                        <button className={styles.addBtn} onClick={populateCandidate}>Confirm</button>
                        <button className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default CandidateModal