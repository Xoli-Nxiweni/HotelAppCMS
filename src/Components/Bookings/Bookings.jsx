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
    } catch (error) {
      setError('Failed to add booking.');
      setSnackbarMessage(`Error: ${error.message}`);
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleOpenConfirmDialog = (booking) => {
    setCurrentBooking(booking);
    setOpenConfirmDialog(true);
  };

  const handleOpenRejectDialog = (booking) => {
    setCurrentBooking(booking);
    setOpenRejectDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
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
    setError(null);
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

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleConfirm = async () => {
    if (currentBooking) {
      try {
        await updateDocument('bookings', currentBooking.id, { isBooked: true });
        setSnackbarMessage('Booking confirmed successfully');
      } catch (error) {
        setError('Failed to confirm booking.');
        setSnackbarMessage(`Error: ${error.message}`);
      } finally {
        setOpenSnackbar(true);
        handleCloseConfirmDialog();
      }
    }
  };

  const handleReject = async () => {
    if (currentBooking) {
      try {
        await deleteDocument('bookings', currentBooking.id);
        setSnackbarMessage('Booking rejected and deleted successfully');
      } catch (error) {
        setError('Failed to reject booking.');
        setSnackbarMessage(`Error: ${error.message}`);
      } finally {
        setOpenSnackbar(true);
        handleCloseRejectDialog();
      }
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
              <IconButton onClick={() => handleOpenConfirmDialog(booking)}>
                <Button variant="outlined" color="success">Confirm</Button>
              </IconButton>
              <IconButton onClick={() => handleOpenEditDialog(booking)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleOpenRejectDialog(booking)}>
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
      <Divider />
      <Button onClick={handleOpenAddDialog} variant="contained" color="primary" style={{ marginTop: '16px' }}>
        Add Booking
      </Button>

      {/* Snackbar for error/success messages */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Add Booking Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add Booking</DialogTitle>
        <DialogContent>
          <TextField label="Name" name="name" fullWidth value={formData.name} onChange={handleFormChange} />
          <TextField label="Room" name="room" fullWidth value={formData.room} onChange={handleFormChange} />
          <TextField label="Heading" name="heading" fullWidth value={formData.heading} onChange={handleFormChange} />
          <TextField label="Accommodation" name="accommodation" fullWidth value={formData.accommodation} onChange={handleFormChange} />
          <TextField label="Check-In" name="checkIn" type="date" fullWidth value={formData.checkIn} onChange={handleFormChange} />
          <TextField label="Check-Out" name="checkOut" type="date" fullWidth value={formData.checkOut} onChange={handleFormChange} />
          <TextField label="Guests" name="guests" type="number" fullWidth value={formData.guests} onChange={handleFormChange} />
          <TextField label="Number of Rooms" name="numRooms" type="number" fullWidth value={formData.numRooms} onChange={handleFormChange} />
          <TextField label="Price" name="price" type="number" fullWidth value={formData.price} onChange={handleFormChange} />
          <TextField label="Discounted Price" name="discountedPrice" type="number" fullWidth value={formData.discountedPrice} onChange={handleFormChange} />
          <TextField label="Amenities" name="amenities" fullWidth value={formData.amenities} onChange={handleFormChange} />
          <TextField label="Special Requests" name="specialRequests" fullWidth value={formData.specialRequests} onChange={handleFormChange} />
          <TextField label="Review" name="review" fullWidth value={formData.review} onChange={handleFormChange} />
          <TextField label="Email" name="email" fullWidth value={formData.email} onChange={handleFormChange} />
          <TextField label="Phone Number" name="phoneNumber" fullWidth value={formData.phoneNumber} onChange={handleFormChange} />
          <TextField label="User ID" name="userID" fullWidth value={formData.userID} onChange={handleFormChange} />
          <TextField label="View" name="view" fullWidth value={formData.view} onChange={handleFormChange} />
          <FormControlLabel
            control={<Checkbox checked={formData.nonSmoking} onChange={handleFormChange} name="nonSmoking" />}
            label="Non-Smoking"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="secondary">Cancel</Button>
          <Button onClick={handleAdd} color="primary">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Booking Dialog */}
<Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
  <DialogTitle>Edit Booking</DialogTitle>
  <DialogContent>
    <TextField label="Name" name="name" fullWidth value={formData.name} onChange={handleFormChange} />
    <TextField label="Room" name="room" fullWidth value={formData.room} onChange={handleFormChange} />
    <TextField label="Heading" name="heading" fullWidth value={formData.heading} onChange={handleFormChange} />
    <TextField label="Accommodation" name="accommodation" fullWidth value={formData.accommodation} onChange={handleFormChange} />
    <TextField label="Check-In" name="checkIn" type="date" fullWidth value={formData.checkIn} onChange={handleFormChange} />
    <TextField label="Check-Out" name="checkOut" type="date" fullWidth value={formData.checkOut} onChange={handleFormChange} />
    <TextField label="Guests" name="guests" type="number" fullWidth value={formData.guests} onChange={handleFormChange} />
    <TextField label="Number of Rooms" name="numRooms" type="number" fullWidth value={formData.numRooms} onChange={handleFormChange} />
    <TextField label="Price" name="price" type="number" fullWidth value={formData.price} onChange={handleFormChange} />
    <TextField label="Discounted Price" name="discountedPrice" type="number" fullWidth value={formData.discountedPrice} onChange={handleFormChange} />
    <TextField label="Amenities" name="amenities" fullWidth value={formData.amenities} onChange={handleFormChange} />
    <TextField label="Special Requests" name="specialRequests" fullWidth value={formData.specialRequests} onChange={handleFormChange} />
    <TextField label="Review" name="review" fullWidth value={formData.review} onChange={handleFormChange} />
    <TextField label="Email" name="email" fullWidth value={formData.email} onChange={handleFormChange} />
    <TextField label="Phone Number" name="phoneNumber" fullWidth value={formData.phoneNumber} onChange={handleFormChange} />
    <TextField label="User ID" name="userID" fullWidth value={formData.userID} onChange={handleFormChange} />
    <TextField label="View" name="view" fullWidth value={formData.view} onChange={handleFormChange} />
    <FormControlLabel
      control={<Checkbox checked={formData.nonSmoking} onChange={handleFormChange} name="nonSmoking" />}
      label="Non-Smoking"
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseEditDialog} color="secondary">Cancel</Button>
    <Button onClick={handleUpdate} color="primary">Update</Button>
  </DialogActions>
</Dialog>

      {/* Confirm Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
  <DialogTitle>Confirm Booking</DialogTitle>
  <DialogContent>
    <Typography>Are you sure you want to confirm this booking?</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseConfirmDialog} color="secondary">Cancel</Button>
    <Button onClick={handleConfirm} color="primary">Confirm</Button>
    <Button onClick={handleReject} color="error">Decline</Button>
  </DialogActions>
</Dialog>

      {/* Reject Dialog */}
      <Dialog open={openRejectDialog} onClose={handleCloseRejectDialog}>
        <DialogTitle>Reject Booking</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to reject this booking?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog} color="secondary">Cancel</Button>
          <Button onClick={handleReject} color="primary">Reject</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Bookings;
