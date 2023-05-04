import React from 'react'
import { Link } from 'react-router-dom';
import NavLogo from './assets/vote.png';
import styles from '../../Styles/dashboard.module.css';
import { Avatar, Tooltip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

function AdminNavbar() {
    const handleLogout = () => {
        window.localStorage.clear();
        window.location.href = '/'
        alert("Successfully Logged Out !")
    };
    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarLeft}>
                <img src={NavLogo} alt="Logo" />
                <span>E-Voting Portal</span>
            </div>
            <div className={styles.navbarRight}>
                <Link onClick={()=>handleLogout()} className={styles.logoutBtn}>Logout</Link>
                <Link to="/user/profile">
                    <div className={styles.avatar}>
                        <Tooltip title='User Profile' arrow>
                            <Avatar sx={{ color: 'black', bgcolor: 'white' }}>
                                <PersonIcon />
                            </Avatar>
                        </Tooltip>
                    </div>
                </Link>
            </div>
        </nav>
    )
}

export default AdminNavbar