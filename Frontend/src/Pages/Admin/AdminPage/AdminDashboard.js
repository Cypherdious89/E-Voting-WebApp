import React, {useEffect, useRef, useState} from 'react'
import styles from '../Styles/dashboard.module.css'
import { Link, useNavigate } from 'react-router-dom';
import {decodeToken} from "react-jwt";
import AdminNavbar from './Components/AdminNavbar'

function AdminDashboard() {
    const navigate = useNavigate();
    var [ adminRoles, setAdminRoles ] = useState([]);
    var [walletAddress, setWalletAddress ] = useState('');
    const accessRef = useRef(null);
    const rolesRef = useRef(null);
    const addressRef = useRef(null);

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
            // console.log('adminToken', admin)
            accessRef.current = admin.access;
            rolesRef.current = admin.role;
            addressRef.current = admin.address;
            if(!admin){
                localStorage.removeItem(adminToken);
                navigate('/')
            } else {
                populateAdmin();
                const adminRoles = [accessRef.current, rolesRef.current];
                const walletAddress = addressRef.current
                setAdminRoles(adminRoles)
                setWalletAddress(walletAddress)
                sessionStorage.setItem("adminRoles", JSON.stringify(adminRoles));
                sessionStorage.setItem("walletAddress", walletAddress);
            }
        }
    }, [navigate])

    return (
        <div className={styles.container}>
            <AdminNavbar adminRoles={adminRoles} walletAddress={walletAddress} />
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