import React, { useState, useEffect } from 'react';
import { MapPinIcon, ArrowPathIcon, TruckIcon, ClockIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { mockEvents } from '../utils/mockData';
import geofenceService from '../services/geofenceService';
import { toast } from 'react-hot-toast';

const TrafficCongestion = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);

  // Initialize map and get user location
  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(userPos);
          
          // Set default origin to user's location
          setOrigin(`${userPos.latitude},${userPos.longitude}`);
        },
        (error) => {
          console.error('Error fetching location:', error);
          toast.error('Could not get your location. Please enter it manually.');
        }
      );
    }

    // Initialize map if Mappls is available
    const initializeMap = () => {
      if (!window.mappls) {
        console.error('Mappls SDK not loaded');
        return;
      }

      try {
        const mapInstance = new window.mappls.Map('traffic-map', {
          center: [77.1926, 28.5459], // Default to IITD
          zoom: 12,
          zoomControl: true,
          location: true,
          geolocation: false
        });

        mapInstance.on('load', () => {
          setMapLoaded(true);
          setMap(mapInstance);
        });
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    // Check if Mappls SDK is already loaded
    if (window.mappls && window.mapplsInitializeComplete) {
      initializeMap();
    } else {
      // Set up a listener for when the SDK is loaded
      const originalCallback = window.mapplsInitialize;
      window.mapplsInitialize = function() {
        if (originalCallback) originalCallback();
        window.mapplsInitializeComplete = true;
        initializeMap();
      };
    }

    // Cleanup
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Find nearby events when user location changes
  useEffect(() => {
    if (userLocation) {
      // Find events near the user's location
      const events = mockEvents.filter(event => {
        if (!event.latitude || !event.longitude) return false;
        
        const distance = geofenceService.calculateDistance(
          userLocation.latitude, userLocation.longitude,
          event.latitude, event.longitude
        );
        
        // Return events within 10km
        return distance <= 10000;
      });
      
      setNearbyEvents(events);
    }
  }, [userLocation]);

  // Update map when routes or selected route changes
  useEffect(() => {
    if (!map || !mapLoaded || routes.length === 0) return;
    
    // Clear existing routes
    if (map.getLayer && map.getLayer('route-layer')) {
      map.removeLayer('route-layer');
    }
    if (map.getSource && map.getSource('route-source')) {
      map.removeSource('route-source');
    }
    
    // Draw the selected route or the first route
    const routeToShow = selectedRoute || routes[0];
    
    if (routeToShow && routeToShow.geometry) {
      try {
        // Add the route to the map
        map.addSource('route-source', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: routeToShow.geometry
          }
        });
        
        map.addLayer({
          id: 'route-layer',
          type: 'line',
          source: 'route-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 6,
            'line-opacity': 0.8
          }
        });
        
        // Fit the map to the route bounds
        if (routeToShow.bounds) {
          map.fitBounds(routeToShow.bounds, {
            padding: 50
          });
        }
      } catch (error) {
        console.error('Error adding route to map:', error);
      }
    }
    
    // Add markers for origin and destination
    if (routeToShow && routeToShow.waypoints) {
      const originPoint = routeToShow.waypoints[0];
      const destPoint = routeToShow.waypoints[routeToShow.waypoints.length - 1];
      
      // Add origin marker
      new window.mappls.Marker({
        map: map,
        position: [originPoint.longitude, originPoint.latitude],
        popupHtml: '<div><strong>Starting Point</strong></div>'
      });
      
      // Add destination marker
      new window.mappls.Marker({
        map: map,
        position: [destPoint.longitude, destPoint.latitude],
        popupHtml: '<div><strong>Destination</strong></div>'
      });
    }
    
    // Add markers for nearby events
    nearbyEvents.forEach(event => {
      if (!event.latitude || !event.longitude) return;
      
      new window.mappls.Marker({
        map: map,
        position: [event.longitude, event.latitude],
        popupHtml: `<div><strong>${event.title}</strong><p>${event.date}</p></div>`
      });
    });
  }, [map, mapLoaded, routes, selectedRoute, nearbyEvents]);

  // Handle route search
  const handleSearch = async () => {
    if (!origin || !destination) {
      toast.error('Please enter both origin and destination');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real implementation, you would call the Mappls Routing API
      // For now, we'll simulate the API response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Parse coordinates
      let originCoords, destCoords;
      
      if (origin.includes(',')) {
        const [lat, lng] = origin.split(',').map(coord => parseFloat(coord.trim()));
        originCoords = { latitude: lat, longitude: lng };
      } else {
        // Default to IITD if coordinates not provided
        originCoords = { latitude: 28.5459, longitude: 77.1926 };
      }
      
      if (destination.includes(',')) {
        const [lat, lng] = destination.split(',').map(coord => parseFloat(coord.trim()));
        destCoords = { latitude: lat, longitude: lng };
      } else {
        // Default to a location near IITD if coordinates not provided
        destCoords = { latitude: 28.6139, longitude: 77.2090 };
      }
      
      // Set destination in geofence service for traffic alerts
      if (destCoords) {
        geofenceService.setDestination(destCoords.latitude, destCoords.longitude, 'Destination');
      }
      
      // Generate mock routes
      const mockRoutes = generateMockRoutes(originCoords, destCoords);
      setRoutes(mockRoutes);
      setSelectedRoute(mockRoutes[0]);
      
      // Check for events along the route
      const eventsAlongRoute = findEventsAlongRoute(originCoords, destCoords);
      if (eventsAlongRoute.length > 0) {
        toast((t) => (
          <div>
            <h3 className="font-medium">Events along your route</h3>
            <p className="text-sm mt-1">
              {eventsAlongRoute.length} event{eventsAlongRoute.length > 1 ? 's' : ''} may cause traffic delays
            </p>
          </div>
        ));
      }
    } catch (error) {
      console.error('Error searching for routes:', error);
      toast.error('Failed to find routes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate mock routes between two points
  const generateMockRoutes = (origin, destination) => {
    if (!origin || !destination) {
      return [];
    }
    
    // Create three mock routes with different characteristics
    return [
      {
        id: 'route-1',
        name: 'Fastest Route',
        distance: 8.5, // km
        duration: 25, // minutes
        trafficLevel: 'moderate',
        waypoints: [
          { latitude: origin.latitude, longitude: origin.longitude },
          { latitude: origin.latitude + 0.01, longitude: origin.longitude + 0.01 },
          { latitude: destination.latitude, longitude: destination.longitude }
        ],
        geometry: {
          type: 'LineString',
          coordinates: [
            [origin.longitude, origin.latitude],
            [origin.longitude + 0.01, origin.latitude + 0.01],
            [destination.longitude, destination.latitude]
          ]
        },
        bounds: [
          [Math.min(origin.longitude, destination.longitude) - 0.01, Math.min(origin.latitude, destination.latitude) - 0.01],
          [Math.max(origin.longitude, destination.longitude) + 0.01, Math.max(origin.latitude, destination.latitude) + 0.01]
        ]
      },
      {
        id: 'route-2',
        name: 'Shortest Route',
        distance: 7.2, // km
        duration: 32, // minutes
        trafficLevel: 'heavy',
        waypoints: [
          { latitude: origin.latitude, longitude: origin.longitude },
          { latitude: origin.latitude - 0.005, longitude: origin.longitude + 0.015 },
          { latitude: destination.latitude, longitude: destination.longitude }
        ],
        geometry: {
          type: 'LineString',
          coordinates: [
            [origin.longitude, origin.latitude],
            [origin.longitude + 0.015, origin.latitude - 0.005],
            [destination.longitude, destination.latitude]
          ]
        },
        bounds: [
          [Math.min(origin.longitude, destination.longitude) - 0.01, Math.min(origin.latitude, destination.latitude) - 0.01],
          [Math.max(origin.longitude, destination.longitude) + 0.01, Math.max(origin.latitude, destination.latitude) + 0.01]
        ]
      },
      {
        id: 'route-3',
        name: 'Alternate Route',
        distance: 9.8, // km
        duration: 28, // minutes
        trafficLevel: 'light',
        waypoints: [
          { latitude: origin.latitude, longitude: origin.longitude },
          { latitude: origin.latitude + 0.02, longitude: origin.longitude - 0.01 },
          { latitude: destination.latitude, longitude: destination.longitude }
        ],
        geometry: {
          type: 'LineString',
          coordinates: [
            [origin.longitude, origin.latitude],
            [origin.longitude - 0.01, origin.latitude + 0.02],
            [destination.longitude, destination.latitude]
          ]
        },
        bounds: [
          [Math.min(origin.longitude, destination.longitude) - 0.02, Math.min(origin.latitude, destination.latitude) - 0.01],
          [Math.max(origin.longitude, destination.longitude) + 0.01, Math.max(origin.latitude, destination.latitude) + 0.02]
        ]
      }
    ];
  };

  // Find events along a route
  const findEventsAlongRoute = (origin, destination) => {
    if (!origin || !destination || !nearbyEvents.length) {
      return [];
    }
    
    return nearbyEvents.filter(event => {
      if (!event.latitude || !event.longitude) return false;
      
      // Calculate distance to the route line
      const distanceToRoute = calculateDistanceToRoute(
        event.latitude, event.longitude,
        origin.latitude, origin.longitude,
        destination.latitude, destination.longitude
      );
      
      // Return events within 2km of the route
      return distanceToRoute <= 2000;
    });
  };

  // Calculate the shortest distance from a point to a line segment
  const calculateDistanceToRoute = (pointLat, pointLng, lineLat1, lineLng1, lineLat2, lineLng2) => {
    // Convert to Cartesian coordinates for simplicity
    // This is an approximation that works for short distances
    const x = (pointLng - lineLng1) * Math.cos((pointLat + lineLat1) / 2);
    const y = pointLat - lineLat1;
    
    const dx = (lineLng2 - lineLng1) * Math.cos((lineLat2 + lineLat1) / 2);
    const dy = lineLat2 - lineLat1;
    
    const lineLength = Math.sqrt(dx*dx + dy*dy);
    
    // If line length is zero, return distance to the point
    if (lineLength === 0) {
      return geofenceService.calculateDistance(pointLat, pointLng, lineLat1, lineLng1);
    }
    
    // Calculate the projection of the point onto the line
    const t = Math.max(0, Math.min(1, (x*dx + y*dy) / (lineLength*lineLength)));
    
    // Calculate the closest point on the line
    const projLng = lineLng1 + t * dx;
    const projLat = lineLat1 + t * dy;
    
    // Return the distance to the closest point
    return geofenceService.calculateDistance(pointLat, pointLng, projLat, projLng);
  };

  // Get color for traffic level
  const getTrafficColor = (level) => {
    switch (level) {
      case 'light': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'heavy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 dark:text-white">Traffic Route Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Search and Routes */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Find Alternate Routes</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="origin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Starting Point
                  </label>
                  <input
                    id="origin"
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Enter location or coordinates"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-dark-300 dark:border-dark-400 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Destination
                  </label>
                  <input
                    id="destination"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter location or coordinates"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-dark-300 dark:border-dark-400 dark:text-white"
                  />
                </div>
                
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? 'Searching...' : 'Find Routes'}
                </Button>
              </div>
            </div>
          </Card>
          
          {routes.length > 0 && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Available Routes</h2>
                
                <div className="space-y-4">
                  {routes.map((route) => (
                    <div 
                      key={route.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedRoute && selectedRoute.id === route.id 
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 dark:bg-opacity-20' 
                          : 'border-gray-200 hover:border-primary-300 dark:border-dark-400 dark:hover:border-primary-700'
                      }`}
                      onClick={() => setSelectedRoute(route)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium dark:text-white">{route.name}</h3>
                          <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <TruckIcon className="h-4 w-4 mr-1" />
                            <span>{route.distance} km</span>
                            <span className="mx-2">•</span>
                            <ClockIcon className="h-4 w-4 mr-1" />
                            <span>{route.duration} min</span>
                          </div>
                        </div>
                        <Badge 
                          variant={
                            route.trafficLevel === 'light' ? 'success' : 
                            route.trafficLevel === 'moderate' ? 'warning' : 'danger'
                          }
                        >
                          {route.trafficLevel.charAt(0).toUpperCase() + route.trafficLevel.slice(1)} Traffic
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
          
          {nearbyEvents.length > 0 && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Events Near You</h2>
                
                <div className="space-y-4">
                  {nearbyEvents.slice(0, 3).map((event) => (
                    <div 
                      key={event.id}
                      className="p-4 border border-gray-200 rounded-lg dark:border-dark-400"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium dark:text-white">{event.title}</h3>
                        <Badge variant={event.trafficImpact > 3 ? 'danger' : event.trafficImpact > 1 ? 'warning' : 'info'}>
                          {event.trafficImpact > 3 ? 'High Impact' : event.trafficImpact > 1 ? 'Medium Impact' : 'Low Impact'}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{event.date} • {event.location}</p>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-500 line-clamp-2">{event.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
        
        {/* Right Column - Map */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="p-6 h-full">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Route Map</h2>
              
              <div className="relative h-[600px] rounded-lg overflow-hidden">
                {!mapLoaded && (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center dark:bg-dark-300">
                    <div className="text-center">
                      <MapPinIcon className="h-12 w-12 text-primary-500 mx-auto animate-bounce dark:text-primary-400" />
                      <p className="mt-2 text-gray-600 dark:text-gray-400">Loading map...</p>
                    </div>
                  </div>
                )}
                
                <div 
                  id="traffic-map" 
                  className="w-full h-full"
                  style={{ position: 'relative' }}
                ></div>
              </div>
              
              {selectedRoute && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg dark:bg-dark-300">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium dark:text-white">{selectedRoute.name}</h3>
                      <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <span>{selectedRoute.distance} km</span>
                        <span className="mx-2">•</span>
                        <span>{selectedRoute.duration} min</span>
                        <span className="mx-2">•</span>
                        <span className={getTrafficColor(selectedRoute.trafficLevel)}>
                          {selectedRoute.trafficLevel.charAt(0).toUpperCase() + selectedRoute.trafficLevel.slice(1)} Traffic
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => {
                        // In a real app, this would start navigation
                        toast.success('Navigation started!');
                      }}
                    >
                      Start Navigation
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrafficCongestion;