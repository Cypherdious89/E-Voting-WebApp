import React from "react";
import {Route, Routes, BrowserRouter} from "react-router-dom";
import Home from './Pages/Home/Home';
import Signup from './Pages/Signup/Signup'
import Login from './Pages/Login/Login'

const App = () => {
	return (
	<BrowserRouter>
		<Routes>
			<Route exact path = '/' element = {<Home/>}></Route>
			<Route path='/login' element = {<Login />}></Route>
			<Route path='/signup' element = {<Signup />}></Route>
		</Routes>
	</BrowserRouter>
	)
}

export default App;