# NGO Event App Backend

This is the backend API for the NGO Event App, which provides functionality for managing events, registrations, geofencing, and notifications.

## Geofencing System

The geofencing system allows NGOs to create virtual boundaries around their event locations. This enables:

1. **Location-based notifications**: Users receive notifications when they enter the vicinity of an event.
2. **Traffic management**: The system can detect if a user's route passes through event areas and provide traffic impact alerts.
3. **Event discovery**: Users can find events near their current location.

### Geofence Model

Each geofence includes:
- Reference to an event
- Radius (in meters)
- Center coordinates (latitude and longitude)
- Active status
- Traffic impact details (level and description)
- Notification settings

### Geofencing API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/geofencing | Get all geofences | Private/Admin |
| GET | /api/geofencing/:id | Get single geofence | Private |
| POST | /api/geofencing | Create new geofence | Private/Admin |
| PUT | /api/geofencing/:id | Update geofence | Private/Admin |
| DELETE | /api/geofencing/:id | Delete geofence | Private/Admin |
| GET | /api/geofencing/radius/:latitude/:longitude/:distance | Get geofences within radius | Public |
| POST | /api/geofencing/check | Check if point is inside geofence | Public |
| POST | /api/geofencing/traffic-impact | Get traffic impact for a route | Public |

## Notification System

The notification system keeps users informed about events and traffic conditions:

1. **Geofence entry notifications**: Alerts when users enter event areas.
2. **Traffic alerts**: Warnings about potential traffic issues along planned routes.
3. **Event reminders**: Notifications about upcoming registered events.
4. **System notifications**: General app announcements.

### Notification Model

Each notification includes:
- User reference
- Optional event reference
- Type (geofence_entry, traffic_alert, event_reminder, etc.)
- Title and message
- Read status
- Additional data (JSON)

### Notification API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/notifications | Get user's notifications | Private |
| GET | /api/notifications/:id | Get single notification | Private |
| POST | /api/notifications | Create notification (admin) | Private/Admin |
| PUT | /api/notifications/:id/read | Mark notification as read | Private |
| DELETE | /api/notifications/:id | Delete notification | Private |
| POST | /api/notifications/geofence-entry | Create geofence entry notification | Public |
| POST | /api/notifications/traffic-alert | Create traffic alert notification | Public |

## Implementation Details

### Geofence Detection

The system uses the Haversine formula to calculate distances between coordinates, allowing it to:
- Determine if a user is inside a geofence
- Check if a route passes through a geofence
- Find events within a specified radius

### Traffic Impact Analysis

When a user plans a route:
1. The system checks if the route intersects with any active geofences
2. It calculates the overall traffic impact based on individual geofence impacts
3. It generates appropriate notifications with alternative route suggestions

## Usage Examples

### Check if User is in Geofence

```javascript
// Request
POST /api/notifications/geofence-entry
{
  "userId": "60d0fe4f5311236168a109ca",
  "latitude": 37.7749,
  "longitude": -122.4194
}

// Response
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "60d0fe4f5311236168a109cb",
      "user": "60d0fe4f5311236168a109ca",
      "event": {
        "_id": "60d0fe4f5311236168a109cc",
        "title": "Beach Cleanup"
      },
      "type": "geofence_entry",
      "title": "Event Nearby",
      "message": "You are near Beach Cleanup event. It starts at 10:00 AM on 7/15/2023.",
      "read": false,
      "createdAt": "2023-07-10T15:46:51.778Z"
    }
  ]
}
```

### Get Traffic Impact for Route

```javascript
// Request
POST /api/geofencing/traffic-impact
{
  "route": [
    {
      "latitude": 37.7749,
      "longitude": -122.4194
    },
    {
      "latitude": 37.7833,
      "longitude": -122.4167
    }
  ]
}

// Response
{
  "success": true,
  "count": 1,
  "overallImpact": "medium",
  "data": [
    {
      "_id": "60d0fe4f5311236168a109cd",
      "event": {
        "_id": "60d0fe4f5311236168a109ce",
        "title": "Marathon"
      },
      "trafficImpact": {
        "level": "medium",
        "description": "Several roads closed from 8 AM to 2 PM"
      }
    }
  ]
}
``` 