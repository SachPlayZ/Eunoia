import mongoose, { Schema, Document } from "mongoose";

interface ITherapist extends Document {
    fullName: string;
    typeOfTherapist: string;
    licenseNumber: string;
    issuingAuthority: string;
    yearsOfExperience: number;
    specialties: string[];
    email: {
        type: string,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    };
    walletAddress: { 
        type: string, 
        required: true,
        unique: true,
        trim: true
    },
    availability: {
        days: string[];
        startTime: string;
        endTime: string;
    };
    certifications: string[];
    consultationFeeETH: number;
}

const TherapistSchema: Schema = new mongoose.Schema({
    fullName: { type: String, required: true },
    typeOfTherapist: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    issuingAuthority: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    specialties: { type: [String], required: true },
    email: { type: String, required: true },
    walletAddress: { type: String, required: true },
    availability: {
        days: { type: [String], required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
    },
    certifications: { type: [String], required: false },
    consultationFeeETH: { type: Number, required: true }
});

export default mongoose.models.Therapist || mongoose.model<ITherapist>("Therapist", TherapistSchema);
