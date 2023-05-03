import React, {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

function UserProtectedRoute({Component}) {
    const navigate = useNavigate()
    useEffect(() => {
        let loggedIn = localStorage.getItem('userToken')
        if (!loggedIn) {
            navigate('/user/login')
            alert("Please login to continue !")
        }
    })
    return (
        <Component />
    )
}

export default UserProtectedRoute