import React from "react";
import {Route, Routes, BrowserRouter} from "react-router-dom";
import Home from './Pages/Home/Home';
import Signup from './Pages/Global/Auth/Signup/Signup'
import Login from './Pages/Global/Auth/Login/Login'
import ForgotPassword from './Pages/Global/Auth/ForgotPassword/Forgot'
import AdminLogin from './Pages/Admin/Auth/Login'

const App = () => {
	return (
	<BrowserRouter>
		<Routes>
			<Route exact path = '/' element = {<Home/>} />
			<Route path='/login' element = {<Login />} />
			<Route path='/signup' element = {<Signup />} />
			<Route path='/forgot-password' element = {<ForgotPassword />} />
			<Route path='/admin-login' element = {<AdminLogin />} />
		</Routes>
	</BrowserRouter>
	)
}

export default App;