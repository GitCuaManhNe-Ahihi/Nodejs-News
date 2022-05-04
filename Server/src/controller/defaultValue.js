import { formatRelative } from "date-fns";
import mammoth from "mammoth";
import fs from "fs";
import { uploadFile } from "../serviceQuery/cloudinary";
export const removeFileImage = (path) => {
  fs.unlinkSync(path);
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
export function formatDate(seconds, date) {
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
export let headerBottom = [
  {
    name: "Thời Sự",
    link: "/",
  },
  {
    name: "Thế Giới",
    link: "/",
  },
  {
    name: "Sức Khỏe",
    link: "/",
  },
  {
    name: "Công Nghệ",
    link: "/",
  },
  {
    name: "Đời Sống",
    link: "/",
  },
  {
    name: "Thể thao",
    link: "/",
  },
  {
    name: "Gỉai Trí",
    link: "/",
  },
  {
    name: "Giáo Dục",
    link: "/",
  },
];

export const handleMakeContent = async (images, docxpath) => {
  try{

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
  }catch(err){
    return err;
  }
};
