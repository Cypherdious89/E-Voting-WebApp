import {Avatar, Button,TextField, Box, Typography, Container} from "@mui/material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useState } from 'react';


export default function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [accessCode, setAccessCode] = useState('');


    async function Adminlogin(event) {
        event.preventDefault();
        const response = await fetch('http://localhost:5500/api/admin_login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                mobileNo,
                accessCode
            })
        });
        const data = await response.json();
        if (data.admin) {
                localStorage.setItem('adminToken', data.admin)
                sessionStorage.setItem("adminDetails", JSON.stringify(data.details));
                alert('Login successful !');
                window.location.href = '/admin/dashboard'
        } else {
                alert('Invalid credentials, please try again !')
        } 
    }

    return (
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
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <AdminPanelSettingsIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Admin Login
            </Typography>
            <Box component = "form" onSubmit = {Adminlogin} noValidate sx = {{mt: 1}} >
                <TextField
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name = "email" required fullWidth
                    id="email"
                    label="Email Address"
                    autoFocus
                    margin="normal"
                />
                <TextField
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name = "password" required fullWidth
                    label="Password"
                    type="password"
                    id="password"
                    margin="normal"
                />
                <TextField
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    name = "mobile" required fullWidth
                    id = "mobile"
                    label="Mobile No."
                    onKeyPress={(e) => {if (!/[0-9]/.test(e.key)) {e.preventDefault();}}}
                    inputProps={{ maxLength: 10 }}
                    margin="normal"
                />
                <TextField
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    name = "code" required fullWidth
                    id = "code"
                    label="Access Code"
                    margin="normal"
                    type="password"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Log In
                </Button>
                </Box>
            </Box>
        </Container>
    );
}