import React, { useState } from "react";
import {Avatar, Button, TextField, Grid, Box, Typography, Container} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LogIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  // var otpMail, otpMobile;

  const handleKeyDown = (e) => {
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  async function loginUser(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:5500/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        mobileNumber,
      }),
    });
    const data = await response.json();
    if (data.user) {
      localStorage.setItem("userToken", data.user);
      sessionStorage.setItem("userDetails", JSON.stringify(data.details));
      toast.success(data.message, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
      navigate("/user/dashboard");
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
    <>
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: 6,
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <AccountCircleIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={loginUser} noValidate sx={{ mt: 1 }}>
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoFocus
              margin="normal"
            />
            <TextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              margin="normal"
            />
            <TextField
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              type="tel"
              name="mobile"
              required
              fullWidth
              id="mobile"
              label="Mobile No."
              onKeyDown={handleKeyDown}
              inputProps={{ maxLength: 10 }}
              margin="normal"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/user/forgot-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/user/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
