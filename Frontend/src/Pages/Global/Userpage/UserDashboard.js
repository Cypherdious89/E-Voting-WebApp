import React, {useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {decodeToken} from "react-jwt";
import styles from '../Styles/dashboard.module.css';
import UserNavbar from './Components/UserNavbar'

function UserDashboard() {
    const navigate = useNavigate();

    async function populateUser() {
        const req = await fetch('http://localhost:5500/api/user', {
            headers: {
                'x-access-token' : localStorage.getItem('userToken')
            }
        })
 
        const data = await req.json();
        if(data.status === 'OK'){
            console.log(data)
        }
    } 
    
    useEffect (() => {
        const userToken = localStorage.getItem('userToken');
        const otpVerified = localStorage.getItem('otpVerified');
        
        if (userToken && otpVerified) {
            const user = decodeToken(userToken)
            if(!user){
                localStorage.removeItem(userToken);
                navigate('/user/login')
            } else {
                populateUser();
            }
        }
    }, [navigate]);

    return (
        <div className={styles.container}>
            <UserNavbar />
            <div className={styles.content}>
                <h1 className={styles.title}>Welcome to User Dashboard</h1>
                <div className={styles.cardContainer}>
                    <Link to="/user/elections">
                        <div className={styles.card}>
                            <h2>Elections</h2>
                            <p>View ongoing elections</p>
                        </div>
                    </Link>
                    <Link to="/user/results">
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

export default UserDashboard