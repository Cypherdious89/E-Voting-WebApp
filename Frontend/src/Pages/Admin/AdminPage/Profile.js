import React,  {useEffect, useState} from 'react'

function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');

  useEffect(() => {
    let adminDetails = sessionStorage.getItem("adminDetails");
    const adminObj = JSON.parse(adminDetails);
    setName(adminObj.username)
    setEmail(adminObj.email)
    setMobileNo(adminObj.mobileNo)
  }, [])

  return (
    <>
      <h1>Admin Profile</h1>
      <p>Name : {name}</p>
      <p>Email : {email}</p>
      <p>Mobile No. : {mobileNo}</p>
    </>
  )
}

export default Profile