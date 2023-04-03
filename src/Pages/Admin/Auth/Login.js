import {Avatar, Button,TextField, Box, Typography, Container} from "@mui/material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

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
            <AdminPanelSettingsIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
            Admin Login
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
            <TextField
                name = "code" required fullWidth
                id = "code"
                label="Access Code"
                inputProps={{ maxLength: 16 }}
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
            </Box>
        </Box>
    </Container>
  );
}