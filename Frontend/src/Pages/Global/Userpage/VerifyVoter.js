import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BiCheck } from "react-icons/bi";
import styles from "../Styles/verification.module.css";
import UserNavbar from "./Components/UserNavbar"
import Webcam from 'react-webcam'

function VerifyVoter() {
  const [currentStep, setCurrentStep] = useState(0);
  const [ageVerified, setAgeVerified] = useState(false);
  const [uidVerified, setUidVerified] = useState(false);
  const [photoVerified, setPhotoVerified] = useState(false);
  const [idVerified, setIdVerified] = useState(false);
  const [voterVerified, setVoterVerified] = useState(false);
  const [date, setDate] = useState("");
  const [webcamImage, setWebcamImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedID, setSelectedID] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  const userID = userDetails.uid;
  const election = location.state?.data;
  const ageRestriction = election.ageRestriction;

  function handleVerification() {
    switch (currentStep) {
      case 0:
        handleAgeVerification(date);
        setCurrentStep(1);
        break;
      case 1:
        handleUIDVerification(userID);
        setCurrentStep(2);
        break;
      case 2:
        handlePhotoVerification();
        setCurrentStep(3);
        break;
      case 3:
        handleDetailsVerification();
        setCurrentStep(4);
        break;
      case 4:
        handleRegistration();
        break;
      default:
        break;
    }
  }

  const handleAgeVerification = (input) => {
    console.log(input);
    var dob = new Date(input);
    var month_diff = Date.now() - dob.getTime();
    var age_dt = new Date(month_diff);
    var year = age_dt.getUTCFullYear();
    const age = Math.abs(year - 1970);

    console.log(age);

    if (age < 18) {
      toast.error("You must be at least 18 years old to vote.", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
      setAgeVerified(false);
    } else {
      toast.success("You are eligible to vote based on your age.", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
      setAgeVerified(true);
    }
  };

  const handleUIDVerification = (userID) => {
    if (election.open) {
      const userIDparams = userID.slice(0, 3);
      if (userIDparams !== election.constraints[0]) {
        toast.error(`Your Unique ID should start with ${election.constraints[0]}`, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "dark",
          }
        );
        setUidVerified(false);
        return;
      } else {
        toast.success("Your Unique ID is Verified. You can vote in this election.", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "dark",
          }
        );
        setUidVerified(true);
        return;
      }
    } else {
      const branch = userID.slice(0, 3);
      const year = userID.slice(3, 7);
      const rollNo = userID.slice(7, 10);

      if (branch !== election.constraints[0]) {
        toast.error(`Your branch should be ${election.constraints[0]}`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "dark",
        });
        setUidVerified(false);
        return;
      } else if (parseInt(year) !== election.constraints[1]) {
        toast.error(`Your batch year should be ${election.constraints[1]}`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "dark",
        });
        setUidVerified(false);
        return;
      } else if (parseInt(rollNo) > election.constraints[2] && parseInt(rollNo) > 0) {
        toast.error(`Your roll no should be less than ${election.constraints[2]}`, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "dark",
          }
        );
        setUidVerified(false);
        return;
      } else {
        toast.success("Your Unique ID is Verified", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "dark",
          }
        );
        setUidVerified(true);
        return;
      }
    }
  };

  const handlePhotoVerification = async () => {
    // console.log("Trying Photo Verification")
    // console.log(photoVerified)
    //  if (webcamImage && selectedImage) {
      //  const formData = new FormData();
      //  formData.append("webcamImage", webcamImage);
      //  formData.append("selectedImage", selectedImage);
      //  const response = await fetch("/api/compare-images", {
      //    method: "POST",
      //    body: formData,
      //  });
       // handle response from backend
       setPhotoVerified(true)
    //  } else {
      //  setPhotoVerified(false)
    //  }
  };

  function handleDetailsVerification() {
    // validation logic here
    setIdVerified(true);
  }

  function handleRegistration() {
    setVoterVerified(true);
    navigate(`/user/elections/${election._id}/registration`, {
      state: {data: {...election}, verified: true}
    })
  }

  function AgeVerification(ageRestriction) {
    if (!ageRestriction) {
      toast.info("Election is not age restricted. Anyone can vote !", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
      setAgeVerified(true);
      return "";
    } else {
      return (
        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => {
              setDate(e.target.value.toString());
            }}
            name="age"
            id="age"
            min="1922-01-01"
            max="2023-05-15"
          />
        </div>
      );
    }
  }

  function UIDVerification(user) {
    return (
      <>
        <h1>Yout UserID is : {user.userID}</h1>
      </>
    );
  }

  function PhotoVerification() {
    // Reference to the webcam component
    const webcamRef = React.useRef(null);

    // Handler function for capturing an image from the webcam
    const captureWebcamImage = React.useCallback(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      setWebcamImage(imageSrc);
    }, [webcamRef]);

    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
    };
   
    return (
      <>
        <div>
          <h1>Image Comparison</h1>
          <div>
            <button onClick={captureWebcamImage}>Take Photo</button>
            <input type="file" onChange={handleFileUpload} />
          </div>
          <div>
            {webcamImage ? (
              <img src={webcamImage} alt="Webcam" width={100} height={100}/>
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                style={{ width: "200px", height: "200px" }}
              />
            )}
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Selected"
                width={100}
                height={100}
              />
            )}
          </div>
          {/* <button onClick={handlePhotoVerification}>
            Compare Images
          </button> */}
        </div>
      </>
    );
  }

  function DetailsVerification() {
    const uploadIdCardImage = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSelectedID(reader.result);
      };
    };

    return (
      <>
        <div>
          <h1>ID Comparison</h1>
          <div>
            <input type="file" accept="image/*" onChange={uploadIdCardImage} />
            {selectedID && (
              <img
                src={selectedID}
                alt="ID Card"
                style={{ width: "100px", height: "100px" }}
              />
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <UserNavbar />
      <div>
        <div className={styles.progress}>
          <div
            className={`${styles.progressBar}`}
            role="progressbar"
            style={{ width: `${(currentStep / 4) * 100}%` }}
            aria-valuenow={currentStep}
            aria-valuemin="0"
            aria-valuemax="5"
          >
            {ageVerified && (
              <div
                className={`${styles.progressStep} ${
                  uidVerified ? styles.completed : styles.incompleted
                }`}
              >
                Age Verification Done
              </div>
            )}
            {uidVerified && (
              <div
                className={`${styles.progressStep} ${
                  photoVerified ? styles.completed : styles.incompleted
                }`}
              >
                UID Verification Done
              </div>
            )}
            {photoVerified && (
              <div
                className={`${styles.progressStep} ${
                  idVerified ? styles.completed : styles.incompleted
                }`}
              >
                Photo Verification done
              </div>
            )}
            {idVerified && (
              <div
                className={`${styles.progressStep} ${
                  voterVerified ? styles.completed : styles.incompleted
                }`}
              >
                Details Verification Done !
              </div>
            )}
          </div>
        </div>

        <div className={styles.verificationSection}>
          {currentStep === 0 && (
            <AgeVerification ageRestriction={ageRestriction} />
          )}
          {currentStep === 1 && ageVerified ? (
            <UIDVerification userID={userDetails.uid} />
          ) : (
            ""
          )}
          {currentStep === 2 && uidVerified ? (
            <PhotoVerification />
          ) : (
            ""
          )}
          {currentStep === 3 && photoVerified ? (
            <DetailsVerification />
          ) : (
            ""
          )}

          {currentStep === 0 && (
            <button onClick={handleVerification} className={styles.button}>
              Verify Age
            </button>
          )}

          {currentStep === 1 && ageVerified ? (
            <button onClick={handleVerification} className={styles.button}>
              Verify UID
            </button>
          ) : (
            ""
          )}

          {currentStep === 2 && uidVerified ? (
            <button onClick={handleVerification} className={styles.button}>
              Verify Photo
            </button>
          ) : (
            ""
          )}

          {currentStep === 3 && photoVerified ? (
            <button onClick={handleVerification} className={styles.button}>
              Verify Details
            </button>
          ) : (
            ""
          )}

          {currentStep === 4 && idVerified ? (
            <button onClick={handleVerification} className={styles.button}>
              Go to Registration
              <BiCheck />
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default VerifyVoter;