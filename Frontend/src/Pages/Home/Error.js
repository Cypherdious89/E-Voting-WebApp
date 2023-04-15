import React from 'react'
import { Link, useNavigate} from 'react-router-dom'
import './Styles/Error.css'

function Error() {
  let navigate = useNavigate();
  return (
    <>
      <div className="container">
        <h1 className='error-heading'>:( </h1>
        <h2 className='error-description'>A <span>404</span> error occured, Page not found, check the URL and try again.</h2>
        <h3>
          <Link to = "/"className = 'error-links' > Return to home </Link> 
            &nbsp;|&nbsp; 
          <Link className='error-links' to={() => navigate(-1)}>Go Back</Link >
        </h3>
      </div>
    </>
  )
}

export default Error