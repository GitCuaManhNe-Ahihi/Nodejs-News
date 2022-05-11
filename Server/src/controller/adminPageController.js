import {
  ApiAllpost,
  ApiBrowsePost,
  ApiCount7DayAgo,
  ApiCountPost,
  ApiCountPostFollowId,
  ApiDeletePost,
  ApiNewArticle,
  ApiOnePost,
  ApiStatisticalPostFollowGenres,
  ApiStatisticalPostFollowMonth,
  ApiUpdatePost,
  ApiYourPost,
} from "../serviceQuery/APIpost";
import { destroyFile, uploadFile } from "../serviceQuery/cloudinary";
import {
  ApiCountUser,
  ApiCountUser7DaysAgo,
  ApiDeleteUser,
  ApiGetUser,
  queryUserLogin,
  queryUserRegister,
} from "../serviceQuery/userQuery";
import {
  handleMakeContent,
  handleReadfile,
  removeFileImage,
} from "./defaultValue";

export let handleLogin = async (req, res) => {
  if (req.body.email && req.body.password) {
    const users = await queryUserLogin(req.body.email, req.body.password);
    if (!users.code) {
      let { tokenrefresh, ...other } = users;
      res.cookie("tokenrefresh", tokenrefresh, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSide: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      return res.status(200).json(other);
    } else {
      return res.status(404).json({ message: users.message, code: users.code });
    }
  } else {
    return res.status(404).json({
      message: "You should input email and password",
      code: 5,
    });
  }
};
export const handleResAllPost = async (req, res) => {
  const allPost = await ApiAllpost();
  if (allPost.code) {
    return res.status(404).json(allPost);
  } else {
    return res.status(200).json(allPost);
  }
};
export const handleYourPost = async (req, res) => {
  if (req.body.id) {
    try {
      const yourpost = await ApiYourPost(req.body.id);
      return res
        .status(200)
        .json({ data: yourpost, statuscode: 0, message: "ok" });
    } catch (err) {
      return res.status(400).json({ message: err, statuscode: 1 });
    }
  } else {
    return res.status(400).json({ message: ">>>>", statuscode: 2 });
  }
};
export const handleNewPost = async (req, res) => {
  try {
    let readData = await handleMakeContent(req.files.image, req.files.docx);

    const data = {
      content: readData.content,
      title: req.body.title,
      userId: req.body.userId,
      genresId: req.body.genresId,
      public_id: readData.public_id,
      like: 0,
      view: 0,
      validator: 0,
    };
    const newPost = await ApiNewArticle(data);
    if (!newPost.code) {
      return res.status(200).json({ message: "ok", statuscode: 0 });
    } else {
      readData.arrayImage.forEach(async (image) => {
        await destroyFile(image.public_id);
      });
      return res
        .status(400)
        .json({ message: "fail insert data", statuscode: 1 });
    }
  } catch (err) {
    return res.status(401).json({ message: err, statuscode: 2 });
  } finally {
    req?.files.image?.forEach((file) => {
      removeFileImage(file.path);
    });
  }
};
export const handleDeletePost = async (req, res) => {
  try {
    ApiDeletePost(req.query.id).then((data) => {
      if (data.code) {
        return res.status(404).json(data);
      } else {
        return res.status(200).json({ message: "ok", statuscode: 0 });
      }
    });
  } catch (err) {
    return res.status(400).json({ message: err, statuscode: 1 });
  }
};
export const handleEditPost = async (req, res) => {
  try {
    const postOriginal = await ApiOnePost(req.body.id);
    if (postOriginal) {
      let dataNewPost;
      if (req.files?.docx && req.files?.image) {
        dataNewPost = await handleMakeContent(
          req.files?.image,
          req.files?.docx
        );
      } else {
        if (req.files.image) {
          let public_id = "";
          let content = postOriginal.content;
          let arrayImage = [];
          if (req.files.image.length > 0) {
            for (let i = 0; i < req.files.image.length; i++) {
              let respon = await uploadFile(req.files.image[i].path);
              arrayImage.push(respon.url);
              public_id += respon.public_id + ",";
            }
          }
          let first = 0;
          for (let i = 0; i < arrayImage.length; i++) {
            const index = content.indexOf("img src=", first) + 9;
            const subdata = content.slice(index, content.indexOf('"', index));
            if (index === 8) {
              break;
            }
            content = content.replace(subdata, arrayImage[i]);
            first = content.indexOf('"', index);
          }
          dataNewPost = { ...dataNewPost, public_id, content };
        } else {
          if (req.files.docx) {
            let url = [];
            let content = postOriginal.content;
            let contentDocx = await handleReadfile(req.files.docx[0].path);
            let first = 0;
            while (true) {
              const index = content.indexOf("img src=", first) + 9;
              const subdata = content.slice(index, content.indexOf('"', index));
              if (index === 8) {
                break;
              }
              url.push(subdata);
              first = content.indexOf('"', index);
            }

            for (let i = 0; i < url.length; i++) {
              let index = contentDocx.indexOf("img");
              if (index === -1) {
                break;
              }
              contentDocx = contentDocx.replace(
                "*img*",
                `<img src="${url[i]}"></img>`
              );
            }
            dataNewPost = { ...dataNewPost, content: contentDocx };
          }
        }
      }
      const data = {
        content: dataNewPost?.content
          ? dataNewPost?.content
          : postOriginal.content,
        title: req.body.title ? req.body.title : postOriginal.title,
        userId: postOriginal.userId,
        genresId: req.body.genresId
          ? +req.body.genresId
          : +postOriginal.genresId,
        public_id: dataNewPost?.public_id
          ? dataNewPost?.public_id
          : postOriginal.public_id,
        like: postOriginal.like,
        view: postOriginal.view,
        validator: postOriginal.validator,
      };
      try {
        const respon = await ApiUpdatePost(req.body.id, data);
        if (dataNewPost?.public_id ? true : false) {
          postOriginal.public_id.split(",").forEach(async (image) => {
            try {
              await destroyFile(image);
            } catch (err) {
              console.log(err);
            }
          });
        }
        return res.status(200).json({ message: "ok", statuscode: 0 });
      } catch {
        if (!dataNewPost?.public_id) {
          dataNewPost?.public_id.split(",").forEach(async (image) => {
            try {
              await destroyFile(image);
            } catch (err) {
              console.log(err);
            }
          });
        }
        return res
          .status(400)
          .json({ message: "fail update data", statuscode: 1 });
      }
    } else {
      return res
        .status(401)
        .json({ message: "fail update data", statuscode: 1 });
    }
  } catch {
    return res.status(402).json({ message: "fail", statuscode: 1 });
  } finally {
    if (req?.files?.image?.length > 0) {
      req?.files?.image?.forEach((file) => {
        removeFileImage(file.path);
      });
    }
  }
};

export const handleBrowsePost = async (req, res) => {
  try {
    const data = await ApiBrowsePost(req.body.id, req.body.validator);
    return res.status(200).json({
      message: "ok",

      statuscode: 0,
    });
  } catch {
    return res.status(401).json({ message: "fail", statuscode: 1 });
  }
};

export const handleStatisticalFollowGenre = async (req, res) => {
  try {
    const data = await ApiStatisticalPostFollowGenres();
    return res.status(200).json(data);
  } catch {
    return res.status(401).json({ message: "fail", statuscode: 1 });
  }
};
export const handleApiStatisticalPostFollowMonth = async (req, res) => {
  try {
    const data = await ApiStatisticalPostFollowMonth();
    return res.status(200).json(data);
  } catch {
    return res.status(401).json({ message: "fail", statuscode: 1 });
  }
};
export const handleApiCount = async (req, res) => {
  try {
    const datapost = await ApiCountPost();
    const datapost7daysago = await ApiCount7DayAgo();
    const datauser = await ApiCountUser();
    const datauser7daysago = await ApiCountUser7DaysAgo();
    return res.status(200).json({
      datapost,
      datapost7daysago,
      datauser,
      datauser7daysago,
    });
  } catch {
    return res.status(401).json({ message: "fail", statuscode: 1 });
  }
};

export const handleApiCountFollowId = async (req, res) => {
  try {
    let id = req.query.id;
    const data = await ApiCountPostFollowId(id);
    return res.status(200).json(data);
  } catch {
    return res.status(401).json({ message: "fail", statuscode: 1 });
  }
};
export const handleApiDeleteUser = async (req, res) => {
  try { 
    const data = await ApiDeleteUser(req.query.id);
    return res.status(200).json({ message: "ok", statuscode: 0 });
  } catch {
    return res.status(401).json({ message: "fail", statuscode: 1 });
  }
};

export const handleApiGetUser = async (req, res) => {
  try {
    const data = await ApiGetUser();
    return res.status(200).json(data);
  } catch {
    return res.status(401).json({ message: "fail", statuscode: 1 });
  }
}