import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  Button,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { fetchCollection, addDocument, updateDocument, deleteDocument } from '../../Firebase/FirestoreService';
import { Edit, Delete } from '@mui/icons-material';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

  // Form data state
  const [formData, setFormData] = useState(initialFormData());

  useEffect(() => {
    const getBookings = async () => {
      try {
        const data = await fetchCollection('bookings');
        setBookings(data);
      } catch (error) {
        setError('Failed to fetch bookings.');
        setSnackbarMessage(`Error: ${error.message}`);
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };
    getBookings();
  }, []);

  // Initial form data
  function initialFormData() {
    return {
      name: '',
      room: '',
      heading: '',
      accommodation: '',
      checkIn: '',
      checkOut: '',
      guests: '',
      numRooms: '',
      price: '',
      discountedPrice: '',
      amenities: '',
      specialRequests: '',
      review: '',
      email: '',
      phoneNumber: '',
      userID: '',
      view: '',
      nonSmoking: false,
      isBooked: false,
      isFavorite: false,
    };
  }

  // CRUD Operation Handlers
  const handleAdd = async () => {
    try {
      await addDocument('bookings', formData);
      setSnackbarMessage('Booking added successfully');
      setOpenAddDialog(false);
      refreshBookings(); // Refresh list after adding
    } catch (error) {
      setError('Failed to add booking.');
      setSnackbarMessage(`Error: ${error.message}`);
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleUpdate = async () => {
    try {
      if (currentBooking) {
        await updateDocument('bookings', currentBooking.id, formData);
        setSnackbarMessage('Booking updated successfully');
        setOpenEditDialog(false);
        refreshBookings(); // Refresh list after editing
      }
    } catch (error) {
      setError('Failed to update booking.');
      setSnackbarMessage(`Error: ${error.message}`);
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocument('bookings', id);
      setSnackbarMessage('Booking deleted successfully');
      refreshBookings(); // Refresh list after deleting
    } catch (error) {
      setError('Failed to delete booking.');
      setSnackbarMessage(`Error: ${error.message}`);
    } finally {
      setOpenSnackbar(true);
    }
  };

  const refreshBookings = async () => {
    try {
      const data = await fetchCollection('bookings');
      setBookings(data);
    } catch (error) {
      setError('Failed to refresh bookings.');
    }
  };

  // Confirm booking handler
  const handleConfirm = async () => {
    if (currentBooking) {
      try {
        await updateDocument('bookings', currentBooking.id, { isBooked: true });
        setSnackbarMessage('Booking confirmed successfully');
        refreshBookings();
      } catch (error) {
        setError('Failed to confirm booking.');
        setSnackbarMessage(`Error: ${error.message}`);
      } finally {
        setOpenSnackbar(true);
        setOpenConfirmDialog(false);
      }
    }
  };

  // Reject booking handler
  const handleReject = async () => {
    if (currentBooking) {
      try {
        await deleteDocument('bookings', currentBooking.id);
        setSnackbarMessage('Booking rejected and deleted successfully');
        refreshBookings();
      } catch (error) {
        setError('Failed to reject booking.');
        setSnackbarMessage(`Error: ${error.message}`);
      } finally {
        setOpenSnackbar(true);
        setOpenRejectDialog(false);
      }
    }
  };

  // Dialog handling functions
  const handleOpenAddDialog = () => {
    setFormData(initialFormData());
    setOpenAddDialog(true);
  };

  const handleOpenEditDialog = (booking) => {
    setCurrentBooking(booking);
    setFormData({
      name: booking.name || '',
      room: booking.room || '',
      heading: booking.heading || '',
      accommodation: booking.accommodation || '',
      checkIn: booking.checkIn || '',
      checkOut: booking.checkOut || '',
      guests: booking.guests || '',
      numRooms: booking.numRooms || '',
      price: booking.price || '',
      discountedPrice: booking.discountedPrice || '',
      amenities: booking.amenities?.join(', ') || '',
      specialRequests: booking.specialRequests || '',
      review: booking.review || '',
      email: booking.email || '',
      phoneNumber: booking.phoneNumber || '',
      userID: booking.userID || '',
      view: booking.view || '',
      nonSmoking: booking.nonSmoking || false,
      isBooked: booking.isBooked || false,
      isFavorite: booking.isFavorite || false,
    });
    setOpenEditDialog(true);
  };

  const handleOpenConfirmDialog = (booking) => {
    setCurrentBooking(booking);
    setOpenConfirmDialog(true);
  };

  const handleOpenRejectDialog = (booking) => {
    setCurrentBooking(booking);
    setOpenRejectDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
  };

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError(null);
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
            <ListItem key={booking.id} alignItems="flex-start">
              <ListItemText
                primary={<Typography variant="h6">{`Booking for ${booking.name}`}</Typography>}
                secondary={
                  <>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Room:</strong> {booking.room} - {booking.heading}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Accommodation:</strong> {booking.accommodation?.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Check-In:</strong> {booking.checkIn} | <strong>Check-Out:</strong> {booking.checkOut}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Guests:</strong> {booking.guests} | <strong>Rooms:</strong> {booking.numRooms}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Price:</strong> {booking.price} | <strong>Discounted Price:</strong> {booking.discountedPrice}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Amenities:</strong> {booking.amenities?.join(', ')}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Special Requests:</strong> {booking.specialRequests}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Review:</strong> {booking.review}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Email:</strong> {booking.email} | <strong>Phone:</strong> {booking.phoneNumber}
                    </Typography>
                  </>
                }
              />
              <IconButton onClick={() => handleOpenEditDialog(booking)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDelete(booking.id)}>
                <Delete />
              </IconButton>
              {/* Confirm and Reject Buttons */}
              {!booking.isBooked && (
                <>
                  <Button variant="contained" color="primary" onClick={() => handleOpenConfirmDialog(booking)}>
                    Confirm
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleOpenRejectDialog(booking)}>
                    Reject
                  </Button>
                </>
              )}
            </ListItem>
          ))}
        </List>
      )}
      <Button variant="contained" color="primary" onClick={handleOpenAddDialog}>
        Add Booking
      </Button>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {/* Add Booking Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add Booking</DialogTitle>
        <DialogContent>
          <TextField name="name" value={formData.name} onChange={handleFormChange} label="Name" fullWidth />
          <TextField name="room" value={formData.room} onChange={handleFormChange} label="Room" fullWidth />
          {/* Add other fields similar to the example */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit Booking Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <TextField name="name" value={formData.name} onChange={handleFormChange} label="Name" fullWidth />
          <TextField name="room" value={formData.room} onChange={handleFormChange} label="Room" fullWidth />
          {/* Add other fields similar to the example */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirm Booking Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to confirm this booking?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* Reject Booking Dialog */}
      <Dialog open={openRejectDialog} onClose={handleCloseRejectDialog}>
        <DialogTitle>Reject Booking</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to reject this booking?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReject} color="secondary">
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Bookings;
