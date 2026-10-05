import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  myLocationName: {
    type: String,
    default: 'MY PLACE'
  },
  myCity: {
    type: String,
    default: 'San Francisco, CA'
  },
  herLocationName: {
    type: String,
    default: 'HER PLACE'
  },
  herCity: {
    type: String,
    default: 'New York, NY'
  },
  distanceText: {
    type: String,
    default: '2,572 miles'
  },
  noteTop: {
    type: String,
    default: 'TWO PLACES. ONE DISTANCE.'
  },
  noteBottom1: {
    type: String,
    default: 'Wait for you to come to me...'
  },
  noteBottom2: {
    type: String,
    default: '...but I\'m always coming to you if you need me.'
  }
}, { timestamps: true });

export default mongoose.models.Location || mongoose.model('Location', LocationSchema);
