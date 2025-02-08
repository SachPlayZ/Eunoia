// models/PersonalityTestResult.js
import mongoose from 'mongoose';

const PersonalityTestResultSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  contextParagraph: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
const PersonalityTestResult = mongoose.models.PersonalityTestResult || mongoose.model('PersonalityTestResult', PersonalityTestResultSchema);
export default PersonalityTestResult;