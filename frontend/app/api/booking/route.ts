import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/_middleware/mongodb';
import { Availability } from '@/app/_models/availability';

export async function POST(req: NextRequest) {
  await connectDB();
  
  try {
    const { therapistId, date, time, userId } = await req.json();

    const availability = await Availability.findOne({ therapistId, date });
    if (!availability) {
      return NextResponse.json({ error: 'No availability found' }, { status: 404 });
    }

    const slot = availability.timeSlots.find((slot: any) => slot.time === time);
    if (!slot || slot.isBooked) {
      return NextResponse.json({ error: 'Slot already booked' }, { status: 400 });
    }

    slot.isBooked = true;
    slot.bookedBy = userId;
    await availability.save();

    return NextResponse.json({ success: true, availability }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
