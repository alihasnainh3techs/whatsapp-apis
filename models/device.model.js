import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },

    phone: { type: String },

    status: { type: String, required: true },

    lastDisconnectedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Device = mongoose.model('Device', deviceSchema);
