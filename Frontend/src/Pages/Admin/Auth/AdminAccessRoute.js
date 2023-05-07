import React, {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {decodeToken} from "react-jwt";
import {toast} from 'react-toastify'

function AdminProtectedRoute({Component}) {
    const navigate = useNavigate()
    useEffect(() => {
        let loggedIn = localStorage.getItem('adminToken')
        const admin = decodeToken(loggedIn);
        if (!loggedIn) {
            toast.error("You are not authorized to access this page !", {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              theme: "black",
            })
            setTimeout(() => {
              navigate("/");
            }, 10);
        }
        if(admin.access !== 'readwrite' || admin.role !== 'Admin') {
            toast.error("Only admins can add or modify election details!", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "dark"
            });
            setTimeout(() => {
              navigate(-1);
            }, 10);
        }
    })
    return (
        <Component />
    )
}

export default AdminProtectedRoute