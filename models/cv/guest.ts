import mongoose, { Schema, Document } from "mongoose";

const GuestCVSchema = new Schema(
  {
    cvId: { type: Schema.Types.ObjectId, required: true, index: true },
    personalInformation: {
      firstName: String,
      lastName: String,
      email: String,
      description: String,
      address: String,
      profession: String,
      phoneNumber: String,
      state: String,
      city: String,
      country: String,
      image: {
        uri: String,
        name: String,
        type: String,
      },
    },
    academic: [
      {
        institution: String,
        degree: String,
        field: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    certificate: [
      {
        name: String,
        organization: String,
        issueDate: Date,
        expiryDate: Date,
        description: String,
      },
    ],
    experience: [
      {
        company: String,
        position: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    skill: [
      {
        name: String,
        isAISuggested: Boolean,
      },
    ],
    isGuestCV: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const GuestCVModel = mongoose.model<IGuestCV>("GuestCV", GuestCVSchema);

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

const GuestCVModel = mongoose.model<IGuestCV>("GuestCV", guestCVSchema);
export default GuestCVModel;
