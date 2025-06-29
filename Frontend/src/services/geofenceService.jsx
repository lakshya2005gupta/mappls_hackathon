import { toast } from 'react-hot-toast';
import { MapPinIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

class GeofenceService {
  constructor() {
    this.watchId = null;
    this.events = [];
    this.notifiedEvents = new Set();
    this.trafficNotifiedEvents = new Set();
    this.geofenceRadius = 5000; // 5km in meters
    this.trafficNotificationRadius = 10000; // 10km in meters
    this.apiKey = "18daea6d89db814ff7c19493a8a9509c"; // Your Mappls API key
    this.userLocation = null;
    this.userDestination = null;
    this.lastTrafficCheck = null;
    this.trafficCheckInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  // Initialize the service with events data
  init(events) {
    this.events = events.filter(event => event.latitude && event.longitude).map(event => ({
      ...event,
      // Convert string coordinates to numbers if needed
      latitude: typeof event.latitude === 'string' ? parseFloat(event.latitude) : event.latitude,
      longitude: typeof event.longitude === 'string' ? parseFloat(event.longitude) : event.longitude,
      // Add estimated attendance for traffic calculation
      estimatedAttendance: event.attendees || 50,
      // Add traffic impact level (1-5)
      trafficImpact: this.calculateTrafficImpact(event)
    }));
    
    this.startWatching();
  }

  // Calculate traffic impact level based on event properties
  calculateTrafficImpact(event) {
    // Base impact on attendees
    let impact = 1;
    
    const attendees = event.attendees || 50;
    
    if (attendees > 500) impact = 5;
    else if (attendees > 300) impact = 4;
    else if (attendees > 200) impact = 3;
    else if (attendees > 100) impact = 2;
    
    // Adjust based on event category if available
    if (event.category) {
      const highTrafficCategories = ['Sports', 'Community', 'Fundraising'];
      if (highTrafficCategories.includes(event.category)) {
        impact = Math.min(impact + 1, 5);
      }
    }
    
    return impact;
  }

  // Start watching user location
  startWatching() {
    if (navigator.geolocation) {
      this.watchId = navigator.geolocation.watchPosition(
        this.handlePositionUpdate.bind(this),
        this.handleError.bind(this),
        {
          enableHighAccuracy: true,
          maximumAge: 30000, // 30 seconds
          timeout: 27000 // 27 seconds
        }
      );
    }
  }

  // Stop watching user location
  stopWatching() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Set user destination for route planning
  setDestination(latitude, longitude, name) {
    this.userDestination = {
      latitude,
      longitude,
      name: name || 'Destination'
    };
    
    // Check for traffic immediately when destination is set
    if (this.userLocation) {
      this.checkTrafficAlongRoute();
    }
  }

  // Handle position updates
  handlePositionUpdate(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    
    // Update user location
    this.userLocation = {
      latitude: userLat,
      longitude: userLng,
      timestamp: new Date()
    };
    
    // Check if user is near any events
    this.events.forEach(event => {
      const distance = this.calculateDistance(
        userLat, userLng,
        event.latitude, event.longitude
      );
      
      // If user is within geofence radius and hasn't been notified yet
      if (distance <= this.geofenceRadius && !this.notifiedEvents.has(event.id)) {
        this.notifyUserAboutEvent(event, distance);
        this.notifiedEvents.add(event.id);
      }
    });
    
    // Check for traffic if we have a destination and it's time to check
    if (this.userDestination && this.shouldCheckTraffic()) {
      this.checkTrafficAlongRoute();
    }
  }

  // Determine if it's time to check traffic
  shouldCheckTraffic() {
    if (!this.lastTrafficCheck) return true;
    
    const now = new Date();
    return (now - this.lastTrafficCheck) > this.trafficCheckInterval;
  }

  // Check for traffic along the route to destination
  checkTrafficAlongRoute() {
    if (!this.userLocation || !this.userDestination) return;
    
    this.lastTrafficCheck = new Date();
    
    // Find events that might affect the route
    const eventsAlongRoute = this.findEventsAlongRoute();
    
    // Notify about traffic if events are found
    if (eventsAlongRoute.length > 0) {
      this.notifyAboutTraffic(eventsAlongRoute);
    }
  }

  // Find events that might affect the route
  findEventsAlongRoute() {
    if (!this.userLocation || !this.userDestination) return [];
    
    // Simple algorithm to find events near the route:
    // 1. Create a bounding box between user location and destination
    // 2. Expand it by the traffic notification radius
    // 3. Find events within this box
    // 4. Filter by distance to the straight line between points
    
    const bounds = this.createBoundingBox(
      this.userLocation.latitude, this.userLocation.longitude,
      this.userDestination.latitude, this.userDestination.longitude,
      this.trafficNotificationRadius
    );
    
    return this.events.filter(event => {
      // Check if event is within the bounding box
      if (event.latitude < bounds.minLat || event.latitude > bounds.maxLat ||
          event.longitude < bounds.minLng || event.longitude > bounds.maxLng) {
        return false;
      }
      
      // Check if event is happening today or tomorrow
      const eventDate = new Date(event.date);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const isRelevantDate = 
        eventDate.toDateString() === today.toDateString() || 
        eventDate.toDateString() === tomorrow.toDateString();
      
      if (!isRelevantDate) return false;
      
      // Check if we've already notified about this event's traffic
      if (this.trafficNotifiedEvents.has(event.id)) return false;
      
      // Calculate distance to the route line
      const distanceToRoute = this.calculateDistanceToRoute(
        event.latitude, event.longitude,
        this.userLocation.latitude, this.userLocation.longitude,
        this.userDestination.latitude, this.userDestination.longitude
      );
      
      // Return true if the event is close enough to the route
      return distanceToRoute <= this.trafficNotificationRadius;
    });
  }

  // Create a bounding box between two points, expanded by a buffer
  createBoundingBox(lat1, lng1, lat2, lng2, buffer) {
    const bufferDegrees = buffer / 111000; // Approximate conversion from meters to degrees
    
    return {
      minLat: Math.min(lat1, lat2) - bufferDegrees,
      maxLat: Math.max(lat1, lat2) + bufferDegrees,
      minLng: Math.min(lng1, lng2) - bufferDegrees,
      maxLng: Math.max(lng1, lng2) + bufferDegrees
    };
  }

  // Calculate the shortest distance from a point to a line segment
  calculateDistanceToRoute(pointLat, pointLng, lineLat1, lineLng1, lineLat2, lineLng2) {
    // Convert to Cartesian coordinates for simplicity
    // This is an approximation that works for short distances
    const x = (pointLng - lineLng1) * Math.cos((pointLat + lineLat1) / 2);
    const y = pointLat - lineLat1;
    
    const dx = (lineLng2 - lineLng1) * Math.cos((lineLat2 + lineLat1) / 2);
    const dy = lineLat2 - lineLat1;
    
    const lineLength = Math.sqrt(dx*dx + dy*dy);
    
    // If line length is zero, return distance to the point
    if (lineLength === 0) {
      return this.calculateDistance(pointLat, pointLng, lineLat1, lineLng1);
    }
    
    // Calculate the projection of the point onto the line
    const t = Math.max(0, Math.min(1, (x*dx + y*dy) / (lineLength*lineLength)));
    
    // Calculate the closest point on the line
    const projLng = lineLng1 + t * dx;
    const projLat = lineLat1 + t * dy;
    
    // Return the distance to the closest point
    return this.calculateDistance(pointLat, pointLng, projLat, projLng);
  }

  // Notify user about traffic due to events
  notifyAboutTraffic(events) {
    // Sort events by traffic impact
    const sortedEvents = [...events].sort((a, b) => b.trafficImpact - a.trafficImpact);
    
    // Take the top 3 events with highest impact
    const topEvents = sortedEvents.slice(0, 3);
    
    // Mark these events as notified
    topEvents.forEach(event => {
      this.trafficNotifiedEvents.add(event.id);
    });
    
    // Create notification message
    const eventCount = topEvents.length;
    const mainEvent = topEvents[0];
    const impactLevel = this.getTrafficImpactText(mainEvent.trafficImpact);
    
    toast(
      (t) => (
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Traffic Alert!</h4>
            <p className="text-sm text-gray-600 mt-1">
              {eventCount > 1 
                ? `${mainEvent.title} and ${eventCount - 1} other event${eventCount > 2 ? 's' : ''} may cause ${impactLevel} traffic on your route.`
                : `${mainEvent.title} may cause ${impactLevel} traffic on your route.`
              }
            </p>
            <div className="mt-2 flex space-x-3">
              <button 
                onClick={() => {
                  window.location.href = `/events/${mainEvent.id}`;
                  toast.dismiss(t.id);
                }}
                className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
              >
                <MapPinIcon className="h-4 w-4 mr-1" />
                View Event
              </button>
              <button 
                onClick={() => {
                  window.location.href = `/TrafficCongestion`;
                  toast.dismiss(t.id);
                }}
                className="text-sm text-amber-600 hover:text-amber-800 flex items-center"
              >
                <ArrowPathIcon className="h-4 w-4 mr-1" />
                Find Alternate Route
              </button>
            </div>
          </div>
        </div>
      ),
      {
        duration: 10000,
      }
    );
    
    // Also send an email notification if email service is available
    this.sendTrafficEmail(topEvents);
  }

  // Get descriptive text for traffic impact level
  getTrafficImpactText(impactLevel) {
    switch(impactLevel) {
      case 5: return 'severe';
      case 4: return 'heavy';
      case 3: return 'moderate';
      case 2: return 'light';
      default: return 'potential';
    }
  }

  // Send email notification about traffic
  sendTrafficEmail(events) {
    // This would connect to your email service
    // For now, we'll just log to console
    console.log('Would send traffic email about:', events);
    
    // In a real implementation, you would call your backend API:
    /*
    fetch('/api/notifications/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'traffic',
        events: events,
        userLocation: this.userLocation,
        userDestination: this.userDestination
      }),
    });
    */
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance; // in meters
  }

  // Notify user about nearby event
  notifyUserAboutEvent(event, distance) {
    const distanceInKm = (distance / 1000).toFixed(1);
    
    toast(
      (t) => (
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <MapPinIcon className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Event Nearby!</h4>
            <p className="text-sm text-gray-600 mt-1">
              {event.title} is happening {distanceInKm}km from your location.
            </p>
            <button 
              onClick={() => {
                window.location.href = `/events/${event.id}`;
                toast.dismiss(t.id);
              }}
              className="mt-2 text-sm text-primary-600 hover:text-primary-800"
            >
              View Details
            </button>
          </div>
        </div>
      ),
      {
        duration: 8000,
      }
    );
  }

  // Handle errors
  handleError(error) {
    console.error("Geolocation error:", error);
  }
}

export default new GeofenceService(); 