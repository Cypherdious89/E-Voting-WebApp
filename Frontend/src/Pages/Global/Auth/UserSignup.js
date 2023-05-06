import React from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom'

const theme = createTheme();

function SignUp() {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [aadhar, setAadhar] = useState('');
    const [uid, setUid] = useState('');

    const navigate = useNavigate();

    const handleKeyDown = (e) => {
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    };

    async function SignupUser(event){
        event.preventDefault();
        const response = await fetch('http://localhost:5500/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({
                username, 
                email, 
                password, 
                mobileNumber, 
                aadhar, 
                uid
            })

        });
        const data = await response.json();
        if(data.status === 'OK') {
            toast.success(data.message, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              theme: "dark",
            });
            navigate('/user/login')
        } else {
            toast.error(data.message, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              theme: "dark",
            });
        }
    }

    return (
      <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                px: 4,
                py: 2,
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign Up
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={SignupUser}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                      name="name"
                      required
                      fullWidth
                      id="name"
                      label="Name"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      name="email"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      name="password"
                      required
                      fullWidth
                      id="password"
                      label="Password"
                      type="password"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      name="mobile"
                      required
                      fullWidth
                      id="mobile"
                      label="Mobile No."
                      onKeyDown={handleKeyDown}
                      inputProps={{ maxLength: 10 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={uid}
                      onChange={(e) => setUid(e.target.value)}
                      name="uid"
                      required
                      fullWidth
                      id="uid"
                      label="Unique ID"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={aadhar}
                      onChange={(e) => setAadhar(e.target.value)}
                      name="aadhar"
                      required
                      fullWidth
                      id="aadhar"
                      label="Aadhar No."
                      onKeyDown={handleKeyDown}
                      inputProps={{ maxLength: 12 }}
                      type="password"
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up !
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link to="/user/login" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
      </ThemeProvider>
    );
}

export default SignUp;