import { useState, useEffect } from 'react';
import { fetchCollection, addDocument, updateDocument, deleteDocument } from '../../Firebase/FirestoreService';
import { 
  Button, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  Snackbar,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Divider
} from '@mui/material';
import { Alert } from '@mui/material';
import { Edit, Delete, Add, Close } from '@mui/icons-material';

const ReservationsManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [newReservation, setNewReservation] = useState('');
  const [editReservation, setEditReservation] = useState({ id: '', name: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await fetchCollection('reservations');
      setReservations(data);
    } catch (error) {
      showSnackbar('Error fetching reservations', 'error');
    }
  };

  const handleAdd = async () => {
    if (newReservation.trim()) {
      try {
        await addDocument('reservations', { name: newReservation });
        setNewReservation('');
        await fetchReservations();
        showSnackbar('Reservation added successfully', 'success');
      } catch (error) {
        showSnackbar('Error adding reservation', 'error');
      }
    }
  };

  const handleUpdate = async () => {
    if (editReservation.id && editReservation.name.trim()) {
      try {
        await updateDocument('reservations', editReservation.id, { name: editReservation.name });
        setEditReservation({ id: '', name: '' });
        setDialogOpen(false);
        await fetchReservations();
        showSnackbar('Reservation updated successfully', 'success');
      } catch (error) {
        showSnackbar('Error updating reservation', 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocument('reservations', id);
      await fetchReservations();
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

  const openEditDialog = (reservation) => {
    setEditReservation(reservation);
    setDialogOpen(true);
  };

  return (
    <Paper elevation={0} sx={{ p: 3, backgroundColor: 'transparent' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
          Add New Reservation
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Reservation Name"
            value={newReservation}
            onChange={(e) => setNewReservation(e.target.value)}
            variant="outlined"
            size="medium"
            sx={{
              backgroundColor: '#fff',
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'coral',
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleAdd}
            startIcon={<Add />}
            sx={{
              backgroundColor: 'coral',
              '&:hover': {
                backgroundColor: '#ff7f50',
              },
              minWidth: '120px',
            }}
          >
            Add
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
        Current Reservations
      </Typography>
      
      <Paper elevation={1} sx={{ backgroundColor: '#fff' }}>
        <List>
          {reservations.map((item) => (
            <ListItem
              key={item.id}
              secondaryAction={
                <Box>
                  <IconButton 
                    edge="end" 
                    onClick={() => openEditDialog(item)}
                    sx={{ color: 'coral', mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    onClick={() => handleDelete(item.id)}
                    sx={{ color: '#666' }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              }
              sx={{
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
                borderBottom: '1px solid #eee',
              }}
            >
              <ListItemText 
                primary={item.name}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: '#333',
                    fontWeight: 500,
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle sx={{ borderBottom: '1px solid #eee' }}>
          Edit Reservation
          <IconButton
            onClick={() => setDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Reservation Name"
            value={editReservation.name}
            onChange={(e) => setEditReservation({ ...editReservation, name: e.target.value })}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'coral',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setDialogOpen(false)}
            sx={{ color: '#666' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            sx={{
              backgroundColor: 'coral',
              '&:hover': {
                backgroundColor: '#ff7f50',
              },
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ReservationsManagement;