import { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Paper, Typography, Box, Snackbar } from '@mui/material';
import { Alert } from '@mui/material';
import { fetchUsers, addUser, updateUser, deleteUser } from '../../Firebase/FirestoreService'; // Adjust imports as necessary

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [editUser, setEditUser] = useState({ id: '', name: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        showSnackbar('Error fetching users', 'error');
      }
    };
    fetchUserData();
  }, []);

  const handleAdd = async () => {
    if (newUser) {
      try {
        await addUser(newUser);
        setNewUser('');
        const data = await fetchUsers();
        setUsers(data);
        showSnackbar('User added successfully', 'success');
      } catch (error) {
        showSnackbar('Error adding user', 'error');
      }
    }
  };

  const handleUpdate = async () => {
    if (editUser.id && editUser.name) {
      try {
        await updateUser(editUser.id, { name: editUser.name });
        setEditUser({ id: '', name: '' });
        const data = await fetchUsers();
        setUsers(data);
        showSnackbar('User updated successfully', 'success');
      } catch (error) {
        showSnackbar('Error updating user', 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      const data = await fetchUsers();
      setUsers(data);
      showSnackbar('User deleted successfully', 'success');
    } catch (error) {
      showSnackbar('Error deleting user', 'error');
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
    <Box>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>
          Add New User
        </Typography>
        <TextField
          label="New User"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
          fullWidth
          sx={{ marginBottom: 1 }}
        />
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add User
        </Button>
      </Paper>

      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>
          Edit User
        </Typography>
        <TextField
          label="Edit User Name"
          value={editUser.name}
          onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
          fullWidth
          sx={{ marginBottom: 1 }}
        />
        <Button variant="contained" color="secondary" onClick={handleUpdate}>
          Update User
        </Button>
      </Paper>

      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <ListItemText primary={user.name} />
            <Button variant="outlined" color="error" onClick={() => handleDelete(user.id)}>
              Delete
            </Button>
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
    </Box>
  );
};

export default UsersManagement;
