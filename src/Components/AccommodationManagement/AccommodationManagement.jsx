import { useState, useEffect } from 'react';
import { fetchCollection, addDocument, updateDocument, deleteDocument } from '../../Firebase/FirestoreService';
import { Button, TextField, List, ListItem, Typography, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar, Alert, Checkbox, FormControlLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const AccommodationManagement = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [newAccommodation, setNewAccommodation] = useState({
    heading: '',
    description: '',
    price: '',
    size: '',
    beds: '',
    bathrooms: '',
    checkIn: '',
    checkOut: '',
    guests: '',
    nonSmoking: false,
    reviews: '',
    view: '',
    nights: '',
    isFavorite: false,
    isBooked: false,
    image: ''
  });
  const [editAccommodation, setEditAccommodation] = useState({
    id: '',
    heading: '',
    description: '',
    price: '',
    size: '',
    beds: '',
    bathrooms: '',
    checkIn: '',
    checkOut: '',
    guests: '',
    nonSmoking: false,
    reviews: '',
    view: '',
    nights: '',
    isFavorite: false,
    isBooked: false,
    image: ''
  });
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const data = await fetchCollection('hotelRooms');
        setAccommodations(data);
      } catch (error) {
        console.error('Error fetching accommodations:', error);
      }
    };
    fetchAccommodations();
  }, []);

  const handleAdd = async () => {
    if (newAccommodation.heading) {
      await addDocument('rooms', newAccommodation);
      setNewAccommodation({
        heading: '',
        description: '',
        price: '',
        size: '',
        beds: '',
        bathrooms: '',
        checkIn: '',
        checkOut: '',
        guests: '',
        nonSmoking: false,
        reviews: '',
        view: '',
        nights: '',
        isFavorite: false,
        isBooked: false,
        image: ''
      });
      setOpenAddDialog(false);
      await updateAccommodations();
      showSnackbar('Accommodation added successfully!');
    }
  };

  const handleUpdate = async () => {
    if (editAccommodation.id) {
      await updateDocument('rooms', editAccommodation.id, {
        heading: editAccommodation.heading,
        description: editAccommodation.description,
        price: editAccommodation.price,
        size: editAccommodation.size,
        beds: editAccommodation.beds,
        bathrooms: editAccommodation.bathrooms,
        checkIn: editAccommodation.checkIn,
        checkOut: editAccommodation.checkOut,
        guests: editAccommodation.guests,
        nonSmoking: editAccommodation.nonSmoking,
        reviews: editAccommodation.reviews,
        view: editAccommodation.view,
        nights: editAccommodation.nights,
        isFavorite: editAccommodation.isFavorite,
        isBooked: editAccommodation.isBooked,
        image: editAccommodation.image
      });
      setEditAccommodation({
        id: '',
        heading: '',
        description: '',
        price: '',
        size: '',
        beds: '',
        bathrooms: '',
        checkIn: '',
        checkOut: '',
        guests: '',
        nonSmoking: false,
        reviews: '',
        view: '',
        nights: '',
        isFavorite: false,
        isBooked: false,
        image: ''
      });
      setOpenEditDialog(false);
      await updateAccommodations();
      showSnackbar('Accommodation updated successfully!');
    }
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      await deleteDocument('rooms', itemToDelete.id);
      setOpenConfirmDialog(false);
      await updateAccommodations();
      showSnackbar('Accommodation deleted successfully!');
    }
  };

  const updateAccommodations = async () => {
    const data = await fetchCollection('rooms');
    setAccommodations(data);
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  return (
    <div>
      <Button onClick={() => setOpenAddDialog(true)} variant="contained" color="primary" startIcon={<AddIcon />}>
        Add Accommodation
      </Button>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Accommodation</DialogTitle>
        <DialogContent>
          <TextField
            label="Accommodation Name"
            value={newAccommodation.heading}
            onChange={(e) => setNewAccommodation({ ...newAccommodation, heading: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={newAccommodation.description}
            onChange={(e) => setNewAccommodation({ ...newAccommodation, description: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            value={newAccommodation.price}
            onChange={(e) => setNewAccommodation({ ...newAccommodation, price: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Size"
            value={newAccommodation.size}
            onChange={(e) => setNewAccommodation({ ...newAccommodation, size: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Beds"
            value={newAccommodation.beds}
            onChange={(e) => setNewAccommodation({ ...newAccommodation, beds: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Bathrooms"
            value={newAccommodation.bathrooms}
            onChange={(e) => setNewAccommodation({ ...newAccommodation, bathrooms: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Check-in Date"
            type="date"
            value={newAccommodation.checkIn}
            onChange={(e) => setNewAccommodation({ ...newAccommodation, checkIn: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Check-out Date"
            type="date"
            value={newAccommodation.checkOut}
            onChange={(e) => setNewAccommodation({ ...newAccommodation, checkOut: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Guests"
            value={newAccommodation.guests}
            onChange={(e) => setNewAccommodation({ ...newAccommodation, guests: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Reviews"
            value={newAccommodation.reviews}
            onChange={(e) => setNewAccommodation({ ...newAccommodation, reviews: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="View"
            value={newAccommodation.view}
            onChange={(e) => setNewAccommodation({ ...newAccommodation, view: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nights"
            value={newAccommodation.nights}
            onChange={(e) => setNewAccommodation({ ...newAccommodation, nights: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Image URL"
            value={newAccommodation.image}
            onChange={(e) => setNewAccommodation({ ...newAccommodation, image: e.target.value })}
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newAccommodation.nonSmoking}
                onChange={(e) => setNewAccommodation({ ...newAccommodation, nonSmoking: e.target.checked })}
              />
            }
            label="Non-smoking"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newAccommodation.isFavorite}
                onChange={(e) => setNewAccommodation({ ...newAccommodation, isFavorite: e.target.checked })}
              />
            }
            label="Favorite"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newAccommodation.isBooked}
                onChange={(e) => setNewAccommodation({ ...newAccommodation, isBooked: e.target.checked })}
              />
            }
            label="Booked"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Accommodation</DialogTitle>
        <DialogContent>
          <TextField
            label="Accommodation Name"
            value={editAccommodation.heading}
            onChange={(e) => setEditAccommodation({ ...editAccommodation, heading: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={editAccommodation.description}
            onChange={(e) => setEditAccommodation({ ...editAccommodation, description: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            value={editAccommodation.price}
            onChange={(e) => setEditAccommodation({ ...editAccommodation, price: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Size"
            value={editAccommodation.size}
            onChange={(e) => setEditAccommodation({ ...editAccommodation, size: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Beds"
            value={editAccommodation.beds}
            onChange={(e) => setEditAccommodation({ ...editAccommodation, beds: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Bathrooms"
            value={editAccommodation.bathrooms}
            onChange={(e) => setEditAccommodation({ ...editAccommodation, bathrooms: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Check-in Date"
            type="date"
            value={editAccommodation.checkIn}
            onChange={(e) => setEditAccommodation({ ...editAccommodation, checkIn: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Check-out Date"
            type="date"
            value={editAccommodation.checkOut}
            onChange={(e) => setEditAccommodation({ ...editAccommodation, checkOut: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Guests"
            value={editAccommodation.guests}
            onChange={(e) => setEditAccommodation({ ...editAccommodation, guests: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Reviews"
            value={editAccommodation.reviews}
            onChange={(e) => setEditAccommodation({ ...editAccommodation, reviews: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="View"
            value={editAccommodation.view}
            onChange={(e) => setEditAccommodation({ ...editAccommodation, view: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nights"
            value={editAccommodation.nights}
            onChange={(e) => setEditAccommodation({ ...editAccommodation, nights: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Image URL"
            value={editAccommodation.image}
            onChange={(e) => setEditAccommodation({ ...editAccommodation, image: e.target.value })}
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={editAccommodation.nonSmoking}
                onChange={(e) => setEditAccommodation({ ...editAccommodation, nonSmoking: e.target.checked })}
              />
            }
            label="Non-smoking"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={editAccommodation.isFavorite}
                onChange={(e) => setEditAccommodation({ ...editAccommodation, isFavorite: e.target.checked })}
              />
            }
            label="Favorite"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={editAccommodation.isBooked}
                onChange={(e) => setEditAccommodation({ ...editAccommodation, isBooked: e.target.checked })}
              />
            }
            label="Booked"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <List>
        {accommodations.map((acc) => (
          <ListItem key={acc.id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{acc.heading}</Typography>
                <Typography variant="body2">{acc.description}</Typography>
                {/* Display other details */}
                <IconButton onClick={() => {
                  setEditAccommodation(acc);
                  setOpenEditDialog(true);
                }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => {
                  setItemToDelete(acc);
                  setOpenConfirmDialog(true);
                }}>
                  <DeleteIcon />
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




