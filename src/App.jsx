import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './Firebase/Firebase';
import Login from './Components/Auth/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import { AppBar, Toolbar, Typography, Button, Container, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { LogOut, Menu } from 'lucide-react';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null); // Initialize user as null
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <Router>
      <AppBar 
        position="static" 
        sx={{
          background: 'linear-gradient(145deg, #2c3e50, #3498db)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            <div className="logo">
              <h1>Rest<span>Q</span>uest</h1>
            </div>
          </Typography>
          
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Logout Button (Visible on Desktop) */}
              <Button 
                color="inherit" 
                onClick={handleLogout}
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  alignItems: 'center',
                  gap: '5px',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                <LogOut size={18} />
                Log Out
              </Button>
              
              {/* Hamburger Menu (Visible on Mobile) */}
              <IconButton 
                color="inherit" 
                sx={{ display: { sm: 'none' } }}
                onClick={toggleMobileMenu}
              >
                <Menu />
              </IconButton>
            </div>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          '& .MuiDrawer-paper': {
            width: '250px',
            background: 'linear-gradient(145deg, #2c3e50, #3498db)',
            color: '#fff',
          }
        }}
      >
        <List>
          <ListItem 
            component="button" // Use "button" to make it behave like a button
            onClick={handleLogout}
            sx={{
              '&:hover': {
                background: 'rgba(255,255,255,0.1)'
              },
              cursor: 'pointer', // Add pointer cursor for better UX
            }}
          >
            <ListItemText primary="Log Out" />
            <LogOut size={18} />
          </ListItem>
        </List>
      </Drawer>

      <Container 
        maxWidth="xl" 
        sx={{ 
          padding: { xs: '0 16px', sm: '0 24px' },
          marginTop: 0 
        }}
      >
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