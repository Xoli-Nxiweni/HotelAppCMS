import { useState } from 'react';
import { Users, Calendar, Home, UserCheck, Book } from 'lucide-react';
import AccommodationManagement from '../AccommodationManagement/AccommodationManagement';
import UsersManagement from '../Users/UsersManagement';
import Bookings from '../Bookings/Bookings';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('accommodations');

  const tabs = [
    {
      id: 'accommodations',
      label: 'Manage Accommodations',
      icon: <Home className="tab-icon" />,
      panelIcon: <Home className="panel-icon" />,
      component: <AccommodationManagement />,
      stats: [
        { label: 'Total Properties', value: '156' },
        { label: 'Available', value: '43' },
        { label: 'Under Maintenance', value: '12' }
      ]
    },
    {
      id: 'users',
      label: 'Manage Users',
      icon: <Users className="tab-icon" />,
      panelIcon: <UserCheck className="panel-icon" />,
      component: <UsersManagement />,
      stats: [
        { label: 'Total Users', value: '2,451' },
        { label: 'Active Today', value: '342' },
        { label: 'New This Week', value: '89' }
      ]
    },
    {
      id: 'bookings',
      label: 'Manage Bookings',
      icon: <Calendar className="tab-icon" />,
      panelIcon: <Book className="panel-icon" />,
      component: <Bookings />,
      stats: [
        { label: 'Total Bookings', value: '1,234' },
        { label: 'Pending', value: '45' },
        { label: 'Today\'s Check-ins', value: '28' }
      ]
    }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="dashboard-container" >
      <nav className="dashboard-navbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`dashboard-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-panel">
          <h2>
            {currentTab.panelIcon}
            {currentTab.label}
          </h2>
          
          <div className="stats-grid">
            {currentTab.stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <h3>{stat.label}</h3>
                <div className="stat-value">{stat.value}</div>
              </div>
            ))}
          </div>

          {currentTab.component}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;