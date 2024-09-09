import React, { useState, useEffect } from 'react';
import { Button, Avatar, Typography, Box, Divider, Modal, TextField, List, ListItem, ListItemText, Paper } from '@mui/material';
import { fetchBookings, fetchFavorites } from '../../Firebase/FirestoreService'; // Adjust the path as needed
import './UserProfile.css';

const UserProfile = ({ user, onSignOut }) => {
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedBookings = await fetchBookings(user.uid); // Assuming user UID is used to fetch bookings
        setBookings(fetchedBookings);
        setLoadingBookings(false);

        const fetchedFavorites = await fetchFavorites(user.uid); // Assuming user UID is used to fetch favorites
        setFavorites(fetchedFavorites);
        setLoadingFavorites(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoadingBookings(false);
        setLoadingFavorites(false);
      }
    };

    loadData();
  }, [user.uid]);

  const handlePasswordChange = () => {
    // Implement password change logic here
    console.log('New Password:', newPassword);
    setOpenChangePassword(false);
  };

  return (
    <Box className="userProfileContainer" sx={{ padding: 3, maxWidth: 600 }}>
      {/* User Avatar */}
      <Box className="userProfileAvatar" sx={{ textAlign: 'center', mb: 3 }}>
        <Avatar 
          alt={user.displayName} 
          src={user.photoURL || 'https://via.placeholder.com/150'} 
          sx={{ width: 120, height: 120, border: '4px solid #fff', boxShadow: '0 0 15px rgba(0,0,0,0.2)' }}
        />
      </Box>

      {/* User Details */}
      <Typography variant="h4" align="center" sx={{ fontWeight: '600', mb: 1, color: '#333' }}>
        {user.displayName || 'Anonymous User'}
      </Typography>
      <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 2 }}>
        {user.email || 'user@example.com'}
      </Typography>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', mb: 2 }} />

      {/* Favorites Section */}
      <Typography variant="h6" align="left" sx={{ mb: 1, color: '#555' }}>
        Favorites:
      </Typography>
      {loadingFavorites ? (
        <Typography>Loading...</Typography>
      ) : (
        <List dense sx={{ maxHeight: 150, overflowY: 'auto', mb: 2 }}>
          {favorites.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item.name} secondary={item.description} />
            </ListItem>
          ))}
        </List>
      )}

      <Divider sx={{ mb: 2 }} />

      {/* Bookings Section */}
      <Typography variant="h6" align="left" sx={{ mb: 1, color: '#555' }}>
        Your Bookings:
      </Typography>
      {loadingBookings ? (
        <Typography>Loading...</Typography>
      ) : (
        <List dense sx={{ maxHeight: 150, overflowY: 'auto', mb: 2 }}>
          {bookings.map((booking, index) => (
            <ListItem key={index}>
              <ListItemText 
                primary={`Booking #${booking.id}`} 
                secondary={`Date: ${new Date(booking.date).toLocaleDateString()}`} 
              />
            </ListItem>
          ))}
        </List>
      )}

      <Divider sx={{ mb: 2 }} />

      {/* Action Buttons */}
      <Box sx={{ textAlign: 'center' }}>
        <Button 
          variant="contained" 
          className="editProfileBtn" 
          sx={{ mb: 2, px: 4, py: 1, fontSize: '14px' }}
        >
          Edit Profile
        </Button>
        <Button 
          variant="contained" 
          className="changePasswordBtn" 
          onClick={() => setOpenChangePassword(true)}
          sx={{ mb: 2, px: 4, py: 1, fontSize: '14px' }}
        >
          Change Password
        </Button>
        <Button 
          variant="contained" 
          className="signOutBtn" 
          onClick={onSignOut}
          sx={{ px: 4, py: 1.5, fontSize: '16px', fontWeight: 'bold' }}
        >
          Sign Out
        </Button>
      </Box>

      {/* Change Password Modal */}
      <Modal
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
        aria-labelledby="change-password-modal"
        aria-describedby="change-password-description"
      >
        <Paper sx={{ padding: 3, width: 300, margin: 'auto', mt: 10 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Change Password</Typography>
          <TextField
            label="New Password"
            variant="outlined"
            fullWidth
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button 
            variant="contained" 
            onClick={handlePasswordChange}
            sx={{ width: '100%' }}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </Box>
  );
};

export default UserProfile;
