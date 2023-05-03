import React, {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

function AdminProtectedRoute({Component}) {
    const navigate = useNavigate()
    useEffect(() => {
        let loggedIn = localStorage.getItem('adminToken')
        if (!loggedIn) {
            navigate('/')
            alert("You are not authorized to access this page !")
        }
    })
    return (
        <Component />
    )
}

export default AdminProtectedRoute