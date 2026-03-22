import multer from "multer";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";
import streamifier from "streamifier";
import config from "../config";

// Cloudinary configuration
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

// Use memory storage (files stay in RAM)
export const upload = multer({
  storage: multer.memoryStorage(),
});

// Detect correct Cloudinary resource type
const getResourceType = (mimetype: string): "image" | "video" => {
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("audio/")) return "video"; // Cloudinary treats audio as video
  return "image";
};

// Upload function (supports file path or multer file)
export const uploadToCloudinary = async (
  file: string | Express.Multer.File
): Promise<{ url: string; public_id: string }> => {
  try {
    let result: UploadApiResponse;

    // Case 1: local file path
    if (typeof file === "string") {
      result = await cloudinary.uploader.upload(file, {
        folder: "uploads",
        resource_type: "auto",
      });

      // Delete local file after upload
      if (fs.existsSync(file)) {
        await fs.promises.unlink(file);
      }
    }

    // Case 2: multer file (buffer)
    else {
      if (!file?.buffer) {
        throw new Error("File buffer missing");
      }

      const resource_type = getResourceType(file.mimetype);

      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "uploads",
            resource_type,
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary stream error:", error);
              return reject(error);
            }
            resolve(result as UploadApiResponse);
          }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    }

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Cloudinary upload failed");
  }
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (
  publicId: string,
  resource_type: "image" | "video" = "image"
): Promise<{ success: boolean }> => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type,
    });

    console.log("File deleted from Cloudinary:", publicId);
    return { success: true };
  } catch (error) {
    console.error("Cloudinary deletion failed:", error);
    return { success: false };
  }
};
