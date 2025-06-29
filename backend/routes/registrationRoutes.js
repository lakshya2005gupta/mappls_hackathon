const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// Placeholder for controller functions
// In a real implementation, you would import these from a controller file
const registrationController = {
  getRegistrations: (req, res) => {
    res.status(200).json({ success: true, message: 'All registrations retrieved' });
  },
  getRegistration: (req, res) => {
    res.status(200).json({ success: true, message: 'Registration retrieved' });
  },
  addRegistration: (req, res) => {
    res.status(201).json({ success: true, message: 'Registration added' });
  },
  updateRegistration: (req, res) => {
    res.status(200).json({ success: true, message: 'Registration updated' });
  },
  deleteRegistration: (req, res) => {
    res.status(200).json({ success: true, message: 'Registration deleted' });
  },
  getUserRegistrations: (req, res) => {
    res.status(200).json({ success: true, message: 'User registrations retrieved' });
  },
  getEventRegistrations: (req, res) => {
    res.status(200).json({ success: true, message: 'Event registrations retrieved' });
  }
};

// Protected routes - all registration routes require authentication
router.use(protect);

// User routes
router.get('/me', registrationController.getUserRegistrations);
router.post('/', registrationController.addRegistration);

// Admin and NGO routes
router.use(authorize('admin', 'ngo'));
router.get('/', registrationController.getRegistrations);
router.get('/event/:eventId', registrationController.getEventRegistrations);
router.get('/:id', registrationController.getRegistration);
router.put('/:id', registrationController.updateRegistration);
router.delete('/:id', registrationController.deleteRegistration);

module.exports = router; 