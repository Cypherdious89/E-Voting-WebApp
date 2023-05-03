import React, {useEffect} from 'react'
import '../Styles/dashboard.css'
import { Link } from 'react-router-dom';
import {useNavigate} from 'react-router-dom'
import {decodeToken} from "react-jwt";
import AdminNavbar from './Components/AdminNavbar'

function AdminDashboard() {
    const navigate = useNavigate();
    async function populateAdmin() {
        const req = await fetch('http://localhost:5500/api/admin', {
            headers: {'x-access-token' : localStorage.getItem('adminToken')}
        })
 
        const data = req.json();
        if(data.status === 'OK'){
            console.log(data)
        }
    }

    useEffect (() => {
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
            const admin = decodeToken(adminToken)
            if(!admin){
                localStorage.removeItem(adminToken);
                navigate('/admin-login')
            } else {
                populateAdmin();
            }
        }
    }, [navigate])

    return (
        <div className="admin-dashboard-container">
            <AdminNavbar />
            <div className="admin-dashboard-content">
                <h1 className="admin-dashboard-title">Welcome to Admin Dashboard</h1>
                <div className="admin-card-container">
                    <Link to="/admin/elections/add">
                        <div className="admin-card">
                            <h2>Add Election</h2>
                            <p>Create an election for conduction</p>
                        </div>
                    </Link>
                    <Link to="/admin/elections">
                        <div className="admin-card">
                            <h2>Elections</h2>
                            <p>Manage ongoing elections</p>
                        </div>
                    </Link>
                    <Link to="/admin/results">
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