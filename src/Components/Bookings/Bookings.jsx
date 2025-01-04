import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  CardActions,
  Grid,
  InputAdornment,
  Skeleton,
  Pagination,
} from '@mui/material';
import { fetchCollection, addDocument, updateDocument, deleteDocument } from '../../Firebase/FirestoreService';
import { Edit, Delete, CheckCircle, Cancel, Search, Add } from '@mui/icons-material';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'confirmed', 'pending'
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

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

  // Fetch bookings on component mount
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

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Add a new booking
  const handleAdd = async () => {
    if (!formData.name || !formData.room) {
      setSnackbarMessage('Name and Room are required.');
      setOpenSnackbar(true);
      return;
    }
    try {
      await addDocument('bookings', formData);
      setSnackbarMessage('Booking added successfully.');
      setOpenAddDialog(false);
      refreshBookings();
    } catch (error) {
      setError('Failed to add booking.');
      setSnackbarMessage(`Error: ${error.message}`);
    } finally {
      setOpenSnackbar(true);
    }
  };

  // Update an existing booking
  const handleUpdate = async () => {
    if (!currentBooking) return;
    try {
      await updateDocument('bookings', currentBooking.id, formData);
      setSnackbarMessage('Booking updated successfully.');
      setOpenEditDialog(false);
      refreshBookings();
    } catch (error) {
      setError('Failed to update booking.');
      setSnackbarMessage(`Error: ${error.message}`);
    } finally {
      setOpenSnackbar(true);
    }
  };

  // Delete a booking
  const handleDelete = async (id) => {
    try {
      await deleteDocument('bookings', id);
      setSnackbarMessage('Booking deleted successfully.');
      refreshBookings();
    } catch (error) {
      setError('Failed to delete booking.');
      setSnackbarMessage(`Error: ${error.message}`);
    } finally {
      setOpenSnackbar(true);
    }
  };

  // Confirm a booking
  const handleConfirm = async () => {
    if (!currentBooking) return;
    try {
      await updateDocument('bookings', currentBooking.id, { isBooked: true });
      setSnackbarMessage('Booking confirmed successfully.');
      refreshBookings();
    } catch (error) {
      setError('Failed to confirm booking.');
      setSnackbarMessage(`Error: ${error.message}`);
    } finally {
      setOpenSnackbar(true);
      setOpenConfirmDialog(false);
    }
  };

  // Reject a booking
  const handleReject = async () => {
    if (!currentBooking) return;
    try {
      await deleteDocument('bookings', currentBooking.id);
      setSnackbarMessage('Booking rejected and deleted successfully.');
      refreshBookings();
    } catch (error) {
      setError('Failed to reject booking.');
      setSnackbarMessage(`Error: ${error.message}`);
    } finally {
      setOpenSnackbar(true);
      setOpenRejectDialog(false);
    }
  };

  // Refresh bookings list
  const refreshBookings = async () => {
    try {
      const data = await fetchCollection('bookings');
      setBookings(data);
    } catch (error) {
      setError('Failed to refresh bookings.');
    }
  };

  // Search and filter bookings
  const filteredBookings = bookings
    .filter((booking) => {
      if (!booking) return false; // Skip undefined or null bookings
      const name = booking.name || '';
      const room = booking.room || '';
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'all' || (filter === 'confirmed' && booking.isBooked) || (filter === 'pending' && !booking.isBooked);
      return matchesSearch && matchesFilter;
    });

  // Pagination
  const paginatedBookings = filteredBookings.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Bookings
      </Typography>

      {/* Search and Filter */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant={filter === 'all' ? 'contained' : 'outlined'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'confirmed' ? 'contained' : 'outlined'}
            onClick={() => setFilter('confirmed')}
            sx={{ mx: 1 }}
          >
            Confirmed
          </Button>
          <Button
            variant={filter === 'pending' ? 'contained' : 'outlined'}
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
        </Grid>
      </Grid>

      {/* Bookings List */}
      {loading ? (
        <Skeleton variant="rectangular" height={200} />
      ) : (
        <>
          {paginatedBookings.map((booking) => (
            <Card key={booking.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{`Booking for ${booking.name || 'N/A'}`}</Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Room:</strong> {booking.room || 'N/A'} - {booking.heading || 'N/A'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Check-In:</strong> {booking.checkIn || 'N/A'} | <strong>Check-Out:</strong> {booking.checkOut || 'N/A'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Guests:</strong> {booking.guests || 'N/A'} | <strong>Rooms:</strong> {booking.numRooms || 'N/A'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Price:</strong> {booking.price || 'N/A'} | <strong>Discounted Price:</strong> {booking.discountedPrice || 'N/A'}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => {
                  setCurrentBooking(booking);
                  setFormData(booking);
                  setOpenEditDialog(true);
                }}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(booking.id)}>
                  <Delete />
                </IconButton>
                {!booking.isBooked && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CheckCircle />}
                      onClick={() => {
                        setCurrentBooking(booking);
                        setOpenConfirmDialog(true);
                      }}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<Cancel />}
                      onClick={() => {
                        setCurrentBooking(booking);
                        setOpenRejectDialog(true);
                      }}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </CardActions>
            </Card>
          ))}

          {/* Pagination */}
          <Pagination
            count={Math.ceil(filteredBookings.length / itemsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
          />
        </>
      )}


      {/* Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={error ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Add Booking Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add Booking</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Room"
            name="room"
            value={formData.room}
            onChange={handleFormChange}
            sx={{ mt: 2 }}
          />
          {/* Add other fields as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Room"
            name="room"
            value={formData.room}
            onChange={handleFormChange}
            sx={{ mt: 2 }}
          />
          {/* Add other fields as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Booking Dialog */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to confirm this booking?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Reject Booking Dialog */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)}>
        <DialogTitle>Reject Booking</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to reject this booking?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
          <Button onClick={handleReject}>Reject</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Bookings;