import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CalendarIcon, 
  MapPinIcon, 
  UserGroupIcon, 
  TrophyIcon,
  ArrowRightIcon,
  GiftIcon,
  HeartIcon,
  StarIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';
import EventCard from '../components/events/EventCard';
import Button from '../components/ui/Button';
import { mockEvents } from '../utils/mockData';
import { useTheme } from '../context/ThemeContext';

const HomePage = () => {
  // Get featured events (first 3)
  const featuredEvents = mockEvents.slice(0, 3);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if Leaflet is available
    setMapLoaded(typeof window !== 'undefined' && window.L);
    
    // Initialize Leaflet map if available
    if (typeof window !== 'undefined' && window.L) {
      const homeMap = window.L.map('home-map').setView([20.5937, 78.9629], 5);
      
      // Add tile layer with dark mode support
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        className: darkMode ? 'dark-tiles' : ''
      }).addTo(homeMap);
      
      // Add markers for featured events
      featuredEvents.forEach(event => {
        if (event.latitude && event.longitude) {
          window.L.marker([event.latitude, event.longitude])
            .addTo(homeMap)
            .bindPopup(`
              <div>
                <h5 class="font-medium">${event.title}</h5>
                <p class="text-sm">${event.location}</p>
                <a href="/events/${event.id}" class="text-primary-600">View Details</a>
              </div>
            `);
        }
      });
      
      // Clean up on unmount
      return () => {
        homeMap.remove();
      };
    }
  }, [darkMode, featuredEvents]);
  
  // Add a new useEffect to simulate data loading
  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Show loading state for 1.5 seconds
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />
      
      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-200 transition-colors duration-300 relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute top-0 left-0 w-32 h-32 text-primary-200 opacity-20 animate-float-slow" viewBox="0 0 200 200" fill="currentColor">
            <path d="M44.1,-76.8C58.4,-69.8,72,-59.9,79.7,-46.4C87.4,-32.9,89.3,-16.4,88.6,-0.4C87.9,15.6,84.7,31.2,76.7,44.3C68.7,57.4,55.9,68,41.8,75.8C27.7,83.6,13.8,88.5,-0.2,88.8C-14.2,89.1,-28.4,84.8,-41.2,77.1C-54,69.4,-65.4,58.3,-73.4,44.9C-81.4,31.5,-86,15.7,-86.2,-0.1C-86.4,-15.9,-82.2,-31.9,-73.6,-45.3C-65,-58.7,-52,-69.6,-37.9,-76.5C-23.8,-83.4,-11.9,-86.3,1.6,-89C15.1,-91.7,29.8,-83.8,44.1,-76.8Z" transform="translate(100 100)" />
          </svg>
          <svg className="absolute bottom-0 right-0 w-40 h-40 text-primary-200 opacity-20 animate-float-medium" viewBox="0 0 200 200" fill="currentColor">
            <path d="M38.5,-66.2C50.5,-60.1,61.3,-50.5,68.9,-38.7C76.5,-26.9,80.8,-13.5,81.2,0.2C81.6,14,78.1,27.9,70.8,39.7C63.5,51.5,52.4,61.1,39.8,67.3C27.2,73.5,13.6,76.3,-0.2,76.6C-13.9,76.9,-27.9,74.8,-40.1,68.7C-52.4,62.6,-63,52.5,-70.2,40.1C-77.4,27.7,-81.2,13.8,-81.1,0C-81,-13.7,-77,-27.5,-69.8,-39.2C-62.6,-50.9,-52.2,-60.6,-40,-65.8C-27.8,-71,-13.9,-71.7,-0.2,-71.4C13.5,-71.1,26.5,-72.3,38.5,-66.2Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white animate-slide-up">How It Works</h2>
            <p className="mt-4 text-xl text-gray-800 dark:text-gray-200 animate-slide-up delay-200">Simple steps to get involved and make a difference</p>
            
            <div className="w-24 h-1 bg-primary-500 mx-auto mt-6 animate-scale-x"></div>
          </div>
          
          {/* Process steps with connecting lines */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-primary-200 dark:bg-primary-800 transform -translate-y-1/2 z-0"></div>
            
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {[
                {
                  icon: <UserGroupIcon className="h-10 w-10 text-white" />,
                  title: "Join the Community",
                  description: "Create an account and become part of our growing community of volunteers and supporters.",
                  color: "from-primary-500 to-primary-600",
                  number: "01"
                },
                {
                  icon: <CalendarIcon className="h-10 w-10 text-white" />,
                  title: "Find Events",
                  description: "Browse upcoming events by location, cause, or organization and find opportunities that match your interests.",
                  color: "from-primary-600 to-primary-700",
                  number: "02"
                },
                {
                  icon: <HandRaisedIcon className="h-10 w-10 text-white" />,
                  title: "Participate & Share",
                  description: "Register for events, volunteer your time, and share events with friends to increase impact.",
                  color: "from-primary-700 to-primary-800",
                  number: "03"
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-dark-100 rounded-xl p-8 shadow-lg transition-all duration-500 hover:shadow-2xl group animate-fade-in"
                  style={{ animationDelay: `${(index + 1) * 200}ms` }}
                >
                  <div className="relative">
                    {/* Step number */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gray-100 dark:bg-dark-300 flex items-center justify-center text-xl font-bold text-primary-600 dark:text-primary-400 border-2 border-primary-200 dark:border-primary-800 group-hover:scale-110 transition-transform duration-300">
                      {item.number}
                    </div>
                    
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center p-4 rounded-full mb-6 bg-gradient-to-r ${item.color} transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      {item.icon}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">{item.title}</h3>
                    <p className="text-gray-800 dark:text-gray-200">{item.description}</p>
                    
                    {/* Action button */}
                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Link 
                        to={index === 0 ? "/register" : index === 1 ? "/events" : "/contact"} 
                        className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium"
                      >
                        Get Started
                        <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Call to action */}
          <div className="mt-16 text-center animate-fade-in delay-700">
            <div className="inline-block bg-gradient-to-r from-primary-500 to-primary-700 p-px rounded-lg shadow-lg transform transition-transform hover:scale-105">
              <div className="bg-white dark:bg-dark-100 rounded-lg px-8 py-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ready to make a difference?</h3>
                <p className="text-gray-800 dark:text-gray-200 mb-4">Join our community today and start your journey of positive impact.</p>
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center mx-auto"
                >
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  Join Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Events Section */}
      <section className="py-20 bg-white dark:bg-dark-100 transition-colors duration-300 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-primary-100 to-transparent dark:from-primary-900 dark:to-transparent opacity-50 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-primary-100 to-transparent dark:from-primary-900 dark:to-transparent opacity-50 rounded-tr-full"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium mb-4 animate-fade-in">UPCOMING OPPORTUNITIES</span>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-slide-up">Featured Events</h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto dark:text-gray-200 animate-slide-up delay-200">
              Discover upcoming events that are making a positive impact in communities around you.
            </p>
            <div className="w-24 h-1 bg-primary-500 mx-auto mt-6 animate-scale-x"></div>
          </div>
          
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-gray-800 dark:text-gray-200 animate-pulse">Loading amazing events...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredEvents.slice(0, 3).map((event, index) => (
                  <div 
                    key={event.id} 
                    className="transform transition-all duration-500 hover:scale-105 hover:-rotate-1 animate-fade-in"
                    style={{ animationDelay: `${(index + 1) * 200}ms` }}
                  >
                    <EventCard event={event} />
                    
                    {/* Event badge - randomly show different badges */}
                    {index === 0 && (
                      <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse-slow">
                        Popular
                      </div>
                    )}
                    {index === 1 && (
                      <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse-slow">
                        New
                      </div>
                    )}
                    {index === 2 && (
                      <div className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse-slow">
                        Last Spots
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Event categories */}
              <div className="mt-16 mb-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center animate-fade-in">Browse by Category</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    { name: "Education", icon: "🎓", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
                    { name: "Environment", icon: "🌱", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
                    { name: "Health", icon: "❤️", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
                    { name: "Community", icon: "🏘️", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
                    { name: "Arts", icon: "🎨", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" }
                  ].map((category, index) => (
                    <Link 
                      key={index} 
                      to={`/events?category=${category.name}`}
                      className={`${category.color} px-4 py-2 rounded-full font-medium flex items-center transition-all duration-300 hover:shadow-md transform hover:scale-105 animate-fade-in`}
                      style={{ animationDelay: `${(index + 1) * 100}ms` }}
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Call to action */}
              <div className="text-center mt-10 animate-fade-in delay-500">
                <Link
                  to="/events"
                  className="group inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 transform hover:scale-105"
                >
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  View All Events
                  <ArrowRightIcon className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <p className="mt-4 text-gray-700 dark:text-gray-300 text-sm animate-fade-in delay-700">
                  Join {featuredEvents.length}+ events happening in your area
                </p>
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Map Preview Section */}
      <section className="py-16 bg-gray-50 dark:bg-dark-200 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0 animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Find Events Near You</h2>
              <p className="text-xl text-gray-800 mb-6 dark:text-gray-200">
                Discover events happening in your area with our interactive map. Find opportunities to make a difference.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <MapPinIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Location-Based Discovery</h4>
                    <p className="text-gray-800 dark:text-gray-200">Find events based on your current location or search for specific areas.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CalendarIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Real-Time Updates</h4>
                    <p className="text-gray-800 dark:text-gray-200">Get notifications about new events happening near you.</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link to="/map">
                  <Button variant="primary">Explore Map</Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white p-4 rounded-lg shadow-md dark:bg-dark-100 hover-card">
                {mapLoaded ? (
                  <div className="h-80 rounded-lg overflow-hidden">
                    <div id="home-map" className="h-full w-full"></div>
                  </div>
                ) : (
                  <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center dark:bg-dark-300">
                    <div className="text-center p-6">
                      <MapPinIcon className="h-16 w-16 text-primary-500 mx-auto mb-4 animate-bounce-slow dark:text-primary-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">Interactive Map</h3>
                      <p className="text-gray-800 dark:text-gray-200">
                        Map is loading or unavailable. Check your connection.
                      </p>
                    </div>
                  </div>
                )}
                <div className="mt-4 text-center">
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Link to="/map">
                      <Button variant="primary" size="lg" className="w-full sm:w-auto">
                        <MapPinIcon className="h-5 w-5 mr-2" />
                        View Full Map
                      </Button>
                    </Link>
                    <Link to="/map-demo">
                      <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                        <MapPinIcon className="h-5 w-5 mr-2" />
                        Try Mappls Demo
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="bg-primary-700 text-white py-16 dark:bg-gradient-to-r dark:from-primary-900 dark:to-dark-300 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 animate-fade-in">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Join our community of volunteers and NGOs working together to create positive change.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/register">
              <Button 
                variant="secondary" 
                size="lg"
              >
                Sign Up Now
              </Button>
            </Link>
            <Link to="/events">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary-700 dark:hover:text-primary-900"
              >
                Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Donate Food Section */}
      <section className="py-16 bg-primary-50 dark:bg-primary-900 dark:bg-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">
                Donate Extra Food
              </h2>
              <p className="text-lg text-gray-800 mb-6 dark:text-gray-200">
                Help reduce food waste and feed those in need by donating your extra food to NGOs organizing food donation drives.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => navigate('/food-donation')}
                  className="flex items-center"
                >
                  <GiftIcon className="h-5 w-5 mr-2" />
                  Donate Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/events')}
                  className="flex items-center"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1593113598332-cd59a0c3a9a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Food donation" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-200 transition-colors duration-300 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute top-0 right-0 w-64 h-64 text-primary-200 opacity-10 animate-float-slow" viewBox="0 0 200 200" fill="currentColor">
            <path d="M48.8,-64.2C63.9,-55.7,77.2,-42.5,83.5,-26.3C89.7,-10.1,88.9,9.2,82.1,25.9C75.3,42.6,62.6,56.7,47.3,65.8C32,74.9,14.2,79,0,78.9C-14.2,78.9,-28.4,74.7,-43.2,67.1C-58,59.5,-73.3,48.4,-79.3,33.5C-85.3,18.6,-82,0,-76.1,-16.7C-70.3,-33.3,-61.9,-48,-49.4,-57.1C-36.9,-66.2,-20.2,-69.7,-2.7,-66.5C14.8,-63.3,33.7,-72.7,48.8,-64.2Z" transform="translate(100 100)" />
          </svg>
          <svg className="absolute bottom-0 left-0 w-64 h-64 text-primary-200 opacity-10 animate-float-medium" viewBox="0 0 200 200" fill="currentColor">
            <path d="M45.3,-51.2C58.3,-40.9,68.8,-25.9,72.3,-9.2C75.8,7.5,72.3,25.9,62.3,39.1C52.4,52.3,36,60.3,18.4,67.3C0.9,74.3,-17.9,80.2,-34.4,75.2C-51,70.2,-65.3,54.3,-71.1,36.5C-76.9,18.8,-74.1,-0.9,-67.7,-18.5C-61.3,-36.1,-51.3,-51.6,-38.1,-61.8C-24.9,-72,-12.5,-76.8,1.7,-78.8C15.8,-80.8,32.3,-61.5,45.3,-51.2Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium mb-4 animate-fade-in">TESTIMONIALS</span>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-slide-up">What Our Community Says</h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto dark:text-gray-200 animate-slide-up delay-200">
              Hear from volunteers and participants who have experienced the impact of our events
            </p>
            <div className="w-24 h-1 bg-primary-500 mx-auto mt-6 animate-scale-x"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Participating in these events has been life-changing. I've met amazing people and made a real difference in my community.",
                author: "Suraj Chauhan",
                role: "Volunteer",
                avatar: "",
                rating: 5
              },
              {
                quote: "The platform makes it incredibly easy to find meaningful volunteer opportunities. I've been able to contribute to causes I care about.",
                author: "Lakshay Gupta",
                role: "Regular Participant",
                avatar: "",
                rating: 5
              },
              {
                quote: "As an NGO organizer, this platform has helped us reach more volunteers and make our events more successful than ever before.",
                author: "Kavya",
                role: "NGO Director",
                avatar: "",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-dark-100 rounded-xl p-8 shadow-lg transition-all duration-500 hover:shadow-2xl group animate-fade-in relative"
                style={{ animationDelay: `${(index + 1) * 200}ms` }}
              >
                {/* Quote mark */}
                <div className="absolute -top-5 -left-5 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-serif transform group-hover:scale-110 transition-transform duration-300">
                  "
                </div>
                
                <div className="mb-6">
                  {/* Star rating */}
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-gray-900 dark:text-gray-200 italic mb-6">"{testimonial.quote}"</p>
                  
                  <div className="flex items-center">
                    {testimonial.avatar ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-primary-200 dark:border-primary-800">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</h4>
                      <p className="text-sm text-primary-600 dark:text-primary-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Stats */}
          <div className="mt-20 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 shadow-xl animate-fade-in delay-500">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "95%", label: "Satisfaction Rate" },
                { value: "10K+", label: "Volunteers" },
                { value: "500+", label: "Events Completed" },
                { value: "50+", label: "Partner NGOs" }
              ].map((stat, index) => (
                <div key={index} className="text-white">
                  <div className="text-4xl font-bold mb-2 animate-count-up">{stat.value}</div>
                  <div className="text-primary-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">Ready to join our community?</h3>
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in delay-200">
              <button 
                onClick={() => navigate('/register')}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center"
              >
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Join Now
              </button>
              <button 
                onClick={() => navigate('/events')}
                className="bg-white border-2 border-primary-600 text-primary-700 hover:bg-primary-50 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center dark:bg-transparent dark:text-white dark:border-primary-400 dark:hover:bg-primary-900"
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                Browse Events
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startCounter();
        }
      },
      { threshold: 0.1 }
    );
    
    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    
    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);
  
  const startCounter = () => {
    let start = 0;
    const end = 500;
    const duration = 2000;
    const step = Math.floor(duration / end);
    
    const timer = setInterval(() => {
      start += 5;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      }
    }, step);
  };
  
  // Array of impact statistics
  const impactStats = [
    { icon: <HeartIcon className="h-5 w-5" />, value: '25K+', label: 'Lives Impacted' },
    { icon: <CalendarIcon className="h-5 w-5" />, value: '100+', label: 'Events Organized' },
    { icon: <UserGroupIcon className="h-5 w-5" />, value: '50+', label: 'NGO Partners' },
    { icon: <StarIcon className="h-5 w-5" />, value: '15+', label: 'Cities Covered' }
  ];
  
  return (
    <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white dark:from-dark-300 dark:to-primary-900 transition-colors duration-300 relative overflow-hidden py-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white opacity-5 rounded-full animate-float-slow"></div>
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-white opacity-5 rounded-full animate-float-medium"></div>
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-white opacity-5 rounded-full animate-float-fast"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-white opacity-5 rounded-full animate-pulse"></div>
      </div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full opacity-20 animate-float-slow"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 5}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              <span className="block animate-slide-up delay-100">Making a Difference</span>
              <span className="block text-primary-200 animate-slide-up delay-300">Through Community Events</span>
            </h1>
            
            <p className="text-xl mb-8 text-primary-50 animate-fade-in delay-500">
              Join us in creating positive change through NGO events that bring communities together and address important social causes.
            </p>
            
            <div className="flex flex-wrap gap-4 animate-fade-in delay-700">
              <button 
                onClick={() => navigate('/events')}
                className="bg-white text-primary-700 hover:bg-primary-50 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center group"
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                Explore Events
                <ArrowRightIcon className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-transparent border-2 border-white hover:bg-white hover:text-primary-700 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Join Us
              </button>
            </div>
            
            <div className="mt-10 flex items-center animate-fade-in delay-900">
              <div className="flex -space-x-2 mr-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-primary-600 overflow-hidden">
                    <img 
                      src={`https://randomuser.me/api/portraits/men/${20 + i}.jpg`} 
                      alt={`User ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-primary-50">
                <span className="font-bold" ref={counterRef}>{count}+</span> volunteers joined this month
              </p>
            </div>
            
            {/* Impact statistics */}
            <div className="mt-10 grid grid-cols-2 gap-4 animate-fade-in delay-1000">
              {impactStats.map((stat, index) => (
                <div key={index} className="bg-white bg-opacity-10 rounded-lg p-3 backdrop-filter backdrop-blur-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-primary-500 rounded-full mr-3">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-xl font-bold">{stat.value}</p>
                      <p className="text-sm text-primary-200">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="relative rounded-lg overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 animate-fade-in delay-500">
              <img 
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="NGO volunteers working together" 
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900 to-transparent opacity-60"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg p-4 animate-pulse-slow">
                  <p className="text-white font-medium">
                    "Together we can make a real impact in our communities."
                  </p>
                  <p className="text-primary-50 text-sm mt-2">
                    - Community Leader
                  </p>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 bg-primary-500 rounded-lg p-4 shadow-lg animate-float-medium">
              <div className="flex items-center">
                <MapPinIcon className="h-6 w-6 text-white mr-2" />
                <span className="text-white font-medium">25+ Locations</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-primary-500 rounded-lg p-4 shadow-lg animate-float-slow">
              <div className="flex items-center">
                <CalendarIcon className="h-6 w-6 text-white mr-2" />
                <span className="text-white font-medium">100+ Events</span>
              </div>
            </div>
            
            {/* Animated dots */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary-300 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="absolute top-3/4 left-1/3 w-2 h-2 bg-primary-300 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
              <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-primary-300 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage; 