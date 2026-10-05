import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['chat', 'final_button', 'envelope', 'login', 'system'],
    default: 'system'
  },
  read: {
    type: Boolean,
    default: false
  },
  link: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
