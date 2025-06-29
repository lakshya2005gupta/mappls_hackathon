const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    event: {
      type: mongoose.Schema.ObjectId,
      ref: 'Event',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'attended'],
      default: 'pending'
    },
    registrationDate: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot be more than 500 characters']
    },
    checkedIn: {
      type: Boolean,
      default: false
    },
    checkedInTime: {
      type: Date
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        maxlength: [1000, 'Feedback comment cannot be more than 1000 characters']
      },
      submittedAt: {
        type: Date
      }
    },
    additionalInfo: {
      type: Map,
      of: String
    }
  },
  {
    timestamps: true
  }
);

// Prevent user from registering for the same event multiple times
RegistrationSchema.index({ user: 1, event: 1 }, { unique: true });

// Update event registeredCount when a new registration is created
RegistrationSchema.post('save', async function() {
  await this.constructor.updateEventRegistrationCount(this.event);
});

// Update event registeredCount when a registration is removed
RegistrationSchema.post('remove', async function() {
  await this.constructor.updateEventRegistrationCount(this.event);
});

// Static method to update event registration count
RegistrationSchema.statics.updateEventRegistrationCount = async function(eventId) {
  const Event = this.model('Event');
  
  const registrationCount = await this.countDocuments({
    event: eventId,
    status: { $in: ['pending', 'confirmed'] }
  });
  
  await Event.findByIdAndUpdate(eventId, {
    registeredCount: registrationCount
  });
};

module.exports = mongoose.model('Registration', RegistrationSchema); 