import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }, // Links to your Calendar Event
  track: String,
  sessionType: String, // e.g., "R" (Race) or "Q" (Qualifying)
  standings: [{
    position: Number,
    name: String,
    steamId: String,
    car: String,
    carModel: String, // Added for detail
    totalTime: String,
    bestLap: String,
    laps: Number,     // Added to track race completion
    points: { type: Number, default: 0 }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Result || mongoose.model('Result', ResultSchema);