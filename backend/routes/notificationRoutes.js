const express = require('express');
const {
  getUserNotifications,
  getNotification,
  createNotification,
  markAsRead,
  deleteNotification,
  createGeofenceEntryNotification,
  createTrafficAlertNotification
} = require('../controllers/notificationController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes for mobile app to create notifications
router.post('/geofence-entry', createGeofenceEntryNotification);
router.post('/traffic-alert', createTrafficAlertNotification);

// Protected routes
router.use(protect);

router.route('/')
  .get(getUserNotifications)
  .post(authorize('admin'), createNotification);

router.route('/:id')
  .get(getNotification)
  .delete(deleteNotification);

router.route('/:id/read')
  .put(markAsRead);

module.exports = router; 