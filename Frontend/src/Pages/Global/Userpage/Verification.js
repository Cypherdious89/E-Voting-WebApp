import React, { useState } from "react";
import Webcam from "react-webcam";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyVoter() {
  const [photoVerified, setPhotoVerified] = useState(false);
  const [idVerified, setIdVerified] = useState(false);
  const [voterVerified, setVoterVerified] = useState(false);
  const [webcamImage, setWebcamImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedID, setSelectedID] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    const userID = userDetails.uid;
    console.log(userID);
    const election = location.state?.data;

  

  function handleRegistration() {
    setVoterVerified(true);
    navigate(`/user/elections/${election._id}/registration`, {
      state: { data: { ...election }, verified: voterVerified },
    });
  }

  const handlePhotoVerification = async () => {
    // if (webcamImage && selectedImage) {
    //   const formData = new FormData();
    //   formData.append("webcamImage", webcamImage);
    //   formData.append("selectedImage", selectedImage);
    //   try {
    //     const response = await fetch("/api/ml/compare-images", {
    //       method: "POST",
    //       body: formData,
    //     });
    //     if (response.ok) {
    //       const data = await response.json();
    //       console.log(data);
    //       // handle response from backend
    //       setPhotoVerified(true);
    //     } else {
    //       throw new Error("Network response was not ok");
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     // handle error
    //     setPhotoVerified(false);
    //   }
    setPhotoVerified(true)
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
              <img src={webcamImage} alt="Webcam" width={200} height={200} />
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
                width={200}
                height={200}
              />
            )}
          </div>
          <button onClick={handlePhotoVerification}>Compare Images</button>
        </div>
      </>
    );
  }

  const handleDetailsVerification = async (event) => {
    // const file = event.target.files[0];
    // const formData = new FormData();
    // formData.append('idCardImage', file);
    // const response = await fetch('/api/compare-images', );
    // setSimilarityPercentage(response.data.similarityPercentage);
    // setIdCardImage(URL.createObjectURL(file));
    setIdVerified(true);
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
                style={{ width: "200px", height: "100px" }}
              />
            )}
          </div>
          <button onClick={handleDetailsVerification}>Verify ID Card</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        <PhotoVerification />
        {photoVerified ? <DetailsVerification /> : ""}

        {idVerified ? (
          <button onClick={handleRegistration}>Go to Registration</button>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default VerifyVoter;