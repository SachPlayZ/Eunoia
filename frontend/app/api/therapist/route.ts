import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/_middleware/mongodb';
import Therapist from '@/app/_models/schema';

async function posthandler(req: Request) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const therapistData = new Therapist(body);

        await therapistData.save();

        return NextResponse.json({ message: 'Therapist data saved successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error saving therapist data:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

async function gethandler(req: Request) {
    try {
        await connectToDatabase();
        const url = new URL(req.url);
        const walletAddress = url.searchParams.get('walletAddress');

        if (!walletAddress) {
            return NextResponse.json({ message: 'Wallet address is required' }, { status: 400 });
        }
        const therapistData = await Therapist.findOne({ walletAddress }).exec();

        if (!therapistData) {
            return NextResponse.json({ message: 'No therapist data found' }, { status: 404 });
        }

        return NextResponse.json(therapistData, { status: 200 });
    } catch (error) {
        console.error('Error retrieving therapist data:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

async function patchhandler(req: Request) {
    try {
        await connectToDatabase();
        const url = new URL(req.url);
        const walletAddress = url.searchParams.get('walletAddress');

        if (!walletAddress) {
            return NextResponse.json({ message: 'Wallet address is required' }, { status: 400 });
        }

        const updates = await req.json();

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ message: 'No data provided for update' }, { status: 400 });
        }

        const therapistData = await Therapist.findOneAndUpdate({ walletAddress }, updates, { new: true }).exec();

        if (!therapistData) {
            return NextResponse.json({ message: 'No therapist data found for this wallet address' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Therapist data updated successfully', therapistData }, { status: 200 });
    } catch (error) {
        console.error('Error updating therapist data:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

async function deletehandler(req: Request) {
    try {
        await connectToDatabase();
        const url = new URL(req.url);
        const walletAddress = url.searchParams.get('walletAddress');

        if (!walletAddress) {
            return NextResponse.json({ message: 'Wallet address is required' }, { status: 400 });
        }

        const therapistData = await Therapist.findOneAndDelete({ walletAddress }).exec();

        if (!therapistData) {
            return NextResponse.json({ message: 'No therapist data found for this wallet address' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Therapist data deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting therapist data:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export { posthandler as POST, gethandler as GET, patchhandler as PATCH, deletehandler as DELETE };
