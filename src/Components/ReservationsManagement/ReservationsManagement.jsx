import { useState, useEffect } from 'react';
import { fetchCollection, addDocument, updateDocument, deleteDocument } from '../../Firebase/FirestoreService';
import { Button, TextField, List, ListItem, ListItemText, Snackbar } from '@mui/material';
import { Alert } from '@mui/material';

const ReservationsManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [newReservation, setNewReservation] = useState('');
  const [editReservation, setEditReservation] = useState({ id: '', name: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await fetchCollection('reservations');
        setReservations(data);
      } catch (error) {
        showSnackbar('Error fetching reservations', 'error');
      }
    };
    fetchReservations();
  }, []);

  const handleAdd = async () => {
    if (newReservation) {
      try {
        await addDocument('reservations', { name: newReservation });
        setNewReservation('');
        const data = await fetchCollection('reservations');
        setReservations(data);
        showSnackbar('Reservation added successfully', 'success');
      } catch (error) {
        showSnackbar('Error adding reservation', 'error');
      }
    }
  };

  const handleUpdate = async () => {
    if (editReservation.id && editReservation.name) {
      try {
        await updateDocument('reservations', editReservation.id, { name: editReservation.name });
        setEditReservation({ id: '', name: '' });
        const data = await fetchCollection('reservations');
        setReservations(data);
        showSnackbar('Reservation updated successfully', 'success');
      } catch (error) {
        showSnackbar('Error updating reservation', 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocument('reservations', id);
      const data = await fetchCollection('reservations');
      setReservations(data);
      showSnackbar('Reservation deleted successfully', 'success');
    } catch (error) {
      showSnackbar('Error deleting reservation', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <TextField
        label="New Reservation"
        value={newReservation}
        onChange={(e) => setNewReservation(e.target.value)}
      />
      <Button onClick={handleAdd}>Add Reservation</Button>

      <TextField
        label="Edit Reservation Name"
        value={editReservation.name}
        onChange={(e) => setEditReservation({ ...editReservation, name: e.target.value })}
      />
      <Button onClick={handleUpdate}>Update Reservation</Button>

      <List>
        {reservations.map((item) => (
          <ListItem key={item.id}>
            <ListItemText primary={item.name} />
            <Button onClick={() => handleDelete(item.id)}>Delete</Button>
          </ListItem>
        ))}
      </List>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ReservationsManagement;
