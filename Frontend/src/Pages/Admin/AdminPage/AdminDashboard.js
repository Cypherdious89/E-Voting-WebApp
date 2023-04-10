import React, {useEffect, useState} from 'react'
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
        <h1>Admin Page : {name || "Unknown"}!</h1>
    )
}

export default AdminDashboard