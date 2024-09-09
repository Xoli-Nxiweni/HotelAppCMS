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
} from '@mui/material';
import { fetchCollection, addDocument, updateDocument, deleteDocument } from '../../Firebase/FirestoreService'; // Ensure these are correctly imported
import { Edit, Delete } from '@mui/icons-material'; // MUI icons for CRUD operations

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // For managing modals
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  // For form data
  const [formData, setFormData] = useState({
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
  });

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

  // CRUD Operation Handlers
  const handleAdd = async () => {
    try {
      await addDocument('bookings', formData);
      setSnackbarMessage('Booking added successfully');
      setOpenAddDialog(false);
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
    } catch (error) {
      setError('Failed to delete booking.');
      setSnackbarMessage(`Error: ${error.message}`);
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError(null); // Reset error after closing snackbar
  };

  const handleOpenAddDialog = () => {
    setFormData({
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
    });
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
    setBookingToDelete(booking);
    setOpenConfirmDialog(true);
  };

  
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setBookingToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (bookingToDelete) {
      await handleDelete(bookingToDelete.id);
      handleCloseConfirmDialog();
    }
  };

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
                primary={
                  <Typography variant="h6">{`Booking for ${booking.name}`}</Typography>
                }
                secondary={
                  <>
                    {/* Display booking details */}
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
              <IconButton onClick={() => handleOpenEditDialog(booking)} color="primary">
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleOpenConfirmDialog(booking)} color="secondary">
                <Delete />
              </IconButton>
              <Divider />
            </ListItem>
          ))}
        </List>
      )}
      <Button variant="contained" color="primary" onClick={handleOpenAddDialog}>
        Add Booking
      </Button>

     {/* Add Booking Dialog */}
<Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
  <DialogTitle>Add Booking</DialogTitle>
  <DialogContent>
    <TextField
      name="name"
      label="Name"
      value={formData.name}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="room"
      label="Room"
      value={formData.room}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="heading"
      label="Heading"
      value={formData.heading}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="accommodation"
      label="Accommodation"
      value={formData.accommodation}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="checkIn"
      label="Check-In Date"
      type="date"
      value={formData.checkIn}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
      InputLabelProps={{ shrink: true }}
    />
    <TextField
      name="checkOut"
      label="Check-Out Date"
      type="date"
      value={formData.checkOut}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
      InputLabelProps={{ shrink: true }}
    />
    <TextField
      name="guests"
      label="Number of Guests"
      type="number"
      value={formData.guests}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="numRooms"
      label="Number of Rooms"
      type="number"
      value={formData.numRooms}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="price"
      label="Price"
      type="number"
      value={formData.price}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="discountedPrice"
      label="Discounted Price"
      type="number"
      value={formData.discountedPrice}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="amenities"
      label="Amenities"
      value={formData.amenities}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="specialRequests"
      label="Special Requests"
      value={formData.specialRequests}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="review"
      label="Review"
      value={formData.review}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="email"
      label="Email"
      type="email"
      value={formData.email}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="phoneNumber"
      label="Phone Number"
      type="tel"
      value={formData.phoneNumber}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="userID"
      label="User ID"
      value={formData.userID}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="view"
      label="View"
      value={formData.view}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="nonSmoking"
      label="Non-Smoking"
      type="checkbox"
      checked={formData.nonSmoking}
      onChange={handleFormChange}
      margin="normal"
    />
    <TextField
      name="isBooked"
      label="Is Booked"
      type="checkbox"
      checked={formData.isBooked}
      onChange={handleFormChange}
      margin="normal"
    />
    <TextField
      name="isFavorite"
      label="Is Favorite"
      type="checkbox"
      checked={formData.isFavorite}
      onChange={handleFormChange}
      margin="normal"
    />
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
    <TextField
      name="name"
      label="Name"
      value={formData.name}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="room"
      label="Room"
      value={formData.room}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="heading"
      label="Heading"
      value={formData.heading}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="accommodation"
      label="Accommodation"
      value={formData.accommodation}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="checkIn"
      label="Check-In Date"
      type="date"
      value={formData.checkIn}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
      InputLabelProps={{ shrink: true }}
    />
    <TextField
      name="checkOut"
      label="Check-Out Date"
      type="date"
      value={formData.checkOut}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
      InputLabelProps={{ shrink: true }}
    />
    <TextField
      name="guests"
      label="Number of Guests"
      type="number"
      value={formData.guests}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="numRooms"
      label="Number of Rooms"
      type="number"
      value={formData.numRooms}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="price"
      label="Price"
      type="number"
      value={formData.price}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="discountedPrice"
      label="Discounted Price"
      type="number"
      value={formData.discountedPrice}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="amenities"
      label="Amenities"
      value={formData.amenities}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="specialRequests"
      label="Special Requests"
      value={formData.specialRequests}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="review"
      label="Review"
      value={formData.review}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="email"
      label="Email"
      type="email"
      value={formData.email}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="phoneNumber"
      label="Phone Number"
      type="tel"
      value={formData.phoneNumber}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="userID"
      label="User ID"
      value={formData.userID}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="view"
      label="View"
      value={formData.view}
      onChange={handleFormChange}
      fullWidth
      margin="normal"
    />
    <TextField
      name="nonSmoking"
      label="Non-Smoking"
      type="checkbox"
      checked={formData.nonSmoking}
      onChange={handleFormChange}
      margin="normal"
    />
    <TextField
      name="isBooked"
      label="Is Booked"
      type="checkbox"
      checked={formData.isBooked}
      onChange={handleFormChange}
      margin="normal"
    />
    <TextField
      name="isFavorite"
      label="Is Favorite"
      type="checkbox"
      checked={formData.isFavorite}
      onChange={handleFormChange}
      margin="normal"
    />
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


      {/* Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this booking?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Feedback */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Bookings;
