import {Avatar, Button,TextField, Grid, Box, Typography, Container} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from "react-router-dom";

export default function LogIn() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
        email: data.get("email"),
        password: data.get("password"),
    });
  };

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
            <AccountCircleIcon / >
        </Avatar>
        <Typography component="h1" variant="h5">
            Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                name = "email" required fullWidth
                id="email"
                label="Email Address"
                autoFocus
                margin="normal"
            />
            <TextField
                name = "password" required fullWidth
                label="Password"
                type="password"
                id="password"
                margin="normal"
            />
            <TextField
                name = "mobile" required fullWidth
                id = "mobile"
                label="Mobile No."
                onKeyPress={(e) => {if (!/[0-9]/.test(e.key)) {e.preventDefault();}}}
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
                <Link to="/forgot-password" variant="body2">
                    Forgot password?
                </Link>
                </Grid>
                <Grid item>
                <Link to="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                </Link>
                </Grid>
            </Grid>
            </Box>
        </Box>
    </Container>
  );
}