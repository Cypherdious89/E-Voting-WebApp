import React, {useEffect} from 'react'
import '../Styles/dashboard.css'
import NavLogo from './Components/assets/vote.png'
import { Avatar, Tooltip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';
import {useNavigate} from 'react-router-dom'
import {decodeToken} from "react-jwt";

function AdminDashboard() {
    const navigate = useNavigate();
    async function populateAdmin() {
        const req = await fetch('http://localhost:5500/api/admin', {
            headers: {'x-access-token' : localStorage.getItem('token')}
        })
 
        const data = req.json();
        if(data.status === 'OK!'){
            console.log(data.data)
        }
    }

    useEffect (() => {
        const token = localStorage.getItem('token');
        if(token){
            const admin = decodeToken(token)
            if(!admin){
                localStorage.removeItem(token);
                navigate('/admin-login')
            } else {
                populateAdmin();
            }
        }
    }, [navigate])

    const handleLogout = () => {
        window.localStorage.clear();
        window.location.href = '/'
        alert("Successfully Logged Out !")
    };

    return (
        <div className="admin-dashboard-container">
            <nav className="admin-navbar">
                <div className="admin-navbar-left">
                    <img src={NavLogo} alt="Logo" />
                    <span>E-voting Portal</span>
                </div>
                <div className="admin-navbar-right">
                    <Link onClick={()=>handleLogout()} className="logout-button">Logout</Link>
                    <Link to="/admin-profile">
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
            <div className="admin-dashboard-content">
                <h1 className="admin-dashboard-title">Welcome to Admin Dashboard</h1>
                <div className="admin-card-container">
                    <Link to="/add-election">
                        <div className="admin-card">
                            <h2>Add Election</h2>
                            <p>Create an election for conduction</p>
                        </div>
                    </Link>
                    <Link to="/view-elections">
                        <div className="admin-card">
                            <h2>Elections</h2>
                            <p>Manage ongoing elections</p>
                        </div>
                    </Link>
                    <Link to="/view-results">
                        <div className="admin-card">
                            <h2>Results</h2>
                            <p>View completed results</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard