const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// Placeholder for controller functions
// In a real implementation, you would import these from a controller file
const userController = {
  registerUser: (req, res) => {
    res.status(201).json({ success: true, message: 'User registered successfully' });
  },
  loginUser: (req, res) => {
    res.status(200).json({ success: true, message: 'User logged in successfully' });
  },
  getMe: (req, res) => {
    res.status(200).json({ success: true, message: 'User profile retrieved' });
  },
  updateDetails: (req, res) => {
    res.status(200).json({ success: true, message: 'User details updated' });
  },
  updatePassword: (req, res) => {
    res.status(200).json({ success: true, message: 'Password updated' });
  },
  getUsers: (req, res) => {
    res.status(200).json({ success: true, message: 'All users retrieved' });
  }
};

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes
router.use(protect);
router.get('/me', userController.getMe);
router.put('/updatedetails', userController.updateDetails);
router.put('/updatepassword', userController.updatePassword);

// Admin only routes
router.use(authorize('admin'));
router.get('/', userController.getUsers);

module.exports = router; 