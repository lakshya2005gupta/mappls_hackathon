import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  UserCircleIcon, 
  CalendarIcon, 
  MapPinIcon, 
  TrophyIcon,
  PencilIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { currentUser, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    location: currentUser?.location || '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Calculate progress to next level
  const progressToNextLevel = ((currentUser?.points % 100) / 100) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - User Info */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white">
              <div className="flex flex-col items-center">
                {currentUser?.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="h-24 w-24 rounded-full border-4 border-white"
                  />
                ) : (
                  <UserCircleIcon className="h-24 w-24 text-white" />
                )}
                <h2 className="mt-4 text-xl font-bold">{currentUser?.name}</h2>
                <p className="text-primary-100">{currentUser?.email}</p>
              </div>
            </div>
            
            {isEditing ? (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Edit Profile</h3>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-dark-300 dark:border-dark-400 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-dark-300 dark:border-dark-400 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Location
                      </label>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-dark-300 dark:border-dark-400 dark:text-white"
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h3>
                  <Button
                    variant="text"
                    onClick={() => setIsEditing(true)}
                    className="text-primary-600 hover:text-primary-800 dark:text-primary-400"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <CalendarIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                    <span>Joined on {currentUser?.joinedDate}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <MapPinIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                    <span>{currentUser?.location || 'No location set'}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-dark-400">
                    <Button
                      variant="danger"
                      onClick={handleLogout}
                      className="flex items-center"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
          
          {/* Level and Points Card */}
          <Card className="mt-6">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Level & Points</h3>
              
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 p-3 rounded-full dark:bg-primary-900 dark:bg-opacity-30">
                  <TrophyIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Level</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">Level {currentUser?.level || 1}</p>
                </div>
              </div>
              
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Progress to Level {(currentUser?.level || 1) + 1}</span>
                <span className="font-medium text-primary-600 dark:text-primary-400">{currentUser?.points % 100} / 100 points</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-dark-400">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full dark:bg-primary-500" 
                  style={{ width: `${progressToNextLevel}%` }}
                ></div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Points Earned</p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{currentUser?.points || 0}</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Right Column - Badges, Events, etc. */}
        <div className="lg:col-span-2">
          {/* Badges */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Badges</h3>
              
              {currentUser?.badges && currentUser.badges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {currentUser.badges.map((badge, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg text-center dark:bg-dark-300">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-3 dark:bg-primary-900 dark:bg-opacity-30">
                        <TrophyIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{badge.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Earned on {badge.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrophyIcon className="h-12 w-12 text-gray-300 mx-auto mb-3 dark:text-gray-600" />
                  <h4 className="text-gray-500 dark:text-gray-400">No badges earned yet</h4>
                  <p className="text-sm text-gray-400 mt-1 dark:text-gray-500">Participate in events to earn badges</p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Upcoming Events */}
          <Card className="mt-6">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Upcoming Events</h3>
              
              {currentUser?.upcomingEvents && currentUser.upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {currentUser.upcomingEvents.map((event) => (
                    <div key={event.id} className="flex border-b border-gray-200 pb-4 last:border-0 last:pb-0 dark:border-dark-400">
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        {event.image ? (
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-primary-100 flex items-center justify-center dark:bg-primary-900 dark:bg-opacity-30">
                            <CalendarIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{event.date}</p>
                        <Button
                          variant="text"
                          onClick={() => navigate(`/events/${event.id}`)}
                          className="text-primary-600 text-sm mt-1 hover:text-primary-800 dark:text-primary-400"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3 dark:text-gray-600" />
                  <h4 className="text-gray-500 dark:text-gray-400">No upcoming events</h4>
                  <p className="text-sm text-gray-400 mt-1 dark:text-gray-500">Register for events to see them here</p>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/events')}
                    className="mt-4"
                  >
                    Browse Events
                  </Button>
                </div>
              )}
            </div>
          </Card>
          
          {/* Past Events */}
          <Card className="mt-6">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Past Events</h3>
              
              {currentUser?.eventsAttended && currentUser.eventsAttended.length > 0 ? (
                <div className="space-y-4">
                  {currentUser.eventsAttended.map((event) => (
                    <div key={event.id} className="flex border-b border-gray-200 pb-4 last:border-0 last:pb-0 dark:border-dark-400">
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        {event.image ? (
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center dark:bg-dark-300">
                            <CalendarIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                          <Badge variant="success">+{event.pointsEarned} points</Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{event.date}</p>
                        <div className="mt-1 flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`h-4 w-4 ${i < event.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">Your rating</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3 dark:text-gray-600" />
                  <h4 className="text-gray-500 dark:text-gray-400">No past events</h4>
                  <p className="text-sm text-gray-400 mt-1 dark:text-gray-500">Events you've attended will appear here</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 