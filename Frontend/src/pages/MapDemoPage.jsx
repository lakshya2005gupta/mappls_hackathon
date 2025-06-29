import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, MapPinIcon, AdjustmentsHorizontalIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const MapDemoPage = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [mapControls, setMapControls] = useState({
    zoom: 12,
    showTraffic: false,
    mapType: 'standard'
  });
  
  // IITD coordinates (IIT Delhi)
  const defaultLocation = {
    latitude: 28.5459,
    longitude: 77.1926,
    name: "IIT Delhi"
  };
  
  // List of POIs around IITD
  const pointsOfInterest = [
    { id: 1, name: "IIT Delhi Main Building", lat: 28.5459, lng: 77.1926 },
    { id: 2, name: "Hauz Khas Village", lat: 28.5535, lng: 77.1964 },
    { id: 3, name: "Qutub Minar", lat: 28.5245, lng: 77.1855 },
    { id: 4, name: "Green Park Market", lat: 28.5589, lng: 77.2068 },
    { id: 5, name: "Deer Park", lat: 28.5559, lng: 77.1988 }
  ];
  
  useEffect(() => {
    // Function to initialize the map
    const initializeMap = () => {
      try {
        if (!window.mappls) {
          setMapError('Mappls SDK not loaded properly');
          return;
        }
        
        const mapContainer = document.getElementById('advanced-map-container');
        if (!mapContainer) return;
        
        // Create map instance with more options
        const map = new window.mappls.Map('advanced-map-container', {
          center: [defaultLocation.longitude, defaultLocation.latitude],
          zoom: mapControls.zoom,
          zoomControl: false, // We'll add custom controls
          location: true,
          geolocation: false,
          clickableIcons: true,
          mapType: mapControls.mapType
        });
        
        map.on('load', () => {
          setIsMapLoaded(true);
          
          // Add markers for all POIs
          const newMarkers = pointsOfInterest.map(poi => {
            return new window.mappls.Marker({
              map: map,
              position: [poi.lng, poi.lat],
              popupHtml: `<div><strong>${poi.name}</strong></div>`,
              draggable: false,
              fitbounds: false
            });
          });
          
          setMarkers(newMarkers);
          
          // Add a circle around IITD
          new window.mappls.Circle({
            map: map,
            center: [defaultLocation.longitude, defaultLocation.latitude],
            radius: 1000, // 1km radius
            strokeColor: '#3498db',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#3498db',
            fillOpacity: 0.2
          });
        });
        
        // Listen for zoom changes
        map.addListener('zoom_changed', () => {
          setMapControls(prev => ({
            ...prev,
            zoom: map.getZoom()
          }));
        });
        
        mapRef.current = map;
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(`Error creating map: ${error.message}`);
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
    
    // Cleanup function
    return () => {
      if (mapRef.current) {
        // Clean up markers
        markers.forEach(marker => {
          if (marker) marker.remove();
        });
        
        // Remove the map
        if (mapRef.current.remove) {
          mapRef.current.remove();
        }
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array to run only once on mount
  
  // Handle zoom in
  const handleZoomIn = () => {
    if (mapRef.current) {
      const newZoom = Math.min(mapRef.current.getZoom() + 1, 18);
      mapRef.current.setZoom(newZoom);
      setMapControls(prev => ({ ...prev, zoom: newZoom }));
    }
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    if (mapRef.current) {
      const newZoom = Math.max(mapRef.current.getZoom() - 1, 4);
      mapRef.current.setZoom(newZoom);
      setMapControls(prev => ({ ...prev, zoom: newZoom }));
    }
  };
  
  // Toggle traffic layer
  const toggleTraffic = () => {
    if (mapRef.current) {
      const newTrafficState = !mapControls.showTraffic;
      
      if (newTrafficState) {
        // Add traffic layer
        if (window.mappls.trafficLayer) {
          const trafficLayer = new window.mappls.trafficLayer({
            map: mapRef.current
          });
          mapRef.current.trafficLayer = trafficLayer;
        }
      } else {
        // Remove traffic layer
        if (mapRef.current.trafficLayer) {
          mapRef.current.trafficLayer.setMap(null);
          mapRef.current.trafficLayer = null;
        }
      }
      
      setMapControls(prev => ({ ...prev, showTraffic: newTrafficState }));
    }
  };
  
  // Change map type
  const changeMapType = (type) => {
    if (mapRef.current) {
      mapRef.current.setMapTypeId(type);
      setMapControls(prev => ({ ...prev, mapType: type }));
    }
  };
  
  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Mappls Map Demo</h1>
          </div>
          <div>
            <span className="text-sm text-gray-500">Using IIT Delhi as default location</span>
          </div>
        </div>
      </div>
      
      <div className="flex-grow relative">
        {mapError && (
          <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10">
            <div className="text-center p-4 bg-white rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="mt-2 text-red-600">{mapError}</p>
            </div>
          </div>
        )}
        
        {!isMapLoaded && !mapError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div className="text-center">
              <MapPinIcon className="h-12 w-12 text-primary-500 mx-auto animate-bounce" />
              <p className="mt-2 text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
          {/* Zoom Controls */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button 
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-100 w-10 h-10 flex items-center justify-center border-b border-gray-200"
            >
              <PlusIcon className="h-5 w-5 text-gray-600" />
            </button>
            <button 
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-100 w-10 h-10 flex items-center justify-center"
            >
              <MinusIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          {/* Map Type Controls */}
          <div className="bg-white rounded-lg shadow-md p-2">
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => changeMapType('standard')}
                className={`px-3 py-1 text-sm rounded ${mapControls.mapType === 'standard' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
              >
                Standard
              </button>
              <button 
                onClick={() => changeMapType('hybrid')}
                className={`px-3 py-1 text-sm rounded ${mapControls.mapType === 'hybrid' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
              >
                Hybrid
              </button>
              <button 
                onClick={() => changeMapType('satellite')}
                className={`px-3 py-1 text-sm rounded ${mapControls.mapType === 'satellite' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
              >
                Satellite
              </button>
            </div>
          </div>
          
          {/* Traffic Toggle */}
          <Button 
            variant={mapControls.showTraffic ? "primary" : "secondary"}
            onClick={toggleTraffic}
            className="flex items-center justify-center"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-1" />
            Traffic
          </Button>
        </div>
        
        {/* POI List */}
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-md p-3 max-w-xs">
          <h3 className="font-medium text-gray-900 mb-2">Points of Interest</h3>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {pointsOfInterest.map(poi => (
              <div 
                key={poi.id}
                className="text-sm p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center"
                onClick={() => {
                  if (mapRef.current) {
                    mapRef.current.setCenter([poi.lng, poi.lat]);
                    mapRef.current.setZoom(15);
                  }
                }}
              >
                <MapPinIcon className="h-4 w-4 text-primary-500 mr-2" />
                {poi.name}
              </div>
            ))}
          </div>
        </div>
        
        <div 
          id="advanced-map-container" 
          className="w-full h-full"
          style={{ position: 'relative' }}
        ></div>
      </div>
    </div>
  );
};

export default MapDemoPage; 