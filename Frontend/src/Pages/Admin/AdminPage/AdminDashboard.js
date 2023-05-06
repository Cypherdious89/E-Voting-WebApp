import React, {useEffect, useRef, useState} from 'react'
import styles from '../Styles/dashboard.module.css'
import { Link, useNavigate } from 'react-router-dom';
import {decodeToken} from "react-jwt";
import AdminNavbar from './Components/AdminNavbar'

function AdminDashboard() {
    const navigate = useNavigate();
    var { setAdminRoles } = useState([]);
    const accessRef = useRef(null);
    const rolesRef = useRef(null);

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
            accessRef.current = admin.access;
            rolesRef.current = admin.role;
            if(!admin){
                localStorage.removeItem(adminToken);
                navigate('/admin/login')
            } else {
                populateAdmin();
                const adminRoles = [accessRef.current, rolesRef.current];
                setAdminRoles(adminRoles)
                sessionStorage.setItem("adminRoles", JSON.stringify(adminRoles));
            }
        }
    }, [navigate, setAdminRoles])

    // const role = sessionStorage.getItem("adminRoles")
    // const roles = JSON.parse(role)
    // console.log(roles)

    return (
        <div className={styles.container}>
            <AdminNavbar />
            <div className={styles.content}>
                <h1 className={styles.title}>Welcome to Admin Dashboard</h1>
                <div className={styles.cardContainer}>
                    <Link to={"/admin/elections/add"}>
                        <div className={styles.card}>
                            <h2>Add Election</h2>
                            <p>Create an election for conduction</p>
                        </div>
                    </Link>
                    <Link to={"/admin/elections/view"}>
                        <div className={styles.card}>
                            <h2>Elections</h2>
                            <p>Manage ongoing elections</p>
                        </div>
                    </Link>
                    <Link to={"/admin/results"}>
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