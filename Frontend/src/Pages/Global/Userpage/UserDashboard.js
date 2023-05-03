import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {decodeToken} from "react-jwt";

function UserDashboard() {
    const navigate = useNavigate();
    const [name, setName] = useState('');

    async function populateUser() {
        const req = await fetch('http://localhost:5500/api/user', {
            headers: {
                'x-access-token' : localStorage.getItem('userToken')
            }
        })
 
        const data = req.json();
        if(data.status === 'OK'){
            console.log(data)
        }
    } 
    
    useEffect (() => {
        const userToken = localStorage.getItem('userToken');
        if (userToken) {
            const user = decodeToken(userToken)
            setName(user.username)
            if(!user){
                localStorage.removeItem(userToken);
                navigate('/user/login')
            } else {
                populateUser();
            }
        }
    }, [navigate])
    const logout = () => {
        window.localStorage.clear();
        alert("Successfully Logged Out !")
        window.location.href = '/user/login'
    }
    return (
        <> 
            <h1>User Page</h1>
            <h3>Hello {name || "Unknown"}!</h3>
            <ul>
                <li><Link to='/user/elections'>Ongoing Elections</Link></li>
                <li><Link to='/user/results'>View Recent Results</Link></li>
                <li><Link to='/user/profile'>User Profile</Link></li>
                <li><Link onClick={logout}>Logout !</Link></li>
            </ul>
        </>
    )
}

export default UserDashboard