import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: "hauimanhneahihi",
  api_key: "557771485155511",
  api_secret: "iSQlZvJpwqAse1tuEr2V9ZFy2dA",
});
export const destroyFile = async (public_id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

export const uploadFile = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file,
      { upload_preset: "ozvvaq6d" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};
