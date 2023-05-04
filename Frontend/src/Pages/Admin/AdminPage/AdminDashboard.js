import React, {useEffect, useState} from 'react'
import styles from '../Styles/dashboard.module.css'
import { Link } from 'react-router-dom';
import {useNavigate} from 'react-router-dom'
import {decodeToken} from "react-jwt";
import AdminNavbar from './Components/AdminNavbar'

function AdminDashboard() {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
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
            const access = admin.access, role = admin.role;
            setRoles([access, role])
            if(!admin){
                localStorage.removeItem(adminToken);
                navigate('/admin/login')
            } else {
                populateAdmin();
            }
        }
    }, [navigate])

    return (
        <div className={styles.container}>
            <AdminNavbar />
            <div className={styles.content}>
                <h1 className={styles.title}>Welcome to Admin Dashboard</h1>
                <div className={styles.cardContainer}>
                    <Link to={"/admin/elections/add"} state={{data: roles}}>
                        <div className={styles.card}>
                            <h2>Add Election</h2>
                            <p>Create an election for conduction</p>
                        </div>
                    </Link>
                    <Link to={"/admin/elections"} state={{data: roles}}>
                        <div className={styles.card}>
                            <h2>Elections</h2>
                            <p>Manage ongoing elections</p>
                        </div>
                    </Link>
                    <Link to={"/admin/results"} state={{data: roles}}>
                        <div className={styles.card}>
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