import React, {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserProtectedRoute({Component}) {
    const navigate = useNavigate()
    useEffect(() => {
        let loggedIn = localStorage.getItem('userToken')
        if (!loggedIn) {
            setTimeout(() => {

                toast.error("Please login to continue!", {
                    position: "top-center",
                    autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              theme: "dark",
            });
            setTimeout(() => {
                navigate("/");
            }, 100)
        }, 1000)
        }
    })
    return (
        <Component />
    )
}

export default UserProtectedRoute