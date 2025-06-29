import axios from 'axios';
import { toast } from 'react-hot-toast';

// Fix the API_BASE_URL to avoid process.env reference error
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:5000/api';

class FoodDonationService {
  async getFoodDrives() {
    try {
      // For development, return mock data instead of making an API call
      // In production, uncomment the API call
      // const response = await axios.get(`${API_BASE_URL}/food-drives`);
      // return response.data;
      return mockFoodDrives;
    } catch (error) {
      console.error('Error fetching food drives:', error);
      toast.error('Failed to fetch food drives');
      return [];
    }
  }

  async submitDonation(donationData) {
    try {
      // For development, simulate API call
      // In production, uncomment the API call
      // const response = await axios.post(`${API_BASE_URL}/food-donations`, donationData);
      // return response.data;
      
      // Simulate successful response
      toast.success('Food donation submitted successfully!');
      return { success: true, id: Math.random().toString(36).substr(2, 9) };
    } catch (error) {
      console.error('Error submitting donation:', error);
      toast.error('Failed to submit donation');
      throw error;
    }
  }

  async getDonationsByUser(userId) {
    try {
      // For development, simulate API call
      // In production, uncomment the API call
      // const response = await axios.get(`${API_BASE_URL}/food-donations/user/${userId}`);
      // return response.data;
      
      // Return empty array for now
      return [];
    } catch (error) {
      console.error('Error fetching user donations:', error);
      toast.error('Failed to fetch your donations');
      return [];
    }
  }

  async updateDonationStatus(donationId, status) {
    try {
      // For development, simulate API call
      // In production, uncomment the API call
      // const response = await axios.patch(`${API_BASE_URL}/food-donations/${donationId}/status`, { status });
      // return response.data;
      
      // Simulate successful response
      toast.success('Donation status updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Error updating donation status:', error);
      toast.error('Failed to update donation status');
      throw error;
    }
  }

  async getNearbyDrives(latitude, longitude, radius = 5000) {
    try {
      // For development, return mock data instead of making an API call
      // In production, uncomment the API call
      // const response = await axios.get(`${API_BASE_URL}/food-drives/nearby`, {
      //   params: {
      //     latitude,
      //     longitude,
      //     radius // in meters
      //   }
      // });
      // return response.data;
      
      // Return mock data for now
      return mockFoodDrives;
    } catch (error) {
      console.error('Error fetching nearby drives:', error);
      toast.error('Failed to fetch nearby food drives');
      return [];
    }
  }
}

// Mock food donation drives for development
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

export default new FoodDonationService(); 