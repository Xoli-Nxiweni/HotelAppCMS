import { useState, useEffect } from 'react';
import { addDoc, collection, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase';
import { fetchCollection } from '../../Firebase/FirestoreService';
import {
  Button,
  TextField,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Box,
  Divider,
  Checkbox,
  FormControlLabel,
  Pagination,
} from '@mui/material';
import { Edit, Delete, Add, Visibility } from '@mui/icons-material';

const initialAccommodationState = {
  heading: '',
  description: '',
  discountedPrice: '',
  size: '',
  beds: '',
  bathrooms: '',
  amenities: [],
  checkIn: '',
  checkOut: '',
  guests: '',
  nonSmoking: false,
  reviews: '',
  view: '',
  nights: '',
  isFavorite: false,
  isBooked: false,
  image: '',
};

const AccommodationManagement = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [newAccommodation, setNewAccommodation] = useState(initialAccommodationState);
  const [editAccommodation, setEditAccommodation] = useState(initialAccommodationState);
  const [viewAccommodation, setViewAccommodation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [amenityInput, setAmenityInput] = useState('');
  const [dialogOpen, setDialogOpen] = useState({ add: false, edit: false, view: false });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  // Fetch accommodations on component mount
  useEffect(() => {
    const fetchAccommodations = async () => {
      setLoading(true);
      try {
        const data = await fetchCollection('hotelRooms');
        setAccommodations(data);
      } catch (error) {
        showSnackbar('Error fetching accommodations: ' + error.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAccommodations();
  }, []);

  // Handle input changes
  const handleChange = (e, setter) => {
    const { name, value, type, checked } = e.target;
    setter((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Handle adding a new accommodation
  const handleAdd = async () => {
    if (!newAccommodation.heading || !newAccommodation.discountedPrice) {
      showSnackbar('Heading and discounted price are required!', 'error');
      return;
    }
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'hotelRooms'), newAccommodation);
      setAccommodations([...accommodations, { ...newAccommodation, id: docRef.id }]);
      setNewAccommodation(initialAccommodationState);
      setDialogOpen({ ...dialogOpen, add: false });
      showSnackbar('Accommodation added successfully!', 'success');
    } catch (error) {
      showSnackbar('Error adding accommodation: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle updating an accommodation
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'hotelRooms', editAccommodation.id);
      await updateDoc(docRef, editAccommodation);
      setAccommodations(accommodations.map((acc) =>
        acc.id === editAccommodation.id ? editAccommodation : acc
      ));
      setEditAccommodation(initialAccommodationState);
      setDialogOpen({ ...dialogOpen, edit: false });
      showSnackbar('Accommodation updated successfully!', 'success');
    } catch (error) {
      showSnackbar('Error updating accommodation: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting an accommodation
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'hotelRooms', id));
      setAccommodations(accommodations.filter((acc) => acc.id !== id));
      showSnackbar('Accommodation deleted successfully!', 'success');
    } catch (error) {
      showSnackbar('Error deleting accommodation: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Add an amenity to the new accommodation
  const addAmenity = () => {
    if (amenityInput.trim()) {
      setNewAccommodation((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()],
      }));
      setAmenityInput('');
    }
  };

  // Show snackbar notification
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Pagination logic
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedAccommodations = accommodations.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Paper elevation={0} sx={{ p: 3, backgroundColor: 'transparent' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
          Accommodation Management
        </Typography>
        <Button
          variant="contained"
          onClick={() => setDialogOpen({ ...dialogOpen, add: true })}
          startIcon={<Add />}
          sx={{
            backgroundColor: 'coral',
            '&:hover': {
              backgroundColor: '#ff7f50',
            },
          }}
        >
          Add Accommodation
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      {loading && <Typography>Loading...</Typography>}

      <Paper elevation={1} sx={{ backgroundColor: '#fff' }}>
        <List>
          {paginatedAccommodations.map((accommodation) => (
            <ListItem
              key={accommodation.id}
              sx={{
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
                borderBottom: '1px solid #eee',
              }}
            >
              <ListItemText
                primary={accommodation.heading}
                secondary={`Price: R${accommodation.discountedPrice} | Size: ${accommodation.size} m²`}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: '#333',
                    fontWeight: 500,
                  },
                }}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => { setEditAccommodation(accommodation); setDialogOpen({ ...dialogOpen, edit: true }); }}
                  sx={{ color: 'coral', mr: 1 }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDelete(accommodation.id)}
                  sx={{ color: '#666' }}
                >
                  <Delete />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => { setViewAccommodation(accommodation); setDialogOpen({ ...dialogOpen, view: true }); }}
                  sx={{ color: '#333' }}
                >
                  <Visibility /> {/* Use the eye icon for viewing */}
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(accommodations.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Paper>

      {/* Add Accommodation Dialog */}
      <Dialog open={dialogOpen.add} onClose={() => setDialogOpen({ ...dialogOpen, add: false })}>
        <DialogTitle>Add Accommodation</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Heading"
            name="heading"
            value={newAccommodation.heading}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={newAccommodation.description}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Discounted Price"
            name="discountedPrice"
            value={newAccommodation.discountedPrice}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Size (m²)"
            name="size"
            value={newAccommodation.size}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Beds"
            name="beds"
            value={newAccommodation.beds}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Bathrooms"
            name="bathrooms"
            value={newAccommodation.bathrooms}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Image URL"
            name="image"
            value={newAccommodation.image}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            sx={{ mt: 2 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="nonSmoking"
                checked={newAccommodation.nonSmoking}
                onChange={(e) => handleChange(e, setNewAccommodation)}
              />
            }
            label="Non-Smoking"
            sx={{ mt: 2 }}
          />
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Amenity"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
            />
            <Button onClick={addAmenity} sx={{ mt: 1 }}>Add Amenity</Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen({ ...dialogOpen, add: false })}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Accommodation Dialog */}
      <Dialog open={dialogOpen.edit} onClose={() => setDialogOpen({ ...dialogOpen, edit: false })}>
        <DialogTitle>Edit Accommodation</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Heading"
            name="heading"
            value={editAccommodation.heading}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={editAccommodation.description}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Discounted Price"
            name="discountedPrice"
            value={editAccommodation.discountedPrice}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Size (m²)"
            name="size"
            value={editAccommodation.size}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Beds"
            name="beds"
            value={editAccommodation.beds}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Bathrooms"
            name="bathrooms"
            value={editAccommodation.bathrooms}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Image URL"
            name="image"
            value={editAccommodation.image}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            sx={{ mt: 2 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="nonSmoking"
                checked={editAccommodation.nonSmoking}
                onChange={(e) => handleChange(e, setEditAccommodation)}
              />
            }
            label="Non-Smoking"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen({ ...dialogOpen, edit: false })}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* View Accommodation Dialog */}
      <Dialog open={dialogOpen.view} onClose={() => setDialogOpen({ ...dialogOpen, view: false })}>
        <DialogTitle>{viewAccommodation?.heading}</DialogTitle>
        <DialogContent>
          <img src={viewAccommodation?.image} alt={viewAccommodation?.heading} style={{ width: '100%' }} />
          <Typography>{viewAccommodation?.description}</Typography>
          <Typography>Price: R{viewAccommodation?.discountedPrice}</Typography>
          <Typography>Size: {viewAccommodation?.size} m²</Typography>
          <Typography>Beds: {viewAccommodation?.beds}</Typography>
          <Typography>Bathrooms: {viewAccommodation?.bathrooms}</Typography>
          <Typography>Guests: {viewAccommodation?.guests}</Typography>
          <Typography>Check-In: {viewAccommodation?.checkIn}</Typography>
          <Typography>Check-Out: {viewAccommodation?.checkOut}</Typography>
          <Typography>Amenities: {viewAccommodation?.amenities.join(', ')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen({ ...dialogOpen, view: false })}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AccommodationManagement;