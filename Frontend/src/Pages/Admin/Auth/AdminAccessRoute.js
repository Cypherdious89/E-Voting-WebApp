import React, {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {decodeToken} from "react-jwt";

function AdminProtectedRoute({Component}) {
    const navigate = useNavigate()
    useEffect(() => {
        let loggedIn = localStorage.getItem('adminToken')
        const admin = decodeToken(loggedIn);
        if (!loggedIn) {
            navigate('/')
            alert("You are not authorized to access this page !")
        }
        if(admin.access !== 'readwrite' || admin.role !== 'Admin') {
            navigate(-1)
            alert("Only admins can add or modify election details!")
        }
    })
    return (
        <Component />
    )
}

export default AdminProtectedRoute