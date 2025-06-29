import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon, 
  UserGroupIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowLeftIcon,
  ShareIcon,
  HeartIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { mockEvents } from '../utils/mockData';

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate API call
    const fetchEvent = () => {
      setLoading(true);
      setTimeout(() => {
        const foundEvent = mockEvents.find(e => e.id === parseInt(id));
        setEvent(foundEvent || null);
        setLoading(false);
      }, 800);
    };
    
    fetchEvent();
    
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, [id]);
  
  // Initialize map after event is loaded
  useEffect(() => {
    if (!loading && event && !mapInitialized && typeof window.L !== 'undefined') {
      initializeMap();
    }
  }, [loading, event, mapInitialized]);
  
  const initializeMap = () => {
    // Check if Leaflet is available
    if (!window.L || !event.latitude || !event.longitude) {
      return;
    }
    
    // Create map instance
    const map = window.L.map('event-map').setView([event.latitude, event.longitude], 14);
    
    // Add tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add marker for event
    window.L.marker([event.latitude, event.longitude])
      .addTo(map)
      .bindPopup(`
        <div>
          <h5 class="font-medium">${event.title}</h5>
          <p class="text-sm">${event.location}</p>
        </div>
      `)
      .openPopup();
    
    // If user location is available, add a marker and show distance
    if (userLocation) {
      window.L.marker([userLocation.latitude, userLocation.longitude], {
        icon: window.L.divIcon({
          className: 'user-location-marker',
          html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>'
        })
      }).addTo(map)
      .bindPopup('Your location')
      .openPopup();
      
      // Draw a line between user and event
      window.L.polyline([
        [userLocation.latitude, userLocation.longitude],
        [event.latitude, event.longitude]
      ], {
        color: '#3B82F6',
        dashArray: '5, 10',
        weight: 2
      }).addTo(map);
      
      // Fit bounds to include both markers
      map.fitBounds([
        [userLocation.latitude, userLocation.longitude],
        [event.latitude, event.longitude]
      ], { padding: [50, 50] });
    }
    
    setMapInitialized(true);
  };
  
  const handleRegister = () => {
    // Simulate registration
    setRegistered(true);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time
  const formatTime = (timeString) => {
    return timeString;
  };
  
  // Calculate distance from user
  const calculateDistance = () => {
    if (!userLocation || !event || !event.latitude || !event.longitude) {
      return null;
    }
    
    // Simple distance calculation (not accounting for Earth's curvature)
    const lat1 = userLocation.latitude;
    const lon1 = userLocation.longitude;
    const lat2 = event.latitude;
    const lon2 = event.longitude;
    
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    
    return distance.toFixed(1);
  };
  
  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };
  
  // Get category variant for badge
  const getCategoryVariant = (category) => {
    const categoryMap = {
      'Environment': 'success',
      'Education': 'info',
      'Health': 'warning',
      'Community': 'primary',
      'Fundraising': 'secondary',
      'Animal Welfare': 'success',
      'Disaster Relief': 'danger',
      'Arts & Culture': 'info'
    };
    
    return categoryMap[category] || 'primary';
  };
  
  // Add this function to handle food donation
  const handleDonateFood = () => {
    navigate('/food-donation', { 
      state: { 
        fromEvent: true, 
        eventName: event?.title,
        eventLocation: event?.location
      } 
    });
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
            </div>
            <div>
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/events">
            <Button variant="primary">Browse All Events</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link to="/events" className="inline-flex items-center text-primary-600 hover:text-primary-800">
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Events
        </Link>
      </div>
      
      {/* Event header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          <div className="flex items-center space-x-2">
            <Badge variant={getCategoryVariant(event.category)}>
              {event.category}
            </Badge>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <ShareIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-primary-500" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 mr-2 text-primary-500" />
            <span>{formatTime(event.time)}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2 text-primary-500" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center">
            <UserGroupIcon className="h-5 w-5 mr-2 text-primary-500" />
            <span>{event.participants} participants</span>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Event details */}
        <div className="md:col-span-2 space-y-6">
          {/* Event image */}
          <img 
            src={event.image || "https://images.unsplash.com/photo-1546552356-3fae876a61ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"} 
            alt={event.title}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
          
          {/* Description */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">About This Event</h2>
            <div className="prose max-w-none text-gray-600">
              <p>{event.description}</p>
            </div>
          </div>
          
          {/* Activities */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Activities</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              {event.activities ? (
                event.activities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))
              ) : (
                <>
                  <li>Community engagement and team building</li>
                  <li>Hands-on activities related to {event.category}</li>
                  <li>Networking with like-minded individuals</li>
                  <li>Learning new skills and making a difference</li>
                </>
              )}
            </ul>
          </div>
          
          {/* Requirements */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">What to Bring</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              {event.requirements ? (
                event.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))
              ) : (
                <>
                  <li>Comfortable clothing appropriate for the activity</li>
                  <li>Water bottle and sun protection</li>
                  <li>Positive attitude and willingness to participate</li>
                </>
              )}
            </ul>
          </div>
        </div>
        
        {/* Right column - Registration and map */}
        <div className="space-y-6">
          {/* Registration card */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Registration</h2>
              
              {registered ? (
                <div className="text-center">
                  <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
                    <p className="font-medium">You're registered for this event!</p>
                    <p className="text-sm mt-1">Check your email for confirmation details.</p>
                  </div>
                  <Button variant="outline" fullWidth>
                    Add to Calendar
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Registration Fee</span>
                      <span className="font-medium">{event.fee ? `$${event.fee}` : 'Free'}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Date</span>
                      <span className="font-medium">{event.date}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Time</span>
                      <span className="font-medium">{event.time}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Spots Available</span>
                      <span className="font-medium">{event.spotsAvailable || 'Unlimited'}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-8">
                    <Button 
                      variant="primary"
                      onClick={handleRegister}
                      disabled={loading || registered}
                      className="flex items-center"
                    >
                      {registered ? 'Registered' : 'Register Now'}
                    </Button>
                    
                    <Button 
                      variant="secondary"
                      onClick={handleDonateFood}
                      className="flex items-center"
                    >
                      <GiftIcon className="h-5 w-5 mr-2" />
                      Donate Food
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
          
          {/* Location card */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
              
              {event.latitude && event.longitude ? (
                <>
                  <div className="h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <div id="event-map" className="h-full w-full"></div>
                  </div>
                  <p className="text-gray-600 mb-2">{event.location}</p>
                  
                  {calculateDistance() && (
                    <p className="text-sm text-gray-500">
                      {calculateDistance()} km from your location
                    </p>
                  )}
                  
                  <div className="mt-4">
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                    >
                      Get Directions
                    </a>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 bg-gray-100 rounded-lg">
                  <MapPinIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Location details unavailable</p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Organizer card */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Organizer</h2>
              
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-gray-500" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">{event.organizer || 'NGO Events Team'}</h3>
                  <p className="text-sm text-gray-600">Event Organizer</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">contact@ngoevents.org</span>
                </div>
                <div className="flex items-center text-sm">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage; 