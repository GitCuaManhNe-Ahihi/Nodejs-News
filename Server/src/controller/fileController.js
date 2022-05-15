import { destroyFile, uploadFile } from "../serviceQuery/cloudinary";
import { removeFileImage } from "./defaultValue";
const createError = require("http-errors");
export const handleimageDestroy = async(req, res, next) => {
  try {
    const delete_image = req.query.id.split(",");
    for (let i = 0; i < delete_image.length; i++) {
      try {
        await destroyFile(delete_image[i]);
      } catch {
        return next(createError(406, "Not Acceptable"));
       }
    }
    return res.status(204).json({ message: "ok", statuscode: 0 });
  } catch (err) {
    return next(createError(400, "Bad Request"));
  }
};
export const handUploadimage = async (req, res, next) => {
  try {
    const data = await uploadFile(req.file.path);
    return res.status(201).json({ message: "ok", statuscode: 0, data });
  } catch {
    return next(createError(400, "Bad Request"));
  } finally {
    removeFileImage(req.file.path);
  }
};
