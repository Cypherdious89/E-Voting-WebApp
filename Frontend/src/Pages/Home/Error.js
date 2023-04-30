import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Styles/Error.module.css";

const NotFoundPage = () => {
  const location = useLocation();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>Page Not Found</p>
      <Link to={location.state?.from || "/"} className={styles.button}>
        Go back to previous page
      </Link>
    </div>
  );
};

export default NotFoundPage;
