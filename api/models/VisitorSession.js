import mongoose from 'mongoose';

const VisitorSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userIp: {
    type: String,
    default: 'anonymous'
  },
  userAgent: {
    type: String,
    default: ''
  },
  deviceType: {
    type: String,
    default: 'Desktop'
  },
  browser: {
    type: String,
    default: 'Chrome'
  },
  region: {
    type: String,
    default: 'Unknown'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.models.VisitorSession || mongoose.model('VisitorSession', VisitorSessionSchema);
