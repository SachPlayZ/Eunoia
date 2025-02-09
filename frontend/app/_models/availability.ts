import mongoose, { Schema, Document } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) throw new Error('Please define the MONGODB_URI environment variable');

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

interface ITimeSlot {
  time: string;
  isBooked: boolean;
  bookedBy?: string;
}

export interface IAvailability extends Document {
  therapistId: string;
  date: string;
  timeSlots: ITimeSlot[];
}

const AvailabilitySchema: Schema = new Schema({
  therapistId: { type: String, required: true },
  date: { type: String, required: true },
  timeSlots: [{ time: String, isBooked: Boolean, bookedBy: String }],
});

export const Availability = mongoose.models.Availability || mongoose.model<IAvailability>('Availability', AvailabilitySchema);
