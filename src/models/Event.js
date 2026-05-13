import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  track: { type: String, required: true },
  location: String,
  date: { type: Date, required: true },
  time: String,
  duration: String,
  description: String,
  // CRITICAL: This stores the registered drivers
  registrations: { type: [String], default: [] }, 
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);