import React from 'react'
import { Link } from 'react-router-dom';
import NavLogo from './assets/vote.png';
import styles from '../../Styles/dashboard.module.css';
import { Avatar, Tooltip, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";



function UserNavbar() {
    const handleLogout = () => {
        toast.info("Successfully Logged Out !", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "dark",
        });
        setTimeout(() => {
          window.localStorage.clear();
          window.sessionStorage.clear();
          // setGetElection(null)
          window.location.href = "/";
        }, 500);
    };
    return (
      <nav className={styles.navbar}>
        <div className={styles.navbarLeft}>
          <img src={NavLogo} alt="Logo" />
          <span>E-Voting Portal</span>
        </div>
        <div className={styles.navbarRight}>
          <Link to="/user/dashboard"><IconButton><HomeRoundedIcon sx={{color: 'white'}}/></IconButton></Link>
          <Link onClick={() => handleLogout()} className={styles.logoutBtn}>
            Logout
          </Link>
          <Link to="/user/profile">
            <div className={styles.avatar}>
              <Tooltip title="User Profile" arrow>
                <Avatar sx={{ color: "black", bgcolor: "white" }}>
                  <PersonIcon />
                </Avatar>
              </Tooltip>
            </div>
          </Link>
        </div>
      </nav>
    );
}

export default UserNavbar