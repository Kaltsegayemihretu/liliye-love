import mongoose from 'mongoose';

const AnalyticsEventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: [
      'Website opened',
      'Begin clicked',
      'Memory section viewed',
      'Photo clicked',
      'Video played',
      'Envelope opened',
      'Letter completed',
      'Envelope reopened',
      'Boombox opened',
      'Song selected',
      'Boombox closed',
      'Timeline viewed',
      'Chat opened',
      'Login',
      'Logout',
      'Final button clicked'
    ]
  },
  sessionId: {
    type: String,
    default: ''
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.models.AnalyticsEvent || mongoose.model('AnalyticsEvent', AnalyticsEventSchema);
