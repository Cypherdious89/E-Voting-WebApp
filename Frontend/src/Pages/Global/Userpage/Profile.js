import React from 'react'
import styles from '../Styles/profile.module.css'
import userAvatar from './Components/assets/user_avatar.png'
import UserNavbar from './Components/UserNavbar'

function Profile() {
  let userDetails = sessionStorage.getItem("userDetails");
  const sessionObject = JSON.parse(userDetails);
  const user = {
    name: sessionObject.username,
    email: sessionObject.email,
    mobile: sessionObject.mobileNumber,
    aadhar: sessionObject.aadhar,
    uid: sessionObject.uid,
    avatar: userAvatar,
  }

  return (
    <>
        <UserNavbar />
        <div className={styles.card}>
          <div className={styles.header}>
            <h1>{user.name}</h1>
          </div>
          <div className={styles.content}>
            <div className={styles.avatar}>
              <img src={user.avatar} alt="admin Avatar" />
            </div>
            <div className={styles.details}>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Mobile No. :</strong> {user.mobile}</p>
              <p><strong>Aadhar No. :</strong> {user.aadhar}</p>
              <p><strong>Unique ID :</strong> {user.uid}</p>
            </div>
          </div>
        </div>
      </>
  )
}

export default Profile