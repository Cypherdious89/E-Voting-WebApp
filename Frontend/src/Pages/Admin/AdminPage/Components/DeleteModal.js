import React from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import styles from './assets/Modal.module.css'
import { RiCloseLine } from "react-icons/ri";

const Modal = ({electionID, setDeleteModal}) => {
  const navigate = useNavigate();
  const roles = sessionStorage.getItem("adminRoles");
  const adminRoles = JSON.parse(roles);

  async function deleteElection() {
    const response = await fetch(`http://localhost:5500/api/election/${electionID}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        adminRoles,
      })
    });
    const data = await response.json();
    if(data.status === 'OK') {
      toast.success(data.message, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark"
      })
      setTimeout(() => {
        navigate(`/admin/dashboard`);
      }, 500);
    } else {
      toast.error(data.error, {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark"
      })
    }
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
            Are you sure you want to delete the election ?
          </div>
          <div className={styles.modalActions}>
            <div className={styles.actionsContainer}>
              <button className={styles.deleteBtn} onClick={() => deleteElection()}>Delete</button>
              <button className={styles.cancelBtn} onClick={() => setDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;