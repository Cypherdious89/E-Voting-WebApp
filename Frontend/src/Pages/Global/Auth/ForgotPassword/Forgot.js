import {Avatar, TextField, Box, Button, Typography, Container} from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';

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
            < HelpIcon / >
        </Avatar>
        <Typography component="h1" variant="h5">
            Forgot Password ?
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                name = "email" required fullWidth
                id="email"
                label="Email Address"
                autoFocus
                margin="normal"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Requestion Verfication
            </Button>
            </Box>
        </Box>
    </Container>
  );
}