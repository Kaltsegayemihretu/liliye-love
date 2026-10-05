import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'her'],
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
