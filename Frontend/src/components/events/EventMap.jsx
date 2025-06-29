import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPinIcon } from '@heroicons/react/24/solid';
import MAP_CONFIG from '../../config/mapConfig';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const EventMap = ({ events = [], selectedEvent, onSelectEvent }) => {
  // Center map on selected event or default location
  const center = selectedEvent && selectedEvent.latitude && selectedEvent.longitude
    ? [selectedEvent.latitude, selectedEvent.longitude]
    : MAP_CONFIG.DEFAULT_CENTER;
  
  // Filter events that have coordinates
  const eventsWithCoordinates = events.filter(event => 
    event.latitude && event.longitude
  );

  return (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden h-[500px] border border-gray-300">
      <MapContainer 
        center={center} 
        zoom={selectedEvent ? 13 : MAP_CONFIG.DEFAULT_ZOOM} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url={MAP_CONFIG.TILE_LAYER}
          attribution={MAP_CONFIG.ATTRIBUTION}
        />
        
        {eventsWithCoordinates.map((event) => (
          <Marker 
            key={event.id} 
            position={[event.latitude, event.longitude]}
            eventHandlers={{
              click: () => onSelectEvent && onSelectEvent(event),
            }}
          >
            <Popup>
              <div className="p-2">
                <h5 className="font-medium text-gray-900">{event.title}</h5>
                <p className="text-sm text-gray-500">{event.location}</p>
                <button 
                  className="mt-2 text-sm text-primary-600 hover:text-primary-800"
                  onClick={() => onSelectEvent && onSelectEvent(event)}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Event list sidebar */}
      {events.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-md">
          <h4 className="font-medium text-gray-900 mb-2">Nearby Events</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {events.slice(0, 3).map((event) => (
              <div 
                key={event.id}
                className={`p-2 rounded-md cursor-pointer ${
                  selectedEvent && selectedEvent.id === event.id 
                    ? 'bg-primary-50 border border-primary-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelectEvent && onSelectEvent(event)}
              >
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium text-gray-900">{event.title}</h5>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                </div>
              </div>
            ))}
            {events.length > 3 && (
              <p className="text-sm text-gray-500 text-center pt-1">
                + {events.length - 3} more events
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventMap; 