const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { ErrorResponse, asyncHandler } = require('../middleware/errorMiddleware');

/**
 * @desc    Get all registrations
 * @route   GET /api/registrations
 * @access  Private/Admin
 */
const getRegistrations = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc    Get single registration
 * @route   GET /api/registrations/:id
 * @access  Private
 */
const getRegistration = asyncHandler(async (req, res) => {
  const registration = await Registration.findById(req.params.id)
    .populate({
      path: 'event',
      select: 'title date location'
    })
    .populate({
      path: 'user',
      select: 'name email'
    });

  if (!registration) {
    throw new ErrorResponse(`Registration not found with id of ${req.params.id}`, 404);
  }

  // Make sure user is registration owner or admin
  if (
    registration.user._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    throw new ErrorResponse(
      `User ${req.user.id} is not authorized to access this registration`,
      403
    );
  }

  res.status(200).json({
    success: true,
    data: registration
  });
});

/**
 * @desc    Register for an event
 * @route   POST /api/events/:eventId/register
 * @access  Private
 */
const registerForEvent = asyncHandler(async (req, res) => {
  // Add user and event to req.body
  req.body.user = req.user.id;
  req.body.event = req.params.eventId;

  // Check if event exists
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    throw new ErrorResponse(`Event not found with id of ${req.params.eventId}`, 404);
  }

  // Check if event is at capacity
  if (event.capacity > 0 && event.registeredCount >= event.capacity) {
    throw new ErrorResponse(`Event has reached maximum capacity`, 400);
  }

  // Check if registration already exists
  const existingRegistration = await Registration.findOne({
    user: req.user.id,
    event: req.params.eventId
  });

  if (existingRegistration) {
    throw new ErrorResponse(`User already registered for this event`, 400);
  }

  // Create registration
  const registration = await Registration.create(req.body);

  res.status(201).json({
    success: true,
    data: registration
  });
});

/**
 * @desc    Update registration
 * @route   PUT /api/registrations/:id
 * @access  Private
 */
const updateRegistration = asyncHandler(async (req, res) => {
  let registration = await Registration.findById(req.params.id);

  if (!registration) {
    throw new ErrorResponse(`Registration not found with id of ${req.params.id}`, 404);
  }

  // Make sure user is registration owner or admin
  if (
    registration.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    throw new ErrorResponse(
      `User ${req.user.id} is not authorized to update this registration`,
      403
    );
  }

  // Only allow certain fields to be updated
  const fieldsToUpdate = {
    status: req.body.status,
    notes: req.body.notes,
    additionalInfo: req.body.additionalInfo
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(
    key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  registration = await Registration.findByIdAndUpdate(
    req.params.id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: registration
  });
});

/**
 * @desc    Delete registration
 * @route   DELETE /api/registrations/:id
 * @access  Private
 */
const deleteRegistration = asyncHandler(async (req, res) => {
  const registration = await Registration.findById(req.params.id);

  if (!registration) {
    throw new ErrorResponse(`Registration not found with id of ${req.params.id}`, 404);
  }

  // Make sure user is registration owner or admin
  if (
    registration.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    throw new ErrorResponse(
      `User ${req.user.id} is not authorized to delete this registration`,
      403
    );
  }

  await registration.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Get registrations for a user
 * @route   GET /api/users/:userId/registrations
 * @access  Private
 */
const getUserRegistrations = asyncHandler(async (req, res) => {
  // Make sure user is viewing their own registrations or is admin
  if (
    req.params.userId !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    throw new ErrorResponse(
      `User ${req.user.id} is not authorized to view these registrations`,
      403
    );
  }

  const registrations = await Registration.find({ user: req.params.userId })
    .populate({
      path: 'event',
      select: 'title date location status'
    });

  res.status(200).json({
    success: true,
    count: registrations.length,
    data: registrations
  });
});

/**
 * @desc    Get registrations for an event
 * @route   GET /api/events/:eventId/registrations
 * @access  Private/Admin
 */
const getEventRegistrations = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    throw new ErrorResponse(`Event not found with id of ${req.params.eventId}`, 404);
  }

  // Make sure user is event organizer or admin
  if (
    event.organizer.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    throw new ErrorResponse(
      `User ${req.user.id} is not authorized to view these registrations`,
      403
    );
  }

  const registrations = await Registration.find({ event: req.params.eventId })
    .populate({
      path: 'user',
      select: 'name email phone'
    });

  res.status(200).json({
    success: true,
    count: registrations.length,
    data: registrations
  });
});

/**
 * @desc    Check in user to event
 * @route   PUT /api/registrations/:id/checkin
 * @access  Private/Admin
 */
const checkInUser = asyncHandler(async (req, res) => {
  let registration = await Registration.findById(req.params.id);

  if (!registration) {
    throw new ErrorResponse(`Registration not found with id of ${req.params.id}`, 404);
  }

  const event = await Event.findById(registration.event);

  // Make sure user is event organizer or admin
  if (
    event.organizer.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    throw new ErrorResponse(
      `User ${req.user.id} is not authorized to check in attendees`,
      403
    );
  }

  registration = await Registration.findByIdAndUpdate(
    req.params.id,
    {
      checkedIn: true,
      checkedInTime: Date.now(),
      status: 'attended'
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: registration
  });
});

/**
 * @desc    Submit feedback for an event
 * @route   PUT /api/registrations/:id/feedback
 * @access  Private
 */
const submitFeedback = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating) {
    throw new ErrorResponse('Please provide a rating', 400);
  }

  let registration = await Registration.findById(req.params.id);

  if (!registration) {
    throw new ErrorResponse(`Registration not found with id of ${req.params.id}`, 404);
  }

  // Make sure user is registration owner
  if (registration.user.toString() !== req.user.id) {
    throw new ErrorResponse(
      `User ${req.user.id} is not authorized to submit feedback for this registration`,
      403
    );
  }

  registration = await Registration.findByIdAndUpdate(
    req.params.id,
    {
      feedback: {
        rating,
        comment,
        submittedAt: Date.now()
      }
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: registration
  });
});

module.exports = {
  getRegistrations,
  getRegistration,
  registerForEvent,
  updateRegistration,
  deleteRegistration,
  getUserRegistrations,
  getEventRegistrations,
  checkInUser,
  submitFeedback
}; 