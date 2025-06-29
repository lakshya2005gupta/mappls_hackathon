import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import MapPage from './pages/MapPage';
import MapDemoPage from './pages/MapDemoPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import FoodDonationPage from './pages/FoodDonationPage';
import { mockEvents } from './utils/mockData';
import geofenceService from './services/geofenceService';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ThemeToggle from './components/ui/ThemeToggle';

import TrafficCongestion from './pages/TrafficRouteManagement';
import ImpactTrackingScreen from './Impact';
import Chatbot from './components/Chatbot';

function App() {
  useEffect(() => {
    // Initialize geofencing with mock events
    geofenceService.init(mockEvents);
    
    // Clean up when component unmounts
    return () => {
      geofenceService.stopWatching();
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: 'dark:bg-dark-200 dark:text-gray-100',
              duration: 3000,
            }}
          />
          <ThemeToggle />
          <Chatbot />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Routes with layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="events/:id" element={<EventDetailPage />} />
              <Route path="map" element={<MapPage />} />
              <Route path="map-demo" element={<MapDemoPage />} />
              <Route path="food-donation" element={<FoodDonationPage />} />
              <Route path='/TrafficCongestion' element={<TrafficCongestion/>}/>
              
              {/* Protected routes */}
              <Route 
                path="profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;



// src/App.jsx
// import React, { useEffect, useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { ARButton, XR, useHitTest } from '@react-three/xr';
// import axios from 'axios';

// const MAPPLS_API_KEY = '18daea6d89db814ff7c19493a8a9509c'; // Replace with your Mappls API Key

// const App = () => {
//   const [userLocation, setUserLocation] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [map, setMap] = useState(null);

//   useEffect(() => {
//     // Initialize Mappls Map
//     const initializeMap = () => {
//       const mapInstance = new window.Mappls.Map('map', {
//         center: [77.209, 28.6139], // Default to New Delhi
//         zoom: 14,
//       });
//       setMap(mapInstance);
//     };

//     // Fetch User Location
//     const fetchUserLocation = () => {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setUserLocation({ latitude, longitude });
//           map.setView([latitude, longitude], 14);
//           fetchNearbyEvents(latitude, longitude);
//         },
//         (error) => console.error('Error fetching user location:', error),
//         { enableHighAccuracy: true }
//       );
//     };

//     // Fetch Nearby Events
//     const fetchNearbyEvents = async (latitude, longitude) => {
//       const url = `https://apis.mappls.com/advancedmaps/v1/${MAPPLS_API_KEY}/nearby_search`;
//       const params = {
//         keywords: 'events',
//         refLocation: `${latitude},${longitude}`,
//         radius: 5000, // in meters
//       };

//       try {
//         const response = await axios.get(url, { params });
//         setEvents(response.data.results);
//         addEventMarkers(response.data.results);
//       } catch (error) {
//         console.error('Error fetching nearby events:', error);
//       }
//     };

//     // Add Event Markers to Map
//     const addEventMarkers = (events) => {
//       events.forEach((event) => {
//         const marker = new window.Mappls.Marker({
//           position: [event.latitude, event.longitude],
//         }).addTo(map);
//         marker.bindPopup(`<b>${event.poi}</b><br>${event.address}`);
//       });
//     };

//     if (!map) {
//       initializeMap();
//     }

//     if (map && !userLocation) {
//       fetchUserLocation();
//     }
//   }, [map, userLocation]);

//   return (
//     <div className="h-screen w-full flex flex-col">
//       <div id="map" className="w-full h-1/2"></div>
//       <div className="w-full h-1/2 flex flex-col items-center justify-center bg-gray-900 text-white">
//         <h1 className="text-2xl font-bold mb-4">AR Navigation with Events</h1>
//         {userLocation ? (
//           <>
//             <p>Your Location: {userLocation.latitude}, {userLocation.longitude}</p>
//             <ARButton />
//             <Canvas style={{ height: '70vh', width: '100%' }}>
//               <XR>
//                 <ambientLight />
//                 <pointLight position={[10, 10, 10]} />
//                 <HitTestExample />
//               </XR>
//             </Canvas>
//           </>
//         ) : (
//           <p>Loading location...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// const HitTestExample = () => {
//   const ref = React.useRef();
//   useHitTest((hit) => {
//     hit.decompose(ref.current.position, ref.current.rotation, ref.current.scale);
//   });

//   return (
//     <mesh ref={ref}>
//       <boxBufferGeometry args={[0.1, 0.1, 0.1]} />
//       <meshStandardMaterial color="orange" />
//     </mesh>
//   );
// };

// export default App;
