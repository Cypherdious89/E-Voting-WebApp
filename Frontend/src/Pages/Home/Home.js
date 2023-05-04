import React from 'react'
import styles from './Styles/Home.module.css'
import { useNavigate, Link } from 'react-router-dom'
function Home() {
	const navigate = useNavigate();

	const checkLoggedIn = localStorage.getItem('userToken') !== null;

  	return (
		<>
			<nav className={styles.navbar}>
				<h1 className={styles.logo}>E-Voting Portal</h1>
				<ul className={styles.navLinks}>
					<li><a href="#banner" className={styles.navLink}>Home</a></li>
					<li><a href="#features" className={styles.navLink}>Features</a></li>
					<li><Link to="/user/signup" className={styles.navLink}>Register</Link></li>
					{checkLoggedIn ? 
						<li><Link to="/user/dashboard" className={styles.navLink}>Dashboard</Link></li>
						:
						<li><Link to="/user/login" className={styles.navLink}>Login</Link></li>
					}
				</ul>
			</nav>
			<div className={styles.banner} id="banner">
				<h1 className={styles.banner_heading}>E-Voting Portal</h1>
				<p className={styles.banner_subheading}>The secure and transparent way to vote</p>
				<button className={styles.bannerBtn} onClick={() => navigate('/user/signup')}>Get Started</button>
			</div>
			<div className={styles.features} id="features">
				<h2 className={styles.features_heading}>Features</h2>
				<ul className={styles.list}>
					<li className={styles.listItem}>Secure and transparent voting process</li>
					<li className={styles.listItem}>Immutable blockchain technology</li>
					<li className={styles.listItem}>Decentralized system for fair elections</li>
					<li className={styles.listItem}>Easy and convenient to use</li>
					<li className={styles.listItem}>Real-time updates and results</li>
					<li className={styles.listItem}>Customized Election Creation</li>
				</ul>
			</div>
			<footer className={styles.footer}>
				<p className={styles.footer_text}>E-Voting Web Portal &copy; 2023</p>
			</footer>
		</>
  	)
}

export default Home