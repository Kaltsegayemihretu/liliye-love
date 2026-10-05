import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'A few moments I wish I could live again.'
  },
  subtitle: {
    type: String,
    default: 'And there are still so many moments I\'d like to make with you.'
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);
