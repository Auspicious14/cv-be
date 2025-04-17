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

GuestCVSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const GuestCVModel = mongoose.model("GuestCV", GuestCVSchema);

// Index for querying and automatic deletion of expired guest CVs

export default GuestCVModel;
