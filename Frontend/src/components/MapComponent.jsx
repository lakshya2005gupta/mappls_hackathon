import { useEffect, useRef, useState } from 'react';

function MapComponent({ selectedEvent, onMarkerClick }) {
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [markers, setMarkers] = useState([]);
  
  // IITD coordinates (IIT Delhi)
  const defaultLocation = {
    latitude: 28.5459,
    longitude: 77.1926,
    name: "IIT Delhi"
  };
  
  useEffect(() => {
    // Function to initialize the map
    const initializeMap = () => {
      try {
        if (!window.mappls) {
          setMapError('Mappls SDK not loaded properly');
          return;
        }
        
        const mapContainer = document.getElementById('map-container');
        if (!mapContainer) return;
        
        // Create map instance
        const map = new window.mappls.Map('map-container', {
          center: [defaultLocation.longitude, defaultLocation.latitude], // Note: Mappls uses [lng, lat] format
          zoom: 12,
          zoomControl: true,
          location: true,
          geolocation: false // Disable geolocation as requested
        });
        
        map.on('load', () => {
          setIsMapLoaded(true);
          
          // Add a default marker for IITD
          const marker = new window.mappls.Marker({
            map: map,
            position: [defaultLocation.longitude, defaultLocation.latitude],
            popupHtml: `<div><strong>${defaultLocation.name}</strong></div>`,
            draggable: false,
            fitbounds: true
          });
          
          setMarkers([marker]);
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
  
  // Effect to update markers when selectedEvent changes
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    
    // Clear existing markers
    markers.forEach(marker => {
      if (marker) marker.remove();
    });
    
    const newMarkers = [];
    
    // Add marker for selected event if available
    if (selectedEvent && selectedEvent.latitude && selectedEvent.longitude) {
      const eventMarker = new window.mappls.Marker({
        map: mapRef.current,
        position: [selectedEvent.longitude, selectedEvent.latitude],
        popupHtml: `<div><strong>${selectedEvent.title}</strong><p>${selectedEvent.location}</p></div>`,
        draggable: false,
        fitbounds: true
      });
      
      eventMarker.addListener('click', () => {
        if (onMarkerClick) onMarkerClick(selectedEvent);
      });
      
      newMarkers.push(eventMarker);
      
      // Center map on selected event
      mapRef.current.setCenter([selectedEvent.longitude, selectedEvent.latitude]);
      mapRef.current.setZoom(14);
    } else {
      // If no event selected, show default marker
      const defaultMarker = new window.mappls.Marker({
        map: mapRef.current,
        position: [defaultLocation.longitude, defaultLocation.latitude],
        popupHtml: `<div><strong>${defaultLocation.name}</strong></div>`,
        draggable: false,
        fitbounds: true
      });
      
      newMarkers.push(defaultMarker);
      
      // Reset to default view
      mapRef.current.setCenter([defaultLocation.longitude, defaultLocation.latitude]);
      mapRef.current.setZoom(12);
    }
    
    setMarkers(newMarkers);
  }, [selectedEvent, isMapLoaded]);
  
  return (
    <div className="relative w-full h-full">
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-500 mx-auto animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="mt-2 text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      
      <div 
        id="map-container" 
        className="w-full h-full"
        style={{ position: 'relative' }}
      ></div>
    </div>
  );
}

export default MapComponent; 