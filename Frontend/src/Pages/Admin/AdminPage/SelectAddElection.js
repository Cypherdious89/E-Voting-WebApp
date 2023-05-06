import React from 'react'
import AdminNavbar from './Components/AdminNavbar'
import { Link } from 'react-router-dom';
import styles from '../Styles/dashboard.module.css'

function SelectElectionType() {
    return ( 
        <div className={styles.container}>
            <AdminNavbar />
            <div className={styles.content}>
                <h1 className={styles.title}>Select Election Type</h1>
                <div className={styles.cardContainer}>
                    <Link to={"/admin/elections/add/open"}>
                        <div className={styles.card}>
                            <h2>Open Election</h2>
                            <p>Election of roles like MP, MLA, Mayor, etc.</p>
                        </div>
                    </Link>
                    <Link to={"/admin/elections/add/closed"}>
                        <div className={styles.card}>
                            <h2>Closed Elections</h2>
                            <p>Institute and Department elections like Gymkhana elections, DUGC elections, etc.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SelectElectionType