import React, { useState } from 'react';
import { 
  CalendarIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const AdminDashboard = ({ organization, events = [], users = [] }) => {
  const [activeTab, setActiveTab] = useState('events');
  
  // Calculate stats
  const totalEvents = events.length;
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length;
  const totalParticipants = events.reduce((sum, event) => sum + event.attendees, 0);
  const totalUsers = users.length;
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'events':
        return renderEventsTab();
      case 'users':
        return renderUsersTab();
      case 'stats':
        return renderStatsTab();
      default:
        return renderEventsTab();
    }
  };
  
  const renderEventsTab = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Your Events</h3>
          <Button variant="primary" size="sm" className="flex items-center">
            <PlusIcon className="h-4 w-4 mr-1" />
            Create Event
          </Button>
        </div>
        
        {events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendees
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded bg-gray-200 overflow-hidden">
                          {event.image ? (
                            <img src={event.image} alt={event.title} className="h-10 w-10 object-cover" />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center">
                              <CalendarIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                          <div className="text-sm text-gray-500">{event.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(event.date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{event.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{event.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.attendees}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getEventStatusBadge(event)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-primary-600 hover:text-primary-900">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-500 mb-4">
              Start by creating your first event to engage with volunteers.
            </p>
            <Button variant="primary">Create Your First Event</Button>
          </div>
        )}
      </div>
    );
  };
  
  const renderUsersTab = () => {
    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Registered Users</h3>
        
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Events Attended
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserGroupIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.eventsAttended.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                        Level {user.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users yet</h3>
            <p className="text-gray-500">
              Users will appear here once they register and participate in your events.
            </p>
          </div>
        )}
      </div>
    );
  };
  
  const renderStatsTab = () => {
    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="text-center p-4">
            <div className="text-3xl font-bold text-primary-600 mb-1">{totalEvents}</div>
            <div className="text-gray-500">Total Events</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-3xl font-bold text-primary-600 mb-1">{totalParticipants}</div>
            <div className="text-gray-500">Total Participants</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-3xl font-bold text-primary-600 mb-1">{upcomingEvents}</div>
            <div className="text-gray-500">Upcoming Events</div>
          </Card>
        </div>
        
        <Card className="mb-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">Event Participation</h4>
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">
                Charts and analytics will be displayed here.
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <h4 className="text-base font-medium text-gray-900 mb-4">Popular Event Categories</h4>
          <div className="space-y-4">
            {['Cleaning Drive', 'Awareness', 'Education', 'Health'].map((category, index) => (
              <div key={index} className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 w-24">{category}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };
  
  // Helper function to get event status badge
  const getEventStatusBadge = (event) => {
    const today = new Date();
    const eventDate = new Date(event.date);
    
    if (eventDate < today) {
      return <Badge variant="default">Completed</Badge>;
    } else if (eventDate.toDateString() === today.toDateString()) {
      return <Badge variant="warning">Today</Badge>;
    } else if (eventDate < new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) {
      return <Badge variant="primary">Upcoming</Badge>;
    } else {
      return <Badge variant="secondary">Scheduled</Badge>;
    }
  };
  
  return (
    <div>
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{organization.name}</h2>
            <p className="text-gray-500">{organization.description}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="primary">Edit Organization</Button>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('events')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'events'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 