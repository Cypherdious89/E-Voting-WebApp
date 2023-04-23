import React from 'react'
import './Styles/Home.css'
import { useNavigate } from 'react-router-dom'
function Home() {
	const navigate = useNavigate();
  	return (
		<>
			<div className="main">
				<h1 className="title"> E-Voting WebApp</h1>
				<h3 className="description">The E-Voting Web-App is a decentralized and tamper-proof system
				for conducting elections that uses the MERN stack and blockchain technology. The app includes features 
				such as voter registration, authentication, validation, multiple voting methods, and real-time monitoring 
				and reporting. The Web App secures each vote using cryptography techniques like encryption and digital 
				signatures. The blockchain ledger verifies every vote, providing a transparent and auditable platform
				for organizations, governments, and institutions to conduct online elections securely and efficiently. 
				</h3>
				<div className="home-btn">
					<button className="primaryBtn" onClick={() => navigate('/signup')}>Sign Up</button>
					<button className="primaryBtn" onClick={() => navigate('/login')}>Login</button>
				</div>
			</div>
		</>
  	)
}

export default Home