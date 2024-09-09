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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { addDoc, collection, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { fetchCollection } from '../../Firebase/FirestoreService';

// Initial state for an accommodation
const initialAccommodationState = {
  heading: '',
  description: '',
  discountedPrice: '',
  size: '',
  beds: '',
  bathrooms: '',
  amenities: '',
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
      setAccommodations(prev => [...prev, { ...newAccommodation, id: docRef.id }]);
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
      // Ensure the document ID is correct
      const docRef = doc(db, 'hotelRooms', editAccommodation.id);
      await updateDoc(docRef, {
        heading: editAccommodation.heading,
        discountedPrice: editAccommodation.discountedPrice,
        // Include any other fields you need to update
      });
  
      // Update local state
      setAccommodations(prev =>
        prev.map(acc =>
          acc.id === editAccommodation.id
            ? { ...acc, heading: editAccommodation.heading, discountedPrice: editAccommodation.discountedPrice }
            : acc
        )
      );
  
      // Reset state and close dialog
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
      setAccommodations(prev => prev.filter(acc => acc.id !== itemToDelete.id));
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

      {/* Add Accommodation Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Accommodation</DialogTitle>
        <DialogContent>
          <TextField
            name="heading"
            label="Heading"
            value={newAccommodation.heading}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            name="description"
            label="Description"
            value={newAccommodation.description}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            name="discountedPrice"
            label="discountedPrice"
            value={newAccommodation.discountedPrice}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            name="size"
            label="Size"
            value={newAccommodation.size}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            name="beds"
            label="Beds"
            value={newAccommodation.beds}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            name="bathrooms"
            label="Bathrooms"
            value={newAccommodation.bathrooms}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            name="checkIn"
            label="Check-In Date"
            value={newAccommodation.checkIn}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="checkOut"
            label="Check-Out Date"
            value={newAccommodation.checkOut}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="guests"
            label="Guests"
            value={newAccommodation.guests}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            name="amenities"
            label="Amenities"
            value={newAccommodation.amenities}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />

          <TextField
            name="reviews"
            label="Reviews"
            value={newAccommodation.reviews}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            name="view"
            label="View"
            value={newAccommodation.view}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            name="nights"
            label="Nights"
            value={newAccommodation.nights}
            onChange={(e) => handleChange(e, setNewAccommodation)}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            name="image"
            label="Image URL"
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
            label="Non-smoking"
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Accommodation Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Accommodation</DialogTitle>
        <DialogContent>
          <TextField
            name="heading"
            label="Heading"
            value={editAccommodation.heading}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            name="description"
            label="Description"
            value={editAccommodation.description}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            name="discountedPrice"
            label="discountedPrice"
            value={editAccommodation.discountedPrice}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            name="size"
            label="Size"
            value={editAccommodation.size}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            name="beds"
            label="Beds"
            value={editAccommodation.beds}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            name="bathrooms"
            label="Bathrooms"
            value={editAccommodation.bathrooms}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            name="checkIn"
            label="Check-In Date"
            value={editAccommodation.checkIn}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="checkOut"
            label="Check-Out Date"
            value={editAccommodation.checkOut}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="guests"
            label="Guests"
            value={editAccommodation.guests}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            name="amenities"
            label="Amenities"
            value={editAccommodation.amenities}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />

          <TextField
            name="reviews"
            label="Reviews"
            value={editAccommodation.reviews}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            name="view"
            label="View"
            value={editAccommodation.view}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
          />
          <TextField
            name="nights"
            label="Nights"
            value={editAccommodation.nights}
            onChange={(e) => handleChange(e, setEditAccommodation)}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            name="image"
            label="Image URL"
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
            label="Non-smoking"
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Accommodation Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>View Accommodation</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{viewAccommodation?.heading}</Typography>
          <Typography>{viewAccommodation?.description}</Typography>
          <Typography>discountedPrice: {viewAccommodation?.discountedPrice}</Typography>
          <Typography>Size: {viewAccommodation?.size}</Typography>
          <Typography>Beds: {viewAccommodation?.beds}</Typography>
          <Typography>Bathrooms: {viewAccommodation?.bathrooms}</Typography>
          <Typography>Check-In: {viewAccommodation?.checkIn}</Typography>
          <Typography>Check-Out: {viewAccommodation?.checkOut}</Typography>
          <Typography>Guests: {viewAccommodation?.guests}</Typography>
          <Typography>Amenities: {viewAccommodation?.amenities}</Typography>
          <Typography>Reviews: {viewAccommodation?.reviews}</Typography>
          <Typography>View: {viewAccommodation?.view}</Typography>
          <Typography>Nights: {viewAccommodation?.nights}</Typography>
          {viewAccommodation?.image && (
            <img
              src={viewAccommodation?.image}
              alt="Accommodation"
              style={{ width: '100%', height: 'auto' }}
            />
          )}
          <Typography>Non-Smoking: {viewAccommodation?.nonSmoking ? 'Yes' : 'No'}</Typography>
          <Typography>Favorite: {viewAccommodation?.isFavorite ? 'Yes' : 'No'}</Typography>
          <Typography>Booked: {viewAccommodation?.isBooked ? 'Yes' : 'No'}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this accommodation?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarMessage.includes('Error') ? 'error' : 'success'}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Accommodation List */}
      <List>
        {accommodations.map((acc) => (
          <ListItem key={acc.id} divider>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{acc.heading}</Typography>
                <Typography>discountedPrice: {acc.discountedPrice}</Typography>
                {/* Add other fields to display */}
                {acc.image && (
                  <img
                    src={acc.image}
                    alt="Accommodation"
                    style={{ width: '100%', height: 'auto' }}
                  />
                )}
                <Typography>Amenities: {acc.amenities}</Typography>

                <IconButton
                  onClick={() => {
                    setEditAccommodation(acc);
                    setOpenEditDialog(true);
                  }}
                  aria-label="Edit"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setItemToDelete(acc);
                    setOpenConfirmDialog(true);
                  }}
                  aria-label="Delete"
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setViewAccommodation(acc);
                    setOpenViewDialog(true);
                  }}
                  aria-label="View"
                >
                  <VisibilityIcon />
                </IconButton>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default AccommodationManagement;
