import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);
  
  // Register a new user
  const register = async (userData) => {
    try {
      // In a real app, you would call an API endpoint
      // For now, we'll simulate a successful registration
      
      // Create a user object with the provided data
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        location: userData.location,
        joinedDate: new Date().toISOString().split('T')[0],
        points: 0,
        level: 1,
        badges: [],
        achievements: [],
        eventsAttended: [],
        upcomingEvents: [],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`,
      };
      
      // Store the user in localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Update the current user state
      setCurrentUser(newUser);
      
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Failed to register. Please try again.');
    }
  };
  
  // Login a user
  const login = async (email, password) => {
    try {
      // In a real app, you would call an API endpoint
      // For now, we'll simulate a successful login
      
      // For demo purposes, we'll check if the email is admin@example.com
      // and password is password123
      if (email === 'admin@example.com' && password === 'password123') {
        const adminUser = {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          location: 'Delhi, India',
          joinedDate: '2023-01-01',
          points: 500,
          level: 5,
          badges: [
            { name: 'Admin', date: '2023-01-01' },
            { name: 'Super Volunteer', date: '2023-02-15' },
          ],
          achievements: [],
          eventsAttended: [],
          upcomingEvents: [],
          avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=random',
          isAdmin: true,
        };
        
        // Store the user in localStorage
        localStorage.setItem('user', JSON.stringify(adminUser));
        
        // Update the current user state
        setCurrentUser(adminUser);
        
        return adminUser;
      }
      
      // For any other email/password, we'll create a demo user
      const demoUser = {
        id: '2',
        name: 'Demo User',
        email: email,
        location: 'Mumbai, India',
        joinedDate: new Date().toISOString().split('T')[0],
        points: 100,
        level: 2,
        badges: [
          { name: 'New User', date: new Date().toISOString().split('T')[0] },
        ],
        achievements: [],
        eventsAttended: [],
        upcomingEvents: [],
        avatar: `https://ui-avatars.com/api/?name=Demo+User&background=random`,
      };
      
      // Store the user in localStorage
      localStorage.setItem('user', JSON.stringify(demoUser));
      
      // Update the current user state
      setCurrentUser(demoUser);
      
      return demoUser;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Failed to login. Please check your credentials and try again.');
    }
  };
  
  // Logout a user
  const logout = () => {
    // Remove the user from localStorage
    localStorage.removeItem('user');
    
    // Update the current user state
    setCurrentUser(null);
    
    // Show a success message
    toast.success('Logged out successfully');
  };
  
  // Update user profile
  const updateProfile = async (userData) => {
    try {
      // In a real app, you would call an API endpoint
      // For now, we'll update the user in localStorage
      
      // Create an updated user object
      const updatedUser = {
        ...currentUser,
        ...userData,
      };
      
      // Store the updated user in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update the current user state
      setCurrentUser(updatedUser);
      
      // Show a success message
      toast.success('Profile updated successfully');
      
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error('Failed to update profile. Please try again.');
    }
  };
  
  // Register for an event
  const registerForEvent = async (event) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to register for an event');
      }
      
      // Check if the user is already registered for this event
      const isAlreadyRegistered = currentUser.upcomingEvents?.some(e => e.id === event.id);
      
      if (isAlreadyRegistered) {
        throw new Error('You are already registered for this event');
      }
      
      // Add the event to the user's upcoming events
      const updatedUpcomingEvents = [...(currentUser.upcomingEvents || []), {
        id: event.id,
        title: event.title,
        date: event.date,
        image: event.image,
      }];
      
      // Create an updated user object
      const updatedUser = {
        ...currentUser,
        upcomingEvents: updatedUpcomingEvents,
      };
      
      // Store the updated user in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update the current user state
      setCurrentUser(updatedUser);
      
      // Show a success message
      toast.success(`Registered for ${event.title} successfully`);
      
      return updatedUser;
    } catch (error) {
      console.error('Register for event error:', error);
      throw error;
    }
  };
  
  // Value to be provided by the context
  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    updateProfile,
    registerForEvent,
    isAuthenticated: !!currentUser,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 