import React from 'react'
import adminAvatar from './Components/assets/admin_avatar.jpg'
import styles from '../Styles/profile.module.css'

function Profile() {
  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [mobileNo, setMobileNo] = useState('');

  // useEffect(() => {
  //   let adminDetails = sessionStorage.getItem("adminDetails");
  //   const adminObj = JSON.parse(adminDetails);
  //   setName(adminObj.name)
  //   setEmail(adminObj.email)
  //   setMobileNo(adminObj.mobileNo)
  // }, [])
    let adminDetails = sessionStorage.getItem("adminDetails");
    const sessionObject = JSON.parse(adminDetails);
    const admin = {
      name: sessionObject.name,
      email: sessionObject.email,
      mobile: sessionObject.mobileNo,
      role: sessionObject.roles[1],
      access: sessionObject.roles[0],
      avatar: adminAvatar,
      bio: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iure tempore sapiente ratione provident eum, nulla ad quidem porro ab expedita?",
    }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1>{admin.name}</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.avatar}>
          <img src={admin.avatar} alt="admin Avatar" />
        </div>
        <div className={styles.details}>
          <p><strong>Email:</strong> {admin.email}</p>
          <p><strong>Mobile:</strong> {admin.mobile}</p>
          <p><strong>Role:</strong> {admin.role}</p>
          <p><strong>Access:</strong> {admin.access}</p>
        </div>
      </div>
    </div>
  )
}

export default Profile