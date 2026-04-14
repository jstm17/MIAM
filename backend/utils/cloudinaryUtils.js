const { cloudinary } = require("../config/cloudinary");

/**
 * Deletes an image from Cloudinary given its URL.
 * @param {string} url - The dynamic URL of the image.
 */
const deleteImageFromCloudinary = async (url) => {
  if (!url || !url.includes("cloudinary.com")) return;

  try {
    // Standard Cloudinary URL format: 
    // https://res.cloudinary.com/cloud_name/image/upload/v1234567/folder/filename.ext
    const urlParts = url.split("/");
    const filenameWithExt = urlParts.pop();
    const folder = urlParts.pop();
    const publicId = `${folder}/${filenameWithExt.split(".")[0]}`;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error);
  }
};

module.exports = { deleteImageFromCloudinary };
