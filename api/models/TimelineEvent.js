import mongoose from 'mongoose';

const TimelineEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.models.TimelineEvent || mongoose.model('TimelineEvent', TimelineEventSchema);
