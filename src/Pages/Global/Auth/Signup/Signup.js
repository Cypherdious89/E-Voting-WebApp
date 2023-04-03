import React from 'react';
import {Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const theme = createTheme();

export default function SignUp() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign Up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            name="Name" required fullWidth
                            id="Name"
                            label="Name"
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name = "email" required fullWidth
                            id="email"
                            label="Email Address"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name = "password" required fullWidth
                            id = "password"
                            label="Password"
                            type="password"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            name = "mobile" required fullWidth
                            id = "mobile"
                            label="Mobile No."
                            onKeyPress={(e) => {if (!/[0-9]/.test(e.key)) {e.preventDefault();}}}
                            inputProps={{ maxLength: 10 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name = "uid" required fullWidth
                            id = "uid"
                            label="Unique ID"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name = "aadhar" required fullWidth
                            id = "aadhar"
                            label="Aadhar No."
                            onKeyPress={(e) => {if (!/[0-9]/.test(e.key)) {e.preventDefault();}}}
                            inputProps={{ maxLength: 12 }}
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
                    <Link to= "/login" variant="body2">
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