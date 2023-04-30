const dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const upLoadFile = async (file: any, fileName?: any) => {
  const uri = await cloudinary.uploader.upload(file, {
    public_id: fileName,
    eager: [
      {
        width: 500,
        height: 500,
        gravity: "faces",
        quality: "auto",
        fetch_format: "auto",
        crop: "thumb",
      },
    ],
  });
  return uri?.secure_url;
};
