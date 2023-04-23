import React from 'react'
import {Route, Routes, BrowserRouter} from "react-router-dom"
import Home from './Pages/Home/Home'
import ErrorPage from './Pages/Home/Error'
import Signup from './Pages/Global/Auth/UserSignup'
import Login from './Pages/Global/Auth/UserLogin'
import ForgotPassword from './Pages/Global/Auth/Forgot'
import AdminLogin from './Pages/Admin/Auth/AdminLogin'
import UserDashboard from "./Pages/Global/Userpage/UserDashboard"
import OngoingElections from "./Pages/Global/Userpage/ViewElections"
import ViewResults from "./Pages/Global/Userpage/Results"
import UserProfile from "./Pages/Global/Userpage/Profile"
import AddElection from "./Pages/Admin/AdminPage/AddElection"
import AdminDashboard from "./Pages/Admin/AdminPage/AdminDashboard"
import ViewElections from "./Pages/Admin/AdminPage/ViewElections"
import AdminProfile from "./Pages/Admin/AdminPage/Profile"
import CandidateList from './Pages/Admin/AdminPage/CandidateList'
import EditElection from './Pages/Admin/AdminPage/EditElection'
import ConcludedElections from "./Pages/Admin/AdminPage/Results"

function Router() {
  return (
    <BrowserRouter>
		<Routes>
			<Route exact path = '/' element = {<Home/>} />
			<Route path='login' element = {<Login />} />
			<Route path='signup' element = {<Signup />} />
			<Route path='forgot-password' element = {<ForgotPassword />} />
			<Route path='admin-login' element = {<AdminLogin />} />
			<Route path='user-dashboard' element ={<UserDashboard />} />
      <Route path='ongoing-elections' element={<OngoingElections />}/>
      <Route path='results' element={<ViewResults />}/>
      <Route path='profile' element={<UserProfile />}/>
      <Route path='admin-dashboard' element ={<AdminDashboard />} />
      <Route path='add-election' element ={<AddElection />} />
      <Route path='view-elections' element ={<ViewElections />} />
      <Route path='view-elections/:_id/candidate-list' element={<CandidateList />}/>
      <Route path='view-elections/:_id/edit-election-details' element={<EditElection />}/>
      <Route path='view-results' element ={<ConcludedElections />} />
      <Route path='admin-profile' element ={<AdminProfile />}/>
      <Route path='*' element={<ErrorPage />}/>
		</Routes>
	</BrowserRouter>
  )
}

export default Router