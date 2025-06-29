const mongoose = require('mongoose');

const GeofenceSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.ObjectId,
      ref: 'Event',
      required: true
    },
    radius: {
      type: Number,
      required: [true, 'Please add a radius'],
      default: 500 // in meters
    },
    center: {
      latitude: {
        type: Number,
        required: [true, 'Please add latitude coordinates']
      },
      longitude: {
        type: Number,
        required: [true, 'Please add longitude coordinates']
      }
    },
    active: {
      type: Boolean,
      default: true
    },
    trafficImpact: {
      level: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
      },
      description: String
    },
    notifications: {
      enabled: {
        type: Boolean,
        default: true
      },
      message: {
        type: String,
        default: 'There is an event happening nearby that may cause traffic.'
      }
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Create index for geospatial queries
GeofenceSchema.index({ 'center': '2dsphere' });

module.exports = mongoose.model('Geofence', GeofenceSchema); 