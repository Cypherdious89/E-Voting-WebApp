import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
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
        <> 
            <h1>User Page</h1>
            <h3>Hello {name || "Unknown"}!</h3>
            <ul>
                <li><Link to='/ongoing-elections'>Ongoing Elections</Link></li>
                <li><Link to='/results'>View Recent Results</Link></li>
                <li><Link to='/profile'>User Profile</Link></li>
                <li><Link to='/login'>Logout !</Link></li>
            </ul>
        </>
    )
}

export default UserDashboard