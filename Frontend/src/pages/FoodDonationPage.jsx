import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  HeartIcon, 
  MapPinIcon, 
  CalendarIcon, 
  ClockIcon,
  UserGroupIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
  MapIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import foodDonationService from '../services/foodDonationService';

// Mock food donation drives
const mockFoodDrives = [
  {
    id: 1,
    title: 'Weekend Food Drive',
    organization: 'Food For All Foundation',
    description: 'Help us feed the homeless and underprivileged families in the city. We accept all types of non-perishable food items, fresh produce, and cooked meals.',
    location: 'Community Center, Delhi',
    date: '2023-08-20',
    time: '10:00 AM - 4:00 PM',
    image: 'https://images.unsplash.com/photo-1593113598332-cd59a0c3a9a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    acceptedItems: ['Non-perishable food', 'Fresh produce', 'Cooked meals', 'Packaged food'],
    contactPerson: 'Rahul Sharma',
    contactPhone: '+91 9876543210',
    latitude: 28.6139,
    longitude: 77.2090,
    peopleHelped: 250,
    donationsReceived: 45
  },
  {
    id: 2,
    title: 'Monthly Food Collection',
    organization: 'Hunger Relief NGO',
    description: 'Monthly food collection drive to support our ongoing efforts to provide meals to underprivileged children and elderly people in slum areas.',
    location: 'Hunger Relief Center, Mumbai',
    date: '2023-08-25',
    time: '9:00 AM - 6:00 PM',
    image: 'https://images.unsplash.com/photo-1615648078154-9795243c85e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    acceptedItems: ['Rice', 'Lentils', 'Flour', 'Oil', 'Spices', 'Packaged food'],
    contactPerson: 'Priya Patel',
    contactPhone: '+91 9876543211',
    latitude: 19.0760,
    longitude: 72.8777,
    peopleHelped: 500,
    donationsReceived: 120
  },
  {
    id: 3,
    title: 'Restaurant Surplus Food Collection',
    organization: 'No Food Waste',
    description: 'We collect surplus food from restaurants, hotels, and events to redistribute to those in need. Help us reduce food waste and feed the hungry.',
    location: 'Multiple Locations, Bangalore',
    date: 'Ongoing',
    time: '7:00 PM - 10:00 PM (Daily)',
    image: 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    acceptedItems: ['Surplus cooked food', 'Untouched food from events', 'Restaurant leftovers'],
    contactPerson: 'Arun Kumar',
    contactPhone: '+91 9876543212',
    latitude: 12.9716,
    longitude: 77.5946,
    peopleHelped: 1200,
    donationsReceived: 350
  },
  {
    id: 4,
    title: 'College Campus Food Drive',
    organization: 'Student Volunteers Association',
    description: 'Food collection drive organized by students to support local shelters and community kitchens. Donate non-perishable items and help us make a difference.',
    location: 'IIT Delhi Campus',
    date: '2023-08-18',
    time: '11:00 AM - 5:00 PM',
    image: 'https://images.unsplash.com/photo-1607113761670-498df5c3a538?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    acceptedItems: ['Packaged food', 'Dry snacks', 'Beverages', 'Fruits'],
    contactPerson: 'Vikram Singh',
    contactPhone: '+91 9876543213',
    latitude: 28.5459,
    longitude: 77.1926,
    peopleHelped: 150,
    donationsReceived: 30
  }
];

// Replace the constant at the top of the file
const MAPPLS_API_KEY = 'your_default_api_key'; // Replace with your actual API key

const FoodDonationPage = () => {
  const [foodDrives, setFoodDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [donationForm, setDonationForm] = useState({
    foodType: '',
    quantity: '',
    pickupAddress: '',
    pickupDate: '',
    pickupTime: '',
    description: '',
    contactPhone: '',
    eventName: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showDonationForm, setShowDonationForm] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if coming from an event
  useEffect(() => {
    if (location.state?.fromEvent) {
      // Pre-fill form with event information
      setDonationForm(prev => ({
        ...prev,
        description: `Leftover food from event: ${location.state.eventName}`,
        pickupAddress: location.state.eventLocation || '',
        eventName: location.state.eventName || ''
      }));
      
      // Show donation form directly
      if (foodDrives.length > 0) {
        setSelectedDrive(foodDrives[0]);
        setShowDonationForm(true);
        
        // Scroll to form after a short delay
        setTimeout(() => {
          document.getElementById('donation-form')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    }
  }, [location.state, foodDrives]);

  // Update the map initialization useEffect
  useEffect(() => {
    const initializeMap = () => {
      try {
        const mapInstance = new window.Mappls.Map('donation-map', {
          center: [77.209, 28.6139], // Default to New Delhi
          zoom: 12,
          search: false,
          location: true,
        });
        setMap(mapInstance);
      } catch (error) {
        console.error('Error initializing map:', error);
        toast.error('Failed to initialize map');
      }
    };

    const getUserLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
            if (map) {
              map.setCenter([longitude, latitude]);
              // Add user marker
              try {
                new window.Mappls.Marker({
                  map: map,
                  position: { lat: latitude, lng: longitude },
                  draggable: false,
                  popupHtml: '<div class="popup-content"><b>Your Location</b></div>'
                });
              } catch (error) {
                console.error('Error adding user marker:', error);
              }
            }
          },
          (error) => {
            console.error('Error getting location:', error);
            toast.error('Unable to get your location. Using default location.');
          }
        );
      } else {
        toast.error('Geolocation is not supported by your browser');
      }
    };

    if (showMap && !map) {
      // Load Mappls script if not already loaded
      if (!window.Mappls) {
        const script = document.createElement('script');
        script.src = `https://apis.mappls.com/advancedmaps/v1/${MAPPLS_API_KEY}/map_load?v=1.5`;
        script.async = true;
        script.onload = () => {
          initializeMap();
          getUserLocation();
        };
        script.onerror = () => {
          console.error('Failed to load Mappls script');
          toast.error('Failed to load map service');
        };
        document.body.appendChild(script);
      } else {
        initializeMap();
        getUserLocation();
      }
    }

    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [showMap, map]);

  // Update the food drives useEffect to properly handle markers
  useEffect(() => {
    const fetchFoodDrives = async () => {
      setLoading(true);
      try {
        let drives;
        if (userLocation) {
          drives = await foodDonationService.getNearbyDrives(
            userLocation.latitude,
            userLocation.longitude
          );
        } else {
          drives = await foodDonationService.getFoodDrives();
        }
        setFoodDrives(drives.length > 0 ? drives : mockFoodDrives);
        
        // Add markers for food drives if map is shown
        if (map && drives.length > 0) {
          drives.forEach(drive => {
            try {
              new window.Mappls.Marker({
                map: map,
                position: { lat: drive.latitude, lng: drive.longitude },
                draggable: false,
                popupHtml: `
                  <div class="popup-content">
                    <h3 style="font-weight: bold; margin-bottom: 4px;">${drive.title}</h3>
                    <p style="margin-bottom: 4px;">${drive.organization}</p>
                    <p style="font-size: 0.875rem; margin-bottom: 8px;">${drive.location}</p>
                    <button 
                      style="background-color: #4F46E5; color: white; padding: 4px 12px; border-radius: 4px; font-size: 0.875rem; cursor: pointer;"
                      onclick="window.handleDriveSelect && window.handleDriveSelect(${JSON.stringify(drive)})"
                    >
                      Donate
                    </button>
                  </div>
                `
              });
            } catch (error) {
              console.error('Error adding drive marker:', error);
            }
          });
        }
      } catch (error) {
        console.error('Error fetching food drives:', error);
        toast.error('Failed to fetch food drives');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDrives();
  }, [userLocation, map]);

  // Add this to handle marker click events
  useEffect(() => {
    if (window) {
      window.handleDriveSelect = (drive) => {
        handleDriveSelect(drive);
      };
    }
    
    return () => {
      if (window) {
        delete window.handleDriveSelect;
      }
    };
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDonationForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate donation form
  const validateForm = () => {
    const errors = {};
    
    if (!donationForm.foodType.trim()) {
      errors.foodType = 'Food type is required';
    }
    
    if (!donationForm.quantity.trim()) {
      errors.quantity = 'Quantity is required';
    }
    
    if (!donationForm.pickupAddress.trim()) {
      errors.pickupAddress = 'Pickup address is required';
    }
    
    if (!donationForm.pickupDate.trim()) {
      errors.pickupDate = 'Pickup date is required';
    }
    
    if (!donationForm.pickupTime.trim()) {
      errors.pickupTime = 'Pickup time is required';
    }
    
    if (!donationForm.contactPhone.trim()) {
      errors.contactPhone = 'Contact phone is required';
    } else if (!/^\+?[0-9]{10,12}$/.test(donationForm.contactPhone.trim())) {
      errors.contactPhone = 'Please enter a valid phone number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle donation form submission
  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please log in to donate food');
      navigate('/login', { state: { from: '/food-donation' } });
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await foodDonationService.submitDonation({
        ...donationForm,
        driveId: selectedDrive.id,
        userId: currentUser.id,
        status: 'pending'
      });
      
      setDonationForm({
        foodType: '',
        quantity: '',
        pickupAddress: '',
        pickupDate: '',
        pickupTime: '',
        description: '',
        contactPhone: currentUser?.phone || '',
        eventName: ''
      });
      setShowDonationForm(false);
    } catch (error) {
      console.error('Error submitting donation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle drive selection
  const handleDriveSelect = (drive) => {
    setSelectedDrive(drive);
    setShowDonationForm(true);
    
    if (currentUser?.phone) {
      setDonationForm(prev => ({
        ...prev,
        contactPhone: currentUser.phone
      }));
    }
    
    setTimeout(() => {
      document.getElementById('donation-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Add map toggle button to the existing JSX
  const mapToggleButton = (
    <Button
      variant="secondary"
      onClick={() => setShowMap(!showMap)}
      className="mb-6 flex items-center"
    >
      <MapIcon className="h-5 w-5 mr-2" />
      {showMap ? 'Hide Map' : 'Show Map'}
    </Button>
  );

  // Add map container to the existing JSX
  const mapContainer = showMap && (
    <div className="mb-12 rounded-lg overflow-hidden shadow-lg">
      <div id="donation-map" className="w-full h-[400px]"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {location.state?.fromEvent && (
        <Button
          variant="text"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Event
        </Button>
      )}
      
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">
          {location.state?.fromEvent 
            ? `Donate Food from ${location.state.eventName}` 
            : 'Donate Extra Food'}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
          {location.state?.fromEvent
            ? 'Help reduce food waste by donating leftover food from your event to NGOs in need.'
            : 'Help reduce food waste and feed those in need by donating your extra food to NGOs organizing food donation drives.'}
        </p>
      </div>
      
      {mapToggleButton}
      {mapContainer}
      
      {/* Food Donation Drives */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">Ongoing Food Donation Drives</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-lg dark:bg-dark-300"></div>
                <div className="bg-white p-6 rounded-b-lg shadow-md space-y-3 dark:bg-dark-100">
                  <div className="h-6 bg-gray-200 rounded dark:bg-dark-300"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 dark:bg-dark-300"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-dark-300"></div>
                  <div className="h-10 bg-gray-200 rounded dark:bg-dark-300"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foodDrives.map(drive => (
              <Card key={drive.id} className="overflow-hidden h-full flex flex-col">
                <div 
                  className="h-48 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${drive.image})` }}
                ></div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">{drive.title}</h3>
                  <p className="text-sm text-primary-600 mb-3 dark:text-primary-400">{drive.organization}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start">
                      <MapPinIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5 dark:text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">{drive.location}</p>
                    </div>
                    <div className="flex items-start">
                      <CalendarIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5 dark:text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">{drive.date}</p>
                    </div>
                    <div className="flex items-start">
                      <ClockIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5 dark:text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">{drive.time}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 dark:text-gray-300">{drive.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      <span>{drive.peopleHelped} people helped</span>
                    </div>
                    <Button 
                      variant="primary"
                      onClick={() => handleDriveSelect(drive)}
                    >
                      Donate
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Donation Form */}
      {showDonationForm && selectedDrive && (
        <div id="donation-form" className="bg-gray-50 rounded-lg p-6 mb-12 dark:bg-dark-200">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Donate to {selectedDrive.organization}</h2>
              <Badge variant="primary" className="flex items-center">
                <HeartIcon className="h-4 w-4 mr-1" />
                Food Drive
              </Badge>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-dark-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Drive Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                  <p className="text-base text-gray-900 dark:text-white">{selectedDrive.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</p>
                  <p className="text-base text-gray-900 dark:text-white">{selectedDrive.date} • {selectedDrive.time}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Person</p>
                  <p className="text-base text-gray-900 dark:text-white">{selectedDrive.contactPerson}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Phone</p>
                  <p className="text-base text-gray-900 dark:text-white">{selectedDrive.contactPhone}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500 mb-2 dark:text-gray-400">Accepted Food Items</p>
                <div className="flex flex-wrap gap-2">
                  {selectedDrive.acceptedItems.map((item, index) => (
                    <Badge key={index} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {location.state?.fromEvent && (
              <div className="bg-primary-50 p-4 rounded-lg mb-6 dark:bg-primary-900 dark:bg-opacity-20">
                <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
                  You're donating leftover food from the event: <span className="font-bold">{location.state.eventName}</span>
                </p>
              </div>
            )}
            
            <form onSubmit={handleDonationSubmit}>
              <div className="bg-white p-6 rounded-lg shadow-md dark:bg-dark-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Donation Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="foodType" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      Food Type*
                    </label>
                    <select
                      id="foodType"
                      name="foodType"
                      value={donationForm.foodType}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:bg-dark-300 dark:border-dark-400 dark:text-white ${
                        formErrors.foodType ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                    >
                      <option value="">Select food type</option>
                      <option value="Cooked Meals">Cooked Meals</option>
                      <option value="Fresh Produce">Fresh Produce</option>
                      <option value="Packaged Food">Packaged Food</option>
                      <option value="Dry Rations">Dry Rations</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Restaurant Surplus">Restaurant Surplus</option>
                      <option value="Event Leftovers">Event Leftovers</option>
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.foodType && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.foodType}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      Quantity* (approx. servings or weight)
                    </label>
                    <input
                      type="text"
                      id="quantity"
                      name="quantity"
                      value={donationForm.quantity}
                      onChange={handleInputChange}
                      placeholder="e.g., 10 servings, 5 kg"
                      className={`block w-full rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:bg-dark-300 dark:border-dark-400 dark:text-white ${
                        formErrors.quantity ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                    />
                    {formErrors.quantity && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.quantity}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      Pickup Address*
                    </label>
                    <input
                      type="text"
                      id="pickupAddress"
                      name="pickupAddress"
                      value={donationForm.pickupAddress}
                      onChange={handleInputChange}
                      placeholder="Enter the address for food pickup"
                      className={`block w-full rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:bg-dark-300 dark:border-dark-400 dark:text-white ${
                        formErrors.pickupAddress ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                    />
                    {formErrors.pickupAddress && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.pickupAddress}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      Pickup Date*
                    </label>
                    <input
                      type="date"
                      id="pickupDate"
                      name="pickupDate"
                      value={donationForm.pickupDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`block w-full rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:bg-dark-300 dark:border-dark-400 dark:text-white ${
                        formErrors.pickupDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                    />
                    {formErrors.pickupDate && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.pickupDate}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      Pickup Time*
                    </label>
                    <input
                      type="time"
                      id="pickupTime"
                      name="pickupTime"
                      value={donationForm.pickupTime}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:bg-dark-300 dark:border-dark-400 dark:text-white ${
                        formErrors.pickupTime ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                    />
                    {formErrors.pickupTime && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.pickupTime}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      Description (Optional)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={donationForm.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Additional details about the food (e.g., preparation time, special handling instructions)"
                      className="block w-full rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:bg-dark-300 dark:border-dark-400 dark:text-white"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      Contact Phone*
                    </label>
                    <input
                      type="tel"
                      id="contactPhone"
                      name="contactPhone"
                      value={donationForm.contactPhone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className={`block w-full rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:bg-dark-300 dark:border-dark-400 dark:text-white ${
                        formErrors.contactPhone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                    />
                    {formErrors.contactPhone && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.contactPhone}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowDonationForm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Donation'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Impact Section */}
      <div className="bg-primary-50 rounded-lg p-8 dark:bg-primary-900 dark:bg-opacity-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">Make an Impact with Your Food Donation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-dark-100">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-primary-900 dark:bg-opacity-30">
                <ShoppingBagIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">Reduce Food Waste</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Help reduce the 1.3 billion tons of food wasted globally each year by donating your excess food.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-dark-100">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-primary-900 dark:bg-opacity-30">
                <UserGroupIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">Feed the Hungry</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your donation can provide nutritious meals to those who might otherwise go hungry.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-dark-100">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-primary-900 dark:bg-opacity-30">
                <HeartIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">Support Communities</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Strengthen local communities by supporting NGOs and their vital food distribution programs.
              </p>
            </div>
          </div>
          
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              if (foodDrives.length > 0) {
                handleDriveSelect(foodDrives[0]);
              }
            }}
            className="flex items-center mx-auto"
          >
            Donate Now
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoodDonationPage; 