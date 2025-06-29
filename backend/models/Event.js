const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'Education',
        'Environment',
        'Health',
        'Community',
        'Arts',
        'Sports',
        'Cleaning Drive',
        'Awareness',
        'Other'
      ]
    },
    location: {
      type: String,
      required: [true, 'Please add a location']
    },
    address: {
      street: String,
      city: {
        type: String,
        required: [true, 'Please add a city']
      },
      state: {
        type: String,
        required: [true, 'Please add a state']
      },
      zipCode: String,
      country: {
        type: String,
        required: [true, 'Please add a country'],
        default: 'India'
      }
    },
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Please add latitude coordinates']
      },
      longitude: {
        type: Number,
        required: [true, 'Please add longitude coordinates']
      }
    },
    date: {
      type: Date,
      required: [true, 'Please add a date']
    },
    time: {
      start: {
        type: String,
        required: [true, 'Please add a start time']
      },
      end: {
        type: String,
        required: [true, 'Please add an end time']
      }
    },
    organizer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    capacity: {
      type: Number,
      default: 0 // 0 means unlimited
    },
    registeredCount: {
      type: Number,
      default: 0
    },
    images: [String],
    requirements: [String],
    contactInfo: {
      name: String,
      email: String,
      phone: String
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming'
    },
    isVirtual: {
      type: Boolean,
      default: false
    },
    virtualLink: String,
    geofenceRadius: {
      type: Number,
      default: 500 // in meters
    },
    trafficImpact: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for registrations
EventSchema.virtual('registrations', {
  ref: 'Registration',
  localField: '_id',
  foreignField: 'event',
  justOne: false
});

// Middleware to update event status based on date
EventSchema.pre('find', function() {
  this.updateEventStatus();
});

EventSchema.pre('findOne', function() {
  this.updateEventStatus();
});

// Static method to update event status
EventSchema.methods.updateEventStatus = async function() {
  const now = new Date();
  
  // Find events that need status updates
  await this.model('Event').updateMany(
    { 
      date: { $lt: now },
      status: 'upcoming'
    },
    {
      status: 'completed'
    }
  );
  
  // Find events that are happening today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  await this.model('Event').updateMany(
    {
      date: { $gte: today, $lt: tomorrow },
      status: 'upcoming'
    },
    {
      status: 'ongoing'
    }
  );
};

module.exports = mongoose.model('Event', EventSchema); 