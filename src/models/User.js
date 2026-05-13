import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
  steamId: { type: String, unique: true },
  role: { type: String, default: "user" },
  isAdmin: { type: Boolean, default: false }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);