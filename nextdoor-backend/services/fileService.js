const cloudinary = require('cloudinary').v2;
const env = require('../config/environment');

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (file, folder = 'nextdoor-tech') => {
  try {
    if (!file) return null;

    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
};

const uploadImage = async (file, folder = 'nextdoor-tech/images') => {
  return uploadFile(file, folder);
};

const uploadVideo = async (file, folder = 'nextdoor-tech/videos') => {
  return uploadFile(file, folder);
};

const uploadPDF = async (file, folder = 'nextdoor-tech/pdfs') => {
  return uploadFile(file, folder);
};

const deleteFile = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Delete failed:', error);
    return false;
  }
};

module.exports = {
  uploadFile,
  uploadImage,
  uploadVideo,
  uploadPDF,
  deleteFile,
};
