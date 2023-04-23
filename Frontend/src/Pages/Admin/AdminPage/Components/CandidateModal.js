import React, {useState} from 'react'
import styles from './Modal.module.css'
import { RiCloseLine } from "react-icons/ri";

function CandidateModal({ setIsOpen }) {
    const [candidateName, setCandidateName] = useState('')
    const [candidateUID, setCandidateUID] = useState('')
    const [candidateImage, setCandidateImage] = useState('')
    const [candidateAge, setCandidateAge] = useState(new Date());

    function convertToBase64(hash){
        console.log(hash);
        const reader = new FileReader();
        reader.readAsDataURL(hash.target.files[0]);
        reader.onload = () => {
            console.log(reader.result);
            setCandidateImage(reader.result);
        };
        reader.onerror = (error) => {
            console.log("Error : ", error)
        } 
    }

    return (
    <>
        <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
        <div className={styles.centered}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h5 className={styles.heading}>Add Candidate</h5>
                </div>
                <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
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
                                value={candidateAge}
                                onChange={(e) => setCandidateAge(e.target.value)}
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
                                // value="" 
                                accept="image/*"
                                // className={styles.secondaryBtn} 
                            />
                            {candidateImage==="" || candidateImage==null ? "" : <img className={styles.imagePreview} alt="Candidate Phtoto" width={100} height={100} src={candidateImage}/>}
                        </div>
                    </form>
                </div>
                <div className={styles.modalActions}>
                    <div className={styles.actionsContainer}>
                        <button className={styles.addBtn} onClick={() => setIsOpen(false)}>Confirm</button>
                        <button className={styles.cancelBtn} onClick={() => setIsOpen(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default CandidateModal