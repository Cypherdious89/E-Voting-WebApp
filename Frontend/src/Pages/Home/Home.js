import React from 'react'
import './Styles/Home.css'
import { useNavigate, Link } from 'react-router-dom'
function Home() {
	const navigate = useNavigate();

	const checkLoggedIn = localStorage.getItem('userToken') !== null;

  	return (
		<>
			<nav className="navbar">
				<h1 className="logo">E-Voting Portal</h1>
				<ul className="nav-links">
					<li><a href="#banner" className="nav-link">Home</a></li>
					<li><a href="#features" className="nav-link">Features</a></li>
					<li><Link to="/user/signup" className="nav-link">Register</Link></li>
					{checkLoggedIn ? 
						<li><Link to="/user/dashboard" className="nav-link">Dashboard</Link></li>
						:
						<li><Link to="/user/login" className="nav-link">Login</Link></li>
					}
				</ul>
			</nav>
			<div className="banner" id="banner">
				<h1 className="banner-heading">E-Voting Portal</h1>
				<p className="banner-subheading">The secure and transparent way to vote</p>
				<button className="banner-button" onClick={() => navigate('/user/signup')}>Get Started</button>
			</div>
			<div className="features" id="features">
				<h2 className="features-heading">Features</h2>
				<ul className="features-list">
					<li className="feature-item">Secure and transparent voting process</li>
					<li className="feature-item">Immutable blockchain technology</li>
					<li className="feature-item">Decentralized system for fair elections</li>
					<li className="feature-item">Easy and convenient to use</li>
					<li className="feature-item">Real-time updates and results</li>
					<li className="feature-item">Customized Election Creation</li>
				</ul>
			</div>
			<footer className="footer">
				<p className="footer-text">E-Voting Web Portal &copy; 2023</p>
			</footer>
		</>
  	)
}

export default Home