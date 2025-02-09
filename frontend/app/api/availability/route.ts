import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/_middleware/mongodb';
import { Availability } from '@/app/_models/availability';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { therapistId, date, timeSlots } = await req.json();

    let availability = await Availability.findOne({ therapistId, date });
    if (!availability) {
      availability = new Availability({ therapistId, date, timeSlots });
    } else {
      availability.timeSlots = timeSlots;
    }

    await availability.save();
    return NextResponse.json({ success: true, availability }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const therapistId = searchParams.get('therapistId');
    const date = searchParams.get('date');

    if (!therapistId || !date) {
      return NextResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
    }

    const availability = await Availability.findOne({ therapistId, date });
    return NextResponse.json({ success: true, availability }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
