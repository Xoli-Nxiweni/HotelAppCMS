import { useState } from 'react';
import { AppBar, Tabs, Tab, Container, Typography, Box, Paper } from '@mui/material';
import AccommodationManagement from '../AccommodationManagement/AccommodationManagement';
import ReservationsManagement from '../ReservationsManagement/ReservationsManagement';
import UsersManagement from '../Users/UsersManagement';
import Bookings from '../Bookings/Bookings';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('accommodations');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ paddingY: 3 }}>
      <AppBar position="static" color="primary" sx={{ borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab value="accommodations" label="Manage Accommodations" />
          <Tab value="reservations" label="Manage Reservations" />
          <Tab value="users" label="Manage Users" /> {/* Tab for Users */}
          <Tab value="bookings" label="Manage Bookings" /> {/* New Tab for Bookings */}
        </Tabs>
      </AppBar>
      <Box
        sx={{
          marginTop: 2,
          padding: 3,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {activeTab === 'accommodations' && (
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              Accommodation Management
            </Typography>
            <AccommodationManagement />
          </Paper>
        )}
        {activeTab === 'reservations' && (
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              Reservations Management
            </Typography>
            <ReservationsManagement />
          </Paper>
        )}
        {activeTab === 'users' && (
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              Users Management
            </Typography>
            <UsersManagement />
          </Paper>
        )}
        {activeTab === 'bookings' && (
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              Bookings Management
            </Typography>
            <Bookings />
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
