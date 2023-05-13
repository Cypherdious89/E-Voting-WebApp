import React, {useState} from 'react'
import { useNavigate } from 'react-router';
import { toast } from "react-toastify";
import styles from './assets/Modal.module.css'
import { RiCloseLine } from "react-icons/ri";
import Web3 from "web3";
import ElectionJSON from "../../../../contracts/Election.json";

function CandidateModal({ setIsModalOpen, election}) {
    const navigate = useNavigate();
    const electionID = election._id;
    const phase = election.phase;
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

    const checkUniqueID = (uid, open, constraints) => {
      if(!open){
        if (uid.length !== 10) {
          toast.error("Unique ID must have 10 characters", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "dark"
          });
          setCandidateUID("")
          return false;
        }
        // Check if the first three characters match the first constraint
        const firstThreeChars = uid.substring(0, 3);
        if (firstThreeChars !== constraints[0]) {
          toast.error(`Branch must be ${constraints[0]}`, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "dark"
          });
          setCandidateUID("");
          return false;
        }

        // Check if the next four characters match the second constraint
        const yearString = uid.substring(3, 7);
        const year = parseInt(yearString);
        if (isNaN(year) || year !== constraints[1]) {
          toast.error(`Year must be ${constraints[1]}`, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "dark"
          });
          setCandidateUID("");
          return false;
        }

        // Check if the next three characters are less than the third constraint
        const limitString = uid.substring(7, 10);
        const limit = parseInt(limitString);
        if (isNaN(limit) || limit >= constraints[2]) {
          toast.error(`Roll No. must be less than ${constraints[2]}`, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              theme: "dark"
            }
          );
          setCandidateUID("");
          return false;
        }

        // Unique ID is valid
        toast.info("Unique ID is valid", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "dark"
        });
        setCandidateUID(uid);
        return true;
      } else {
        if (/[^a-zA-Z]/.test(uid)) {
          toast.error("Party code must only contain letters", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "dark",
          });
          setCandidateUID("");
          return false;
        }

        if (uid.length === 0) {
          toast.error("Enter Party Code", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "dark",
          });
          setCandidateUID("");
          return false;
        }

        if (uid.length > 10) {
          toast.error("Party code must of maximum 10 characters", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "dark",
          });
          setCandidateUID("");
          return false;
        }

        // Unique ID is valid
        toast.info("Party Code is valid", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "dark",
        });
        setCandidateUID(uid);
        return true;
      }
    };

    async function addCandidateTransaction() {
      const web3 = new Web3(window.ethereum);
      const liveElection = new web3.eth.Contract(ElectionJSON.abi , election.address)
      const adminWalletAddress = await web3.eth.getAccounts();
      const txReceipt = await liveElection.methods
        .addContestant(candidateName, candidateAge, candidateUID)
        .send({
          from: adminWalletAddress[0],
          gasLimit: 2100000,
        });
      console.log(txReceipt);
      return txReceipt;
    }

    async function populateCandidate(event) {
      event.preventDefault();
      await addCandidateTransaction();
      const response = await fetch(`http://localhost:5500/api/candidate/${electionID}/add`, {
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
              adminRoles,
              phase
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
          navigate(`/admin/elections/${electionID}/candidates`, {
              state: { data: { ...data.election } },
          });
          window.location.reload()
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
            <button
              className={styles.closeBtn}
              onClick={() => setIsModalOpen(false)}
            >
              <RiCloseLine style={{ marginBottom: "-3px" }} />
            </button>
            <div className={styles.modalContent}>
              <form className={styles.candidateForm} autoComplete="off">
                <div className={styles.formData}>
                  <label className={styles.modalLabel}>Full Name</label>
                  <input
                    type="text"
                    autoComplete="false"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    name="hidden"
                    id="name"
                    className={styles.textField}
                  />
                </div>
                <div className={styles.formData}>
                  {election.open ? (
                    <label className={styles.modalLabel}>Party ID</label>
                  ) : (
                    <label className={styles.modalLabel}>Unique ID</label>
                  )}

                  <input
                    type="text"
                    autoComplete="false"
                    required
                    value={candidateUID}
                    onChange={(e) => setCandidateUID(e.target.value)}
                    onBlur={(e) => {
                      const uid = e.target.value;
                      checkUniqueID(uid, election.open, election.constraints);
                    }}
                    name="hidden"
                    id="uid"
                    className={styles.textField}
                    maxLength={10}
                  />
                </div>
                <div className={styles.formData}>
                  <label className={styles.modalLabel}>Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={candidateDOB}
                    onChange={(e) => {
                      setCandidateDOB(e.target.value.toString());
                      ageCalculator(candidateDOB);
                    }}
                    name="age"
                    id="age"
                    className={styles.datePicker}
                  />
                </div>
                <div className={styles.formData}>
                  <label className={styles.modalLabel}>Candidate Image</label>
                  <input
                    type="file"
                    required
                    onChange={convertToBase64}
                    accept="image/*"
                  />
                  {candidateImage === "" || candidateImage == null ? (
                    ""
                  ) : (
                    <img
                      className={styles.imagePreview}
                      alt="Candidate Phtoto"
                      width={100}
                      height={100}
                      src={candidateImage}
                    />
                  )}
                </div>
              </form>
            </div>
            <div className={styles.modalActions}>
              <div className={styles.actionsContainer}>
                <button className={styles.addBtn} onClick={populateCandidate}>
                  Confirm
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}

export default CandidateModal