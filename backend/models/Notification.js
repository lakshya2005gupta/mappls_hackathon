const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: false
    },
    type: {
      type: String,
      enum: ['geofence_entry', 'traffic_alert', 'event_reminder', 'registration_confirmation', 'event_update', 'system'],
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please add a notification title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    message: {
      type: String,
      required: [true, 'Please add a notification message'],
      maxlength: [500, 'Message cannot be more than 500 characters']
    },
    read: {
      type: Boolean,
      default: false
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, type: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema); 