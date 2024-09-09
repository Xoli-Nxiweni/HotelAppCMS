import { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, List, ListItem, ListItemText, Snackbar, Alert } from '@mui/material';
import { fetchCollection } from '../../Firebase/FirestoreService'; // Adjust the path as needed

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const getBookings = async () => {
      try {
        const data = await fetchCollection('bookings'); 
        setBookings(data);
      } catch (error) {
        setError('Failed to fetch bookings.');
        setSnackbarMessage('Failed to fetch bookings.', error);
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    getBookings();
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Bookings
      </Typography>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <List>
          {bookings.map((booking) => (
            <ListItem key={booking.id}>
              <ListItemText primary={booking.name} secondary={booking.date} />
            </ListItem>
          ))}
        </List>
      )}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Bookings;
