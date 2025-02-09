import mongoose, { Schema, Document } from 'mongoose';

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
