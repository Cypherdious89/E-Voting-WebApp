import React,  {useEffect, useState} from 'react'

function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [uid, setUid] = useState('');

  useEffect(() => {
    let userDetails = sessionStorage.getItem("userDetails");
    const userObj = JSON.parse(userDetails);
    setName(userObj.username)
    setEmail(userObj.email)
    setMobileNo(userObj.mobileNumber)
    setAadhar(userObj.aadhar)
    setUid(userObj.uid)
  }, [])

  return (
    <>
      <h1>User Profile</h1>
      <p>Name : {name}</p>
      <p>Email : {email}</p>
      <p>Mobile No. : {mobileNo}</p>
      <p>Aadhar Number : {aadhar}</p>
      <p>Unique ID: {uid}</p>
    </>
  )
}

export default Profile