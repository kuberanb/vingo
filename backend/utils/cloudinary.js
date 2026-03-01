import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (file) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const result = await cloudinary.uploader.upload(file);
    fs.unlinkSync(file); // Delete the local file after uploading
    return result.secure_url; // Return the URL of the uploaded image
  } catch (error) {
    fs.unlinkSync(file); // Delete the local file after uploading

    console.log(`Error uploading file to Cloudinary: ${error}`);
  }
};

export default uploadOnCloudinary;
