import React from "react";
import {Route, Routes, BrowserRouter} from "react-router-dom";
import Home from './Pages/Home/Home';
import Signup from './Pages/Global/Auth/Signup/UserSignup'
import Login from './Pages/Global/Auth/Login/UserLogin'
import ForgotPassword from './Pages/Global/Auth/ForgotPassword/Forgot'
import UserDashboard from "./Pages/Global/Userpage/UserDashboard";
import AdminLogin from './Pages/Admin/Auth/AdminLogin'
import AdminDashboard from "./Pages/Admin/AdminPage/AdminDashboard";

const App = () => {
	return (
	<BrowserRouter>
		<Routes>
			<Route exact path = '/' element = {<Home/>} />
			<Route path='/login' element = {<Login />} />
			<Route path='/signup' element = {<Signup />} />
			<Route path='/forgot-password' element = {<ForgotPassword />} />
			<Route path='/admin-login' element = {<AdminLogin />} />
			<Route path='/user-dashboard' element ={<UserDashboard />} />
			<Route path='/admin-dashboard' element ={<AdminDashboard />} />

		</Routes>
	</BrowserRouter>
	)
}

export default App;