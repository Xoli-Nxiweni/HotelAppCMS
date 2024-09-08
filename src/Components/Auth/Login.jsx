// src/components/Login.js
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Firebase/Firebase'; // Import Firebase auth instance
import { TextField, Button, Typography, Container, Paper, Box } from '@mui/material';

// eslint-disable-next-line react/prop-types
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email === 'HotAdmin@Hotel.com' && password === 'HotAdmin123@321') {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        onLogin(); // Pass success event up to the parent component
      } catch (err) {
        // Log detailed error to the console
        console.error('Login error: ', err);
        setError('Failed to log in. Please check your credentials.');
      }
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: 16 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Admin Login
        </Typography>
        <form onSubmit={handleLogin}>
          <Box mb={2}>
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Box>
          {error && <Typography color="error" variant="body2" gutterBottom>{error}</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: 16 }}
          >
            Log In
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
