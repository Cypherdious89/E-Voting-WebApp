import React from "react";
import { useNavigate } from "react-router";
import styles from './assets/Modal.module.css'
import { RiCloseLine } from "react-icons/ri";

const Modal = ({setDeleteModal, electionID, candidateID}) => {
  const navigate = useNavigate();
  const roles = sessionStorage.getItem("adminRoles");
  const adminRoles = JSON.parse(roles);

  async function deleteCandidate() {
      const response = await fetch(`http://localhost:5500/api/${electionID}/delete_candidate/${candidateID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          adminRoles
        })
      });
      const data = await response.json();
      if(data.status === 'OK') {
        alert(data.message)
        navigate(`/admin/elections/${electionID}/candidates`, {
          state: { data: { ...data.election } },
        });
      } else {
        console.log(data.data)
        alert(data.message)
      }
      window.location.reload();
  }
  return (
    <>
      <div className={styles.darkBG} onClick={() => setDeleteModal(false)} />
      <div className={styles.centered}>
        <div className={styles.deleteModal}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>Dialog</h5>
          </div>
          <button className = {styles.closeBtn} onClick = {() => setDeleteModal(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <div className={styles.modalContent}>
            Are you sure you want to delete the candidate ?
          </div>
          <div className={styles.modalActions}>
            <div className={styles.actionsContainer}>
              <button className={styles.deleteBtn} onClick={() => deleteCandidate()}>Delete</button>
              <button className={styles.cancelBtn} onClick={() => setDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;