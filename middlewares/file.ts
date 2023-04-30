const dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const upLoadFile = async (file: any, fileName?: any) => {
  const uri = await cloudinary.uploader.upload(file, { public_id: fileName });

  return uri?.secure_url;
};
