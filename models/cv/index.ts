import mongoose from "mongoose";
const { isEmail } = require("validator");

const Schema = mongoose.Schema;

const CVSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
    isGuestCV: { type: Boolean, default: false },
    personalInformation: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true, unique: true, validate: isEmail },
      dateOfBirth: { type: String },
      description: { type: String },
      phoneNumber: { type: String },
      address: { type: String },
      profession: { type: String },
      state: { type: String },
      city: { type: String },
      country: { type: String },
      image: {
        uri: { type: String },
        name: { type: String },
        type: { type: String },
      },
    },
    experience: [
      {
        jobTitle: { type: String },
        description: { type: String },
        location: { type: String },
        company: { type: String },
        fromDate: { type: String },
        toDate: { type: String },
      },
    ],
    academic: [
      {
        school: { type: String },
        degree: { type: String },
        course: { type: String },
        fromDate: { type: String },
        toDate: { type: String },
      },
    ],
    certificate: [
      {
        name: { type: String },
        year: { type: String },
        school: { type: String },
        description: { type: String },
      },
    ],
    skill: [{ name: String }],
    language: [{ name: String }],
  },
  { timestamps: true }
);

const CVModel = mongoose.model("cv", CVSchema);
export default CVModel;
