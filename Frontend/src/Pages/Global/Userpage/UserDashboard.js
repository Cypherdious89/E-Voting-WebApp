import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {decodeToken} from "react-jwt";

function UserDashboard() {
    const navigate = useNavigate();
    const [name, setName] = useState('');

    async function populateUser() {
        const req = await fetch('http://localhost:5500/api/user', {
            headers: {
                'x-access-token' : localStorage.getItem('token')
            }
        })
 
        const data = req.json();
        if(data.status === 'ok'){
            console.log(data)
        }
    } 
    useEffect (() => {
        const token = localStorage.getItem('token');
        if(token){
            const user = decodeToken(token)
            setName(user.username)
            if(!user){
                localStorage.removeItem(token);
                navigate('/login')
            } else {
                populateUser();
            }
        }
    }, [navigate])
    return (
        <h1>Hello {name || "Unknown"}!</h1>
    )
}

export default UserDashboard