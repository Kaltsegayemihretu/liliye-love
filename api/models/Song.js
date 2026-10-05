import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  audioUrl: {
    type: String,
    required: true
  },
  coverUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: '3:45'
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.models.Song || mongoose.model('Song', SongSchema);
