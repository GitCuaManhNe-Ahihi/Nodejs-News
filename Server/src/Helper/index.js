import path from "path";
import { format } from "date-fns";
const rfs = require("rotating-file-stream");
import { formatRelative } from "date-fns";
import mammoth from "mammoth";
import fs from "fs/promises";
import { uploadFile } from "../serviceQuery/cloudinary";

const streamMorgan = rfs.createStream(
  `${format(new Date(), "dd-MM-yy")}_LogMorgan.log`,
  {
    size: "10M", // rotate every 10 MegaBytes written
    interval: "1d", // rotate daily
    compress: "gzip", // compress rotated files
    path: path.join(__dirname, "../Logs/logmorgan"),
  }
);

const streamError = rfs.createStream(
  `${format(new Date(), "dd-MM-yy")}_LogError.log`,
  {
    size: "10M", // rotate every 10 MegaBytes written
    interval: "1d", // rotate daily
    compress: "gzip", // compress rotated files
    path: path.join(__dirname, "../Logs/logerror"),
  }
);

const LogEvent = (type, url, message) => {
  const date = new Date();
  const dateFormat = format(date, "dd-MM-yyyy HH:mm:ss");
  const log = `${dateFormat}-${type}-${url}-${message}`;
  console.log(log);
  streamError.write(log + "\n");
};

export const removeFileImage = (path) => {
  fs.unlink(path);
};
export const handleReadfile = async (path) => {
  try {
    let doc = await mammoth.convertToHtml({ path: path });

    return doc.value;
  } catch (err) {
    return err;
  } finally {
    fs.unlinkSync(path);
  }
};
function formatDate(seconds, date) {
  let formattedDate = "";
  if (seconds) {
    if (seconds < 1000 * 60) {
      formattedDate = `${seconds / 1000} giây trước`;
    } else if (seconds < 1000 * 60 * 60) {
      formattedDate = `${Math.floor(seconds / 60000)} phút trước`;
    } else if (seconds < 1000 * 60 * 60 * 24) {
      formattedDate = `${Math.floor(seconds / (1000 * 60 * 60))} giờ trước`;
    } else {
      if (seconds < 1000 * 60 * 60 * 24 * 8) {
        formattedDate = `${Math.floor(
          seconds / (1000 * 60 * 60 * 24)
        )} days ago`;
      } else {
        formattedDate = formatRelative(date, new Date());
      }
    }
  }

  return formattedDate;
}
const handleMakeContent = async (images, docxpath) => {
  try {
    let image = images || [];
    let arrayImage = [];
    let public_id = "";
    if (image.length > 0) {
      for (let i = 0; i < image.length; i++) {
        let respon = await uploadFile(image[i].path);
        arrayImage.push(respon.url);
        public_id += respon.public_id + ",";
      }
    }

    let path = docxpath[0].path;
    let content = await handleReadfile(path);
    for (let i = 0; i < arrayImage.length; i++) {
      let index = content.indexOf("img");
      if (index === -1) {
        break;
      }
      content = content.replace("*img*", `<img src="${arrayImage[i]}"></img>`);
    }
    return { content, public_id, arrayImage };
  } catch (err) {
    return err;
  }
};
 

module.exports = {
  streamMorgan,
  LogEvent,
  formatDate,
  handleMakeContent,
  removeFileImage,
  handleReadfile,
 
  
};
