import mongoose, { Schema, Document } from "mongoose";

interface IGuestCV extends Document {
  personalInformation: {
    firstName: string;
    lastName: string;
    email: string;
    description: string;
    address: string;
    profession: string;
    phoneNumber: string;
    state: string;
    city: string;
    country: string;
    image?: {
      uri: string;
      name: string;
      type: string;
    };
  };
  academic: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate: Date;
    description?: string;
  }>;
  certificate: Array<{
    name: string;
    organization: string;
    issueDate: Date;
    expiryDate?: Date;
    description?: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    description: string;
  }>;
  skill: Array<{
    name: string;
    isAISuggested?: boolean;
  }>;
  isGuestCV: boolean;
  createdAt: Date;
  expiresAt: Date;
}

const guestCVSchema = new Schema<IGuestCV>(
  {
    personalInformation: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      description: { type: String },
      address: { type: String },
      profession: { type: String },
      phoneNumber: { type: String },
      state: { type: String },
      city: { type: String },
      country: { type: String },
      image: {
        uri: String,
        name: String,
        type: String,
      },
    },
    academic: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        field: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        description: String,
      },
    ],
    certificate: [
      {
        name: { type: String, required: true },
        organization: { type: String, required: true },
        issueDate: { type: Date, required: true },
        expiryDate: Date,
        description: String,
      },
    ],
    experience: [
      {
        company: { type: String, required: true },
        position: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: Date,
        description: { type: String, required: true },
      },
    ],
    skill: [
      {
        name: { type: String, required: true },
        isAISuggested: { type: Boolean, default: false },
      },
    ],
    isGuestCV: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Index for querying and automatic deletion of expired guest CVs
guestCVSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IGuestCV>("GuestCV", guestCVSchema);
