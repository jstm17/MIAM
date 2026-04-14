const sharp = require("sharp");
const { cloudinary } = require("../config/cloudinary");
const { Readable } = require("stream");

/**
 * Compresses an image buffer using sharp and uploads it to Cloudinary.
 * @param {Buffer} buffer - The image buffer to process.
 * @param {string} folder - The folder in Cloudinary to upload to.
 * @returns {Promise<string>} - The URL of the uploaded image.
 */
const compressAndUploadImage = async (buffer, folder = "recipes") => {
  try {
    // Compress image using sharp
    const compressedBuffer = await sharp(buffer)
      .resize({ width: 1024, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // Upload to Cloudinary using stream
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, format: "webp" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(error);
          }
          resolve(result.secure_url);
        },
      );

      // Create a readable stream from the buffer and pipe it to Cloudinary
      const readableStream = new Readable();
      readableStream.push(compressedBuffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  } catch (error) {
    console.error("Image processing error:", error);
    throw error;
  }
};

module.exports = { compressAndUploadImage };
