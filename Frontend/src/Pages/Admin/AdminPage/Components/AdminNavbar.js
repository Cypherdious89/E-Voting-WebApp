import React from 'react'
import { Link } from 'react-router-dom';
import NavLogo from './assets/vote.png'
import { Avatar, Tooltip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

function AdminNavbar() {
    const handleLogout = () => {
        window.localStorage.clear();
        window.location.href = '/'
        alert("Successfully Logged Out !")
    };
    return (
        <nav className="admin-navbar">
            <div className="admin-navbar-left">
                <img src={NavLogo} alt="Logo" />
                <span>E-voting Portal</span>
            </div>
            <div className="admin-navbar-right">
                <Link onClick={()=>handleLogout()} className="logout-button">Logout</Link>
                <Link to="/admin/profile">
                    <div className="profile-avatar">
                        <Tooltip title='Admin Profile' arrow>
                            <Avatar sx={{ color: 'white', bgcolor: 'black' }}>
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