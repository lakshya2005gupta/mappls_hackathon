const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// Placeholder for controller functions
// In a real implementation, you would import these from a controller file
const eventController = {
  getEvents: (req, res) => {
    res.status(200).json({ success: true, message: 'All events retrieved' });
  },
  getEvent: (req, res) => {
    res.status(200).json({ success: true, message: 'Event retrieved' });
  },
  createEvent: (req, res) => {
    res.status(201).json({ success: true, message: 'Event created' });
  },
  updateEvent: (req, res) => {
    res.status(200).json({ success: true, message: 'Event updated' });
  },
  deleteEvent: (req, res) => {
    res.status(200).json({ success: true, message: 'Event deleted' });
  },
  getEventsInRadius: (req, res) => {
    res.status(200).json({ success: true, message: 'Events in radius retrieved' });
  }
};

// Public routes
router.get('/radius/:zipcode/:distance', eventController.getEventsInRadius);
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEvent);

// Protected routes for NGO and Admin
router.use(protect);
router.use(authorize('admin', 'ngo'));
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router; 