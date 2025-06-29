const express = require('express');
const {
  getGeofences,
  getGeofence,
  createGeofence,
  updateGeofence,
  deleteGeofence,
  getGeofencesInRadius,
  checkPointInGeofence,
  getTrafficImpact
} = require('../controllers/geofencingController');

const Geofence = require('../models/Geofence');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes that need protection
router.use(protect);

// Get geofences within radius
router.route('/radius/:latitude/:longitude/:distance').get(getGeofencesInRadius);

// Check if point is inside geofence
router.route('/check').post(checkPointInGeofence);

// Get traffic impact for a route
router.route('/traffic-impact').post(getTrafficImpact);

// Routes that need admin authorization
router
  .route('/')
  .get(
    advancedResults(Geofence, {
      path: 'event',
      select: 'title date location'
    }),
    authorize('admin', 'ngo'),
    getGeofences
  )
  .post(authorize('admin', 'ngo'), createGeofence);

router
  .route('/:id')
  .get(getGeofence)
  .put(authorize('admin', 'ngo'), updateGeofence)
  .delete(authorize('admin', 'ngo'), deleteGeofence);

module.exports = router; 