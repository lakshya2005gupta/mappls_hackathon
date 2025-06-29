const Notification = require('../models/Notification');
const User = require('../models/User');
const Geofence = require('../models/Geofence');
const { ErrorResponse, asyncHandler } = require('../middleware/errorMiddleware');

/**
 * @desc    Get all notifications for a user
 * @route   GET /api/notifications
 * @access  Private
 */
const getUserNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate({
      path: 'event',
      select: 'title date location'
    });

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications
  });
});

/**
 * @desc    Get a single notification
 * @route   GET /api/notifications/:id
 * @access  Private
 */
const getNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404);
  }

  // Make sure the notification belongs to the user
  if (notification.user.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ErrorResponse(
      `User ${req.user.id} is not authorized to access this notification`,
      403
    );
  }

  res.status(200).json({
    success: true,
    data: notification
  });
});

/**
 * @desc    Create a new notification
 * @route   POST /api/notifications
 * @access  Private/Admin
 */
const createNotification = asyncHandler(async (req, res) => {
  // Check if user exists
  const user = await User.findById(req.body.user);

  if (!user) {
    throw new ErrorResponse(`User not found with id of ${req.body.user}`, 404);
  }

  const notification = await Notification.create(req.body);

  res.status(201).json({
    success: true,
    data: notification
  });
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
const markAsRead = asyncHandler(async (req, res) => {
  let notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404);
  }

  // Make sure the notification belongs to the user
  if (notification.user.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ErrorResponse(
      `User ${req.user.id} is not authorized to update this notification`,
      403
    );
  }

  notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { read: true },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: notification
  });
});

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404);
  }

  // Make sure the notification belongs to the user
  if (notification.user.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ErrorResponse(
      `User ${req.user.id} is not authorized to delete this notification`,
      403
    );
  }

  await notification.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Create geofence entry notification
 * @route   POST /api/notifications/geofence-entry
 * @access  Public
 */
const createGeofenceEntryNotification = asyncHandler(async (req, res) => {
  const { userId, latitude, longitude } = req.body;

  if (!userId || !latitude || !longitude) {
    throw new ErrorResponse('Please provide userId, latitude and longitude', 400);
  }

  // Check if user exists
  const user = await User.findById(userId);

  if (!user) {
    throw new ErrorResponse(`User not found with id of ${userId}`, 404);
  }

  // Find all active geofences
  const geofences = await Geofence.find({ active: true }).populate({
    path: 'event',
    select: 'title date time location'
  });

  // Check if user is inside any geofence
  const insideGeofences = geofences.filter(geofence => {
    // Calculate distance between user and geofence center
    const distance = calculateDistance(
      latitude,
      longitude,
      geofence.center.latitude,
      geofence.center.longitude
    );

    // Check if distance is less than radius (in meters)
    return distance <= geofence.radius;
  });

  // Create notifications for each geofence the user is inside
  const notifications = [];

  for (const geofence of insideGeofences) {
    // Check if a notification for this geofence and user already exists in the last 24 hours
    const existingNotification = await Notification.findOne({
      user: userId,
      event: geofence.event._id,
      type: 'geofence_entry',
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (!existingNotification) {
      const notification = await Notification.create({
        user: userId,
        event: geofence.event._id,
        type: 'geofence_entry',
        title: 'Event Nearby',
        message: geofence.notifications.message || `You are near ${geofence.event.title} event. It starts at ${geofence.event.time} on ${new Date(geofence.event.date).toLocaleDateString()}.`,
        data: {
          geofenceId: geofence._id,
          eventId: geofence.event._id,
          trafficImpact: geofence.trafficImpact
        }
      });

      notifications.push(notification);
    }
  }

  res.status(201).json({
    success: true,
    count: notifications.length,
    data: notifications
  });
});

/**
 * @desc    Create traffic alert notification
 * @route   POST /api/notifications/traffic-alert
 * @access  Public
 */
const createTrafficAlertNotification = asyncHandler(async (req, res) => {
  const { userId, route } = req.body;

  if (!userId || !route || !Array.isArray(route) || route.length < 2) {
    throw new ErrorResponse('Please provide userId and a valid route with at least 2 points', 400);
  }

  // Check if user exists
  const user = await User.findById(userId);

  if (!user) {
    throw new ErrorResponse(`User not found with id of ${userId}`, 404);
  }

  // Find all active geofences
  const geofences = await Geofence.find({ active: true }).populate({
    path: 'event',
    select: 'title date time location'
  });

  // Check if route passes through any geofence
  const impactedGeofences = [];

  for (const geofence of geofences) {
    // Check if any point in the route is inside the geofence
    for (let i = 0; i < route.length - 1; i++) {
      const point1 = route[i];
      const point2 = route[i + 1];

      // Check if line segment intersects with geofence
      if (
        lineIntersectsCircle(
          point1.latitude,
          point1.longitude,
          point2.latitude,
          point2.longitude,
          geofence.center.latitude,
          geofence.center.longitude,
          geofence.radius
        )
      ) {
        impactedGeofences.push(geofence);
        break; // No need to check other segments for this geofence
      }
    }
  }

  // Create notifications for each impacted geofence
  const notifications = [];

  for (const geofence of impactedGeofences) {
    // Check if a notification for this geofence and user already exists in the last 2 hours
    const existingNotification = await Notification.findOne({
      user: userId,
      event: geofence.event._id,
      type: 'traffic_alert',
      createdAt: { $gte: new Date(Date.now() - 2 * 60 * 60 * 1000) }
    });

    if (!existingNotification) {
      const notification = await Notification.create({
        user: userId,
        event: geofence.event._id,
        type: 'traffic_alert',
        title: 'Traffic Alert',
        message: `Your route passes through ${geofence.event.title} event area. Traffic impact: ${geofence.trafficImpact.level}. ${geofence.trafficImpact.description}`,
        data: {
          geofenceId: geofence._id,
          eventId: geofence.event._id,
          trafficImpact: geofence.trafficImpact
        }
      });

      notifications.push(notification);
    }
  }

  res.status(201).json({
    success: true,
    count: notifications.length,
    data: notifications
  });
});

/**
 * Helper function to calculate distance between two points using Haversine formula
 * @param {Number} lat1 Latitude of point 1
 * @param {Number} lon1 Longitude of point 1
 * @param {Number} lat2 Latitude of point 2
 * @param {Number} lon2 Longitude of point 2
 * @returns {Number} Distance in meters
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
};

/**
 * Helper function to check if a line segment intersects with a circle
 * @param {Number} x1 Latitude of point 1
 * @param {Number} y1 Longitude of point 1
 * @param {Number} x2 Latitude of point 2
 * @param {Number} y2 Longitude of point 2
 * @param {Number} cx Circle center latitude
 * @param {Number} cy Circle center longitude
 * @param {Number} r Circle radius in meters
 * @returns {Boolean} True if line intersects circle
 */
const lineIntersectsCircle = (x1, y1, x2, y2, cx, cy, r) => {
  // Convert to meters for calculation
  const point1 = { lat: x1, lon: y1 };
  const point2 = { lat: x2, lon: y2 };
  const center = { lat: cx, lon: cy };

  // Check if either endpoint is inside the circle
  const d1 = calculateDistance(point1.lat, point1.lon, center.lat, center.lon);
  const d2 = calculateDistance(point2.lat, point2.lon, center.lat, center.lon);

  if (d1 <= r || d2 <= r) {
    return true;
  }

  // Calculate the shortest distance from the line segment to the circle center
  const len = calculateDistance(point1.lat, point1.lon, point2.lat, point2.lon);
  
  // If length is 0, we've already checked the endpoints
  if (len === 0) {
    return false;
  }

  // Calculate the dot product
  const dot =
    ((center.lat - point1.lat) * (point2.lat - point1.lat) +
      (center.lon - point1.lon) * (point2.lon - point1.lon)) /
    Math.pow(len, 2);

  // Find the closest point on the line segment
  const closestPoint = {
    lat: point1.lat + dot * (point2.lat - point1.lat),
    lon: point1.lon + dot * (point2.lon - point1.lon)
  };

  // Check if the closest point is on the line segment
  if (dot < 0 || dot > 1) {
    return false;
  }

  // Calculate distance from closest point to circle center
  const distance = calculateDistance(
    closestPoint.lat,
    closestPoint.lon,
    center.lat,
    center.lon
  );

  return distance <= r;
};

module.exports = {
  getUserNotifications,
  getNotification,
  createNotification,
  markAsRead,
  deleteNotification,
  createGeofenceEntryNotification,
  createTrafficAlertNotification
}; 