import React from 'react';
import { toast } from "react-toastify";
import {Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import Web3 from 'web3';

const theme = createTheme();

function SignUp() {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [age, setAge] = useState('');
    const [uid, setUid] = useState('');

    const navigate = useNavigate();
    const min_age = 10, max_age = 120;


  const handleKeyDown = (e) => {
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

    // const sendOTP = async () => {
    //   const request = await fetch("http://localhost:5500/api/otp/send", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       email: email,
    //       mobile: mobileNumber,
    //     }),
    //   });
    //   const data = await request.json();
    //   if (data.status === "OK") {
    //     toast.success(data.message, {
    //       position: "top-center",
    //       autoClose: 500,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       theme: "dark",
    //     });
    //   } else {
    //     toast.error(data.message, {
    //       position: "top-center",
    //       autoClose: 500,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       theme: "dark",
    //     });
    //   }
    // };

    const checkUniqueID = (uid) => {
      if (uid.length !== 10) {
        toast.error("Unique ID must have 10 characters", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "dark",
        });
        setUid("");
        return false;
      }

      const firstThreeChars = uid.slice(0, 3);
      const lastSevenChars = uid.slice(3, 10);
      const regexUppercase = /^[A-Z]+$/;
      const regexNumbers = /^[0-9]+$/;
      // Check if the first three characters are uppercase letters
      if (!regexUppercase.test(firstThreeChars)) {
        toast.error(`First Three Characters of ID must be uppercase letters`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "dark",
        });
        setUid("");
        return false;
      }

      if (!regexNumbers.test(lastSevenChars)) {
        toast.error(`Last Seven Characters of ID must be numbers`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "dark",
        });
        setUid("");
        return false;
      }

      // Unique ID is valid
      toast.info("Unique ID is valid", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
      setUid(uid);
      return true;
    }

    const getWalletAddress = async () => {
      const web3 = new Web3(window.ethereum);
      // await web3.eth.enable();
      const userWalletAddress = await web3.eth.getAccounts();
      return userWalletAddress[0];
    }

    async function SignupUser(event){
        event.preventDefault();
        const walletAddress = await getWalletAddress();
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
                age, 
                uid,
                walletAddress
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
            toast.warn(data.message, {
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
                    onBlur={(e) => {
                      const uid = e.target.value;
                      checkUniqueID(uid);
                    }}
                    name="uid"
                    required
                    fullWidth
                    id="uid"
                    label="Unique ID"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={age}
                    onChange={(e) => {
                        var val = parseInt(e.target.value, 10);
                        if (val > max_age) val = max_age;
                        if (val < min_age) val = min_age;;
                      setAge(e.target.value)
                    }}
                    name="age"
                    required
                    fullWidth
                    id="age"
                    label="Enter Age"
                    onKeyDown={handleKeyDown}
                    inputProps={{ maxLength: 3 }}
                    type="text"
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