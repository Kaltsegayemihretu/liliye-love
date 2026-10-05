import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
  title: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ''
  },
  isCutout: {
    type: Boolean,
    default: false
  },
  rotation: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['hero', 'album', 'final', 'general'],
    default: 'album'
  }
}, { timestamps: true });

export default mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);
