// src/App.js
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './Firebase/Firebase';
import Login from './Components/Auth/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import './App.css'

const App = () => {
  const [user, setUser] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <Router>
      <AppBar position="static" sx={{
        background: '#000'
      }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, background: 'black' }}>
          <div className="logo">
            <h1>Rest<span>Q</span>uest</h1>
          </div>
          </Typography>
          {user && (
            <Button color="inherit" onClick={handleLogout}>
              Log Out
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ marginTop: 3 }}>
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={() => window.location.href = '/dashboard'} />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
