import { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  List,
  ListItem,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Chip,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { addDoc, collection, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase';
import { fetchCollection } from '../../Firebase/FirestoreService';

// Initial state for an accommodation
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
  image: '', // For image URL
};

const AccommodationManagement = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [newAccommodation, setNewAccommodation] = useState(initialAccommodationState);
  const [editAccommodation, setEditAccommodation] = useState(initialAccommodationState);
  const [viewAccommodation, setViewAccommodation] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [amenityInput, setAmenityInput] = useState('');

  useEffect(() => {
    const fetchAccommodations = async () => {
      setLoading(true);
      try {
        const data = await fetchCollection('hotelRooms');
        setAccommodations(data);
      } catch (error) {
        showSnackbar('Error fetching accommodations:', 'error', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccommodations();
  }, []);

  const handleChange = (e, setter) => {
    const { name, value, type, checked } = e.target;
    setter((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAdd = async () => {
    if (!newAccommodation.heading || !newAccommodation.discountedPrice) {
      showSnackbar('Heading and discountedPrice are required!', 'error');
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'hotelRooms'), newAccommodation);
      setAccommodations((prev) => [...prev, { ...newAccommodation, id: docRef.id }]);
      setNewAccommodation(initialAccommodationState);
      setOpenAddDialog(false);
      showSnackbar('Accommodation added successfully!');
    } catch (error) {
      showSnackbar(`Error adding accommodation: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editAccommodation.heading || !editAccommodation.discountedPrice) {
      showSnackbar('Heading and discountedPrice are required!', 'error');
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, 'hotelRooms', editAccommodation.id);
      await updateDoc(docRef, {
        heading: editAccommodation.heading,
        discountedPrice: editAccommodation.discountedPrice,
        description: editAccommodation.description,
        size: editAccommodation.size,
        beds: editAccommodation.beds,
        bathrooms: editAccommodation.bathrooms,
        amenities: editAccommodation.amenities,
        checkIn: editAccommodation.checkIn,
        checkOut: editAccommodation.checkOut,
        guests: editAccommodation.guests,
        nonSmoking: editAccommodation.nonSmoking,
        reviews: editAccommodation.reviews,
        view: editAccommodation.view,
        nights: editAccommodation.nights,
        isFavorite: editAccommodation.isFavorite,
        isBooked: editAccommodation.isBooked,
        image: editAccommodation.image,
      });

      setAccommodations((prev) =>
        prev.map((acc) =>
          acc.id === editAccommodation.id ? editAccommodation : acc
        )
      );

      setEditAccommodation(initialAccommodationState);
      setOpenEditDialog(false);
      showSnackbar('Accommodation updated successfully!');
    } catch (error) {
      showSnackbar(`Error updating accommodation: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, 'hotelRooms', itemToDelete.id));
      setAccommodations((prev) => prev.filter((acc) => acc.id !== itemToDelete.id));
      setOpenConfirmDialog(false);
      showSnackbar('Accommodation deleted successfully!');
    } catch (error) {
      showSnackbar(`Error deleting accommodation: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleAmenityChange = (e) => {
    setAmenityInput(e.target.value);
  };

  const addAmenity = () => {
    if (amenityInput.trim() !== '') {
      setNewAccommodation((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()],
      }));
      setAmenityInput('');
    }
  };

  const removeAmenity = (index, setter) => {
    setter((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      <Button
        onClick={() => setOpenAddDialog(true)}
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        aria-label="Add Accommodation"
      >
        Add Accommodation
      </Button>

      {loading && <CircularProgress />}

      {/* Accommodation List */}
      <List>
        {accommodations.map((accommodation) => (
          <ListItem key={accommodation.id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{accommodation.heading}</Typography>
                <Typography variant="body1">
                  <img src={accommodation.image} alt={accommodation.heading} style={{ width: '100%', height: 'auto' }} />
                </Typography>
                <Typography variant="subtitle1">
                  Price: ${accommodation.discountedPrice}
                </Typography>
                <Typography variant="body2">
                  {accommodation.description}
                </Typography>
                
                <IconButton
                  onClick={() => {
                    setEditAccommodation(accommodation);
                    setOpenEditDialog(true);
                  }}
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setViewAccommodation(accommodation);
                    setOpenViewDialog(true);
                  }}
                  aria-label="view"
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setItemToDelete(accommodation);
                    setOpenConfirmDialog(true);
                  }}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>

      {/* Add Accommodation Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Accommodation</DialogTitle>
        <DialogContent>
          <TextField
            label="Heading"
            name="heading"
            value={newAccommodation.heading}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={newAccommodation.description}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Discounted Price"
            name="discountedPrice"
            value={newAccommodation.discountedPrice}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            label="Size"
            name="size"
            value={newAccommodation.size}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Beds"
            name="beds"
            value={newAccommodation.beds}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Bathrooms"
            name="bathrooms"
            value={newAccommodation.bathrooms}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Check-In Time"
            name="checkIn"
            value={newAccommodation.checkIn}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
            type="time"
          />
          <TextField
            label="Check-Out Time"
            name="checkOut"
            value={newAccommodation.checkOut}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
            type="time"
          />
          <TextField
            label="Guests"
            name="guests"
            value={newAccommodation.guests}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Reviews"
            name="reviews"
            value={newAccommodation.reviews}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="View"
            name="view"
            value={newAccommodation.view}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nights"
            name="nights"
            value={newAccommodation.nights}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Image URL"
            name="image"
            value={newAccommodation.image}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newAccommodation.nonSmoking}
                onChange={(e) => handleChange(e, setNewAccommodation)}
                name="nonSmoking"
              />
            }
            label="Non-Smoking"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newAccommodation.isFavorite}
                onChange={(e) => handleChange(e, setNewAccommodation)}
                name="isFavorite"
              />
            }
            label="Favorite"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newAccommodation.isBooked}
                onChange={(e) => handleChange(e, setNewAccommodation)}
                name="isBooked"
              />
            }
            label="Booked"
          />
          <TextField
            label="Amenity"
            value={amenityInput}
            onChange={handleAmenityChange}
            fullWidth
            margin="normal"
          />
          <Button
            onClick={addAmenity}
            variant="contained"
            color="primary"
          >
            Add Amenity
          </Button>
          <Box mt={2}>
            {newAccommodation.amenities.map((amenity, index) => (
              <Chip
                key={index}
                label={amenity}
                onDelete={() => removeAmenity(index, setNewAccommodation)}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary" variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Accommodation Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Accommodation</DialogTitle>
        <DialogContent>
          <TextField
            label="Heading"
            name="heading"
            value={editAccommodation.heading}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={editAccommodation.description}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Discounted Price"
            name="discountedPrice"
            value={editAccommodation.discountedPrice}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            label="Size"
            name="size"
            value={editAccommodation.size}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Beds"
            name="beds"
            value={editAccommodation.beds}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Bathrooms"
            name="bathrooms"
            value={editAccommodation.bathrooms}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Check-In Date"
            name="checkIn"
            value={editAccommodation.checkIn}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
            type="date"
          />
          <TextField
            label="Check-Out Date"
            name="checkOut"
            value={editAccommodation.checkOut}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
            type="date"
          />
          <TextField
            label="Guests"
            name="guests"
            value={editAccommodation.guests}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Reviews"
            name="reviews"
            value={editAccommodation.reviews}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="View"
            name="view"
            value={editAccommodation.view}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nights"
            name="nights"
            value={editAccommodation.nights}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Image URL"
            name="image"
            value={editAccommodation.image}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={editAccommodation.nonSmoking}
                onChange={(e) => handleChange(e, setEditAccommodation)}
                name="nonSmoking"
              />
            }
            label="Non-Smoking"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={editAccommodation.isFavorite}
                onChange={(e) => handleChange(e, setEditAccommodation)}
                name="isFavorite"
              />
            }
            label="Favorite"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={editAccommodation.isBooked}
                onChange={(e) => handleChange(e, setEditAccommodation)}
                name="isBooked"
              />
            }
            label="Booked"
          />
          <Box mt={2}>
            {editAccommodation.amenities.map((amenity, index) => (
              <Chip
                key={index}
                label={amenity}
                onDelete={() => removeAmenity(index, setEditAccommodation)}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

{/* View Accommodation Dialog */}
<Dialog
  open={openViewDialog}
  onClose={() => setOpenViewDialog(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>View Accommodation</DialogTitle>
  <DialogContent>
    {viewAccommodation && (
      <>
        <Typography variant="h5">{viewAccommodation.heading}</Typography>
        <img src={viewAccommodation.image} alt={viewAccommodation.heading} style={{ width: '100%', height: 'auto' }} />
        <Typography variant="subtitle1">
          Price: ${viewAccommodation.discountedPrice}
        </Typography>
        <Typography variant="body1">
          Description: {viewAccommodation.description}
        </Typography>
        <Typography variant="body1">
          Size: {viewAccommodation.size} sq ft
        </Typography>
        <Typography variant="body1">
          Beds: {viewAccommodation.beds}
        </Typography>
        <Typography variant="body1">
          Bathrooms: {viewAccommodation.bathrooms}
        </Typography>
        <Typography variant="body1">
          Check-In Time: {viewAccommodation.checkIn}
        </Typography>
        <Typography variant="body1">
          Check-Out Time: {viewAccommodation.checkOut}
        </Typography>
        <Typography variant="body1">
          Guests: {viewAccommodation.guests}
        </Typography>
        <Typography variant="body1">
          Reviews: {viewAccommodation.reviews}
        </Typography>
        <Typography variant="body1">
          View: {viewAccommodation.view}
        </Typography>
        <Typography variant="body1">
          Nights: {viewAccommodation.nights}
        </Typography>
        <Typography variant="body1">
          Non-Smoking: {viewAccommodation.nonSmoking ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body1">
          Favorite: {viewAccommodation.isFavorite ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body1">
          Booked: {viewAccommodation.isBooked ? 'Yes' : 'No'}
        </Typography>
        <Box mt={2}>
          <Typography variant="h6">Amenities:</Typography>
          {viewAccommodation.amenities.length > 0 ? (
            <ul>
              {viewAccommodation.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          ) : (
            <Typography>No amenities listed</Typography>
          )}
        </Box>
      </>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenViewDialog(false)} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>


      {/* Confirm Delete Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this accommodation?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AccommodationManagement;
