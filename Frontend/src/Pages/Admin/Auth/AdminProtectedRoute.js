import React, {useEffect} from 'react'
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'

function AdminProtectedRoute({Component}) {
    const navigate = useNavigate()
    useEffect(() => {
        let loggedIn = localStorage.getItem('adminToken')
        if (!loggedIn) {
            toast.error("You are not authorized to access this page !", {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              theme: "dark",
            });
            setTimeout(() => {
              navigate("/");
            }, 10);
        }
    })
    return (
        <Component />
    )
}

export default AdminProtectedRoute