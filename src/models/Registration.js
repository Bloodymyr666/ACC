import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
  },
  steamId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

// This prevents Mongoose from creating the model twice during hot-reloads
export default mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);