import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("✅ Uploaded to Cloudinary:", response.url);

    // Cleanup after successful upload
    fs.unlinkSync(localFilePath);

    return response.url;
  } catch (error: any) {
    console.error("❌ Cloudinary Upload Error:", error); // <--- ADD THIS

    // Only try deleting if file exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export {uploadOnCloudinary} ;
