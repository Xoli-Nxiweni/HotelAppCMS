// src/components/UsersManagement/UsersManagement.jsx
import { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Paper, Typography, Box } from '@mui/material';
import { fetchUsers, addUser, updateUser, deleteUser } from '../../Firebase/FirestoreService'; // Adjust imports as necessary

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [editUser, setEditUser] = useState({ id: '', name: '' });

  useEffect(() => {
    // Fetch users from Firestore
    fetchUsers()
      .then(setUsers)
      .catch(console.error);
  }, []);

  const handleAdd = () => {
    addUser(newUser)
      .then(() => {
        setNewUser('');
        return fetchUsers();
      })
      .then(setUsers)
      .catch(console.error);
  };

  const handleUpdate = () => {
    updateUser(editUser.id, { name: editUser.name })
      .then(() => {
        setEditUser({ id: '', name: '' });
        return fetchUsers();
      })
      .then(setUsers)
      .catch(console.error);
  };

  const handleDelete = (id) => {
    deleteUser(id)
      .then(() => fetchUsers())
      .then(setUsers)
      .catch(console.error);
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
    </Box>
  );
};

export default UsersManagement;
