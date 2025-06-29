const Geofence = require('../models/Geofence');
const Event = require('../models/Event');
const { ErrorResponse, asyncHandler } = require('../middleware/errorMiddleware');

/**
 * @desc    Get all geofences
 * @route   GET /api/geofencing
 * @access  Private/Admin
 */
const getGeofences = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc    Get single geofence
 * @route   GET /api/geofencing/:id
 * @access  Private
 */
const getGeofence = asyncHandler(async (req, res) => {
  const geofence = await Geofence.findById(req.params.id).populate({
    path: 'event',
    select: 'title date location'
  });

  if (!geofence) {
    throw new ErrorResponse(`Geofence not found with id of ${req.params.id}`, 404);
  }

  res.status(200).json({
    success: true,
    data: geofence
  });
});

/**
 * @desc    Create new geofence
 * @route   POST /api/geofencing
 * @access  Private/Admin
 */
const createGeofence = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  // Check if event exists
  const event = await Event.findById(req.body.event);

  if (!event) {
    throw new ErrorResponse(`Event not found with id of ${req.body.event}`, 404);
  }

  // Check if geofence already exists for this event
  const existingGeofence = await Geofence.findOne({ event: req.body.event });

  if (existingGeofence) {
    throw new ErrorResponse(`Geofence already exists for this event`, 400);
  }

  const geofence = await Geofence.create(req.body);

  res.status(201).json({
    success: true,
    data: geofence
  });
});

/**
 * @desc    Update geofence
 * @route   PUT /api/geofencing/:id
 * @access  Private/Admin
 */
const updateGeofence = asyncHandler(async (req, res) => {
  let geofence = await Geofence.findById(req.params.id);

  if (!geofence) {
    throw new ErrorResponse(`Geofence not found with id of ${req.params.id}`, 404);
  }

  // Make sure user is admin or created the geofence
  if (
    geofence.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    throw new ErrorResponse(
      `User ${req.user.id} is not authorized to update this geofence`,
      403
    );
  }

  geofence = await Geofence.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: geofence
  });
});

/**
 * @desc    Delete geofence
 * @route   DELETE /api/geofencing/:id
 * @access  Private/Admin
 */
const deleteGeofence = asyncHandler(async (req, res) => {
  const geofence = await Geofence.findById(req.params.id);

  if (!geofence) {
    throw new ErrorResponse(`Geofence not found with id of ${req.params.id}`, 404);
  }

  // Make sure user is admin or created the geofence
  if (
    geofence.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    throw new ErrorResponse(
      `User ${req.user.id} is not authorized to delete this geofence`,
      403
    );
  }

  await geofence.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Get geofences within radius
 * @route   GET /api/geofencing/radius/:latitude/:longitude/:distance
 * @access  Public
 */
const getGeofencesInRadius = asyncHandler(async (req, res) => {
  const { latitude, longitude, distance } = req.params;

  // Calculate radius using radians
  // Divide distance by radius of Earth
  // Earth Radius = 6,378 km or 3,963 miles
  const radius = distance / 6378;

  const geofences = await Geofence.find({
    center: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] }
    },
    active: true
  }).populate({
    path: 'event',
    select: 'title date time status trafficImpact'
  });

  res.status(200).json({
    success: true,
    count: geofences.length,
    data: geofences
  });
});

/**
 * @desc    Check if point is inside geofence
 * @route   POST /api/geofencing/check
 * @access  Public
 */
const checkPointInGeofence = asyncHandler(async (req, res) => {
  const { latitude, longitude, eventId } = req.body;

  if (!latitude || !longitude) {
    throw new ErrorResponse('Please provide latitude and longitude', 400);
  }

  let query = { active: true };

  // If eventId is provided, check only that specific geofence
  if (eventId) {
    query.event = eventId;
  }

  // Find all active geofences
  const geofences = await Geofence.find(query).populate({
    path: 'event',
    select: 'title date time status trafficImpact'
  });

  // Check if point is inside any geofence
  const insideGeofences = geofences.filter(geofence => {
    // Calculate distance between point and geofence center
    const distance = calculateDistance(
      latitude,
      longitude,
      geofence.center.latitude,
      geofence.center.longitude
    );

    // Check if distance is less than radius (in meters)
    return distance <= geofence.radius;
  });

  res.status(200).json({
    success: true,
    count: insideGeofences.length,
    data: insideGeofences
  });
});

/**
 * @desc    Get traffic impact for a route
 * @route   POST /api/geofencing/traffic-impact
 * @access  Public
 */
const getTrafficImpact = asyncHandler(async (req, res) => {
  const { route } = req.body;

  if (!route || !Array.isArray(route) || route.length < 2) {
    throw new ErrorResponse('Please provide a valid route with at least 2 points', 400);
  }

  // Find all active geofences
  const geofences = await Geofence.find({ active: true }).populate({
    path: 'event',
    select: 'title date time status trafficImpact'
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

  // Calculate overall traffic impact
  let overallImpact = 'low';
  if (impactedGeofences.some(g => g.trafficImpact.level === 'high')) {
    overallImpact = 'high';
  } else if (impactedGeofences.some(g => g.trafficImpact.level === 'medium')) {
    overallImpact = 'medium';
  }

  res.status(200).json({
    success: true,
    count: impactedGeofences.length,
    overallImpact,
    data: impactedGeofences
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
  getGeofences,
  getGeofence,
  createGeofence,
  updateGeofence,
  deleteGeofence,
  getGeofencesInRadius,
  checkPointInGeofence,
  getTrafficImpact
}; 