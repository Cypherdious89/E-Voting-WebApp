import React from 'react'
import {Route, Routes, BrowserRouter} from "react-router-dom"
import UserProtectedRoute from './Pages/Global/Auth/UserProtectedRoute'
import AdminProtectedRoute from './Pages/Admin/Auth/AdminProtectedRoute'
import AdminAccessRoute from './Pages/Admin/Auth/AdminAccessRoute'
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
import ChangePhase from './Pages/Admin/AdminPage/ChangePhase'

function Router() {
  return (
  <BrowserRouter>
		<Routes>
			<Route exact path = '/' element = {<Home/>} />
    
      <Route path='/user/*'>
        <Route path='login' element = {<Login />} />
        <Route path='signup' element = {<Signup />} />
        <Route path='forgot-password' element = {<ForgotPassword />} />
        <Route path='dashboard' element ={<UserProtectedRoute Component={UserDashboard} />} />
        <Route path='elections' element={<UserProtectedRoute Component={OngoingElections} />}/>
        <Route path='results' element={<UserProtectedRoute Component={ViewResults}/>}/>
        <Route path='profile' element={<UserProtectedRoute Component={UserProfile}/>}/>
        <Route path='*' element={<ErrorPage />} />
      </Route>

      <Route path='/admin/*'>
        <Route path='login' element = {<AdminLogin />} />
        <Route path='dashboard' element ={<AdminProtectedRoute Component={AdminDashboard}/>} />
        <Route path='elections' element ={<AdminProtectedRoute Component={ViewElections}/>} />
        <Route path='elections/add' element ={<AdminAccessRoute Component={AddElection}/>} />
        <Route path='elections/:_id/candidates' element={<AdminProtectedRoute Component={CandidateList}/>}/>
        <Route path='elections/:_id/edit' element={<AdminAccessRoute Component={EditElection}/>}/>
        <Route path='elections/:_id/phase' element ={<AdminAccessRoute Component={ChangePhase}/>}/>
        <Route path='results' element ={<AdminProtectedRoute Component={ConcludedElections}/>} />
        <Route path='profile' element ={<AdminProtectedRoute Component={AdminProfile}/>}/>
        <Route path = '*' element = {<AdminProtectedRoute Component = {ErrorPage}/>} />
      </Route>

      <Route path='*' element={<ErrorPage />}/>
		</Routes>
	</BrowserRouter>
  )
}

export default Router