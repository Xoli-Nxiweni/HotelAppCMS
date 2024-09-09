import { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Paper, Typography, Box } from '@mui/material';
import { fetchUsers, addUser, updateUser, deleteUser } from '../../Firebase/FirestoreService';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ displayName: '', email: '' });
  const [editUser, setEditUser] = useState({ id: '', displayName: '' });

  useEffect(() => {
    // Fetch users from Firestore
    const loadUsers = async () => {
      try {
        const usersList = await fetchUsers();
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    loadUsers();
  }, []);

  const handleAdd = async () => {
    if (newUser.displayName && newUser.email) {
      try {
        await addUser(newUser);
        setNewUser({ displayName: '', email: '' });
        const updatedUsers = await fetchUsers();
        setUsers(updatedUsers);
      } catch (error) {
        console.error('Error adding user:', error);
      }
    } else {
      console.warn('Please provide both display name and email.');
    }
  };

  const handleUpdate = async () => {
    if (editUser.id && editUser.displayName) {
      try {
        await updateUser(editUser.id, { displayName: editUser.displayName });
        setEditUser({ id: '', displayName: '' });
        const updatedUsers = await fetchUsers();
        setUsers(updatedUsers);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {
      console.warn('Please provide a valid ID and display name for the update.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>
          Add New User
        </Typography>
        <TextField
          label="Display Name"
          value={newUser.displayName}
          onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
          fullWidth
          sx={{ marginBottom: 1 }}
        />
        <TextField
          label="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
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
          label="Display Name"
          value={editUser.displayName}
          onChange={(e) => setEditUser({ ...editUser, displayName: e.target.value })}
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
            <ListItemText 
              primary={user.displayName} 
              secondary={user.email}
            />
            <Button variant="outlined" color="error" onClick={() => handleDelete(user.id)}>
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UsersManagement;
