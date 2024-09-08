import { useState, useEffect } from 'react';
import { fetchCollection, addDocument, updateDocument, deleteDocument } from '../../Firebase/FirestoreService';
import { Button, TextField, List, ListItem, ListItemText } from '@mui/material';

const ReservationsManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [newReservation, setNewReservation] = useState('');
  const [editReservation, setEditReservation] = useState({ id: '', name: '' });

  useEffect(() => {
    const fetchReservations = async () => {
      const data = await fetchCollection('reservations');
      setReservations(data);
    };
    fetchReservations();
  }, []);

  const handleAdd = async () => {
    if (newReservation) {
      await addDocument('reservations', { name: newReservation });
      setNewReservation('');
      const data = await fetchCollection('reservations');
      setReservations(data);
    }
  };

  const handleUpdate = async () => {
    if (editReservation.id && editReservation.name) {
      await updateDocument('reservations', editReservation.id, { name: editReservation.name });
      setEditReservation({ id: '', name: '' });
      const data = await fetchCollection('reservations');
      setReservations(data);
    }
  };

  const handleDelete = async (id) => {
    await deleteDocument('reservations', id);
    const data = await fetchCollection('reservations');
    setReservations(data);
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
    </div>
  );
};

export default ReservationsManagement;
