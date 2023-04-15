import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import {useNavigate} from 'react-router-dom'
import {decodeToken} from "react-jwt";

function AdminDashboard() {
    const navigate = useNavigate();
    const [name, setName] = useState('');

    async function populateAdmin() {
        const req = await fetch('http://localhost:5500/api/admin', {
            headers: {'x-access-token' : localStorage.getItem('token')}
        })
 
        const data = req.json();
        if(data.status === 'OK!'){
            console.log(data)
        }
    }

    useEffect (() => {
        const token = localStorage.getItem('token');
        if(token){
            const admin = decodeToken(token)
            setName(admin.username)
            if(!admin){
                localStorage.removeItem(token);
                navigate('/admin-login')
            } else {
                populateAdmin();
            }
        }
    }, [navigate])
    return (
        <> 
            <h1>Admin Page</h1>
            <h3>Hello Mr. {name || "Unknown"}!</h3>
            <ul>
                <li><Link to='/add-election'>Add Election</Link></li>
                <li><Link to='/view-elections'>View Ongoing Elections</Link></li>
                <li><Link to='/view-results'>View Recent Results</Link></li>
                <li><Link to='/admin-profile'>Admin Profile</Link></li>
                <li><Link to='/admin-login'>Logout !</Link></li>
            </ul>
        </>
    )
}

export default AdminDashboard