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
  ApiYourPost
} from "../serviceQuery/APIpost";
import { destroyFile } from "../serviceQuery/cloudinary";
const createError = require("http-errors");
export const handleResAllPost = async (req, res, next) => {
  const allPost = await ApiAllpost();
  if (allPost.code) {
    return next(createError(404, "Not Found"));
  } else {
    return res.status(200).json(allPost);
  }
};

export const handleYourPost = async (req, res, next) => {
  if (req.body.id) {
    try {
      const yourpost = await ApiYourPost(req.body.id);
      return res
        .status(200)
        .json({ data: yourpost, statuscode: 0, message: "ok" });
    } catch (err) {
      return next(createError(404, "Not Found Post"));
    }
  } else {
    return next(createError(400, "Bad Request"));
  }
};

export const handleNewPost = async (req, res, next) => {
  try {
    const { content, title, genresId, userId, public_id } = req.body;
    if (content && title && userId && genresId) {
      const data = {
        content: content,
        title: title,
        userId: userId,
        genresId: genresId,
        public_id: public_id,
        like: 0,
        view: 0,
        validator: 0,
      };
      try {
        const newPost = await ApiNewArticle(data);
        res.status(201).json({ message: "ok", statuscode: 0 });
      } catch {
        return next(createError(406, "Not Acceptable"));
      }
    } else {
      return next(createError(406, "Not Acceptable"));
    }
  } catch (err) {
    return next(createError(400, "Bad Request"));
  }
};

export const handleDeletePost = async (req, res, next) => {
  try {
    const { id } = req.query;
    ApiOnePost(id)
      .then((data) => {
        data.public_id.split(",").forEach((item) => {
          destroyFile(item);
        });
      })
      .catch((err) => {
        return next(createError(422, "Can not delete"));
      });
    ApiDeletePost(id)
      .then((data) => {
        return res.status(204).json({ message: "ok", statuscode: 0 });
      })
      .catch((err) => {
        return next(createError(422, "Can not delete"));
      });
  } catch (err) {
    next(createError(404, "Not Found Post"));
  }
};

export const handleEditPost = async (req, res, next) => {
  try {
    const { id, content, title, genresId, public_id } = req.body;
    let postOriginal = await ApiOnePost(id);
    if (postOriginal) {
      const data = {
        content: content ? content : postOriginal.content,
        title: title ? title : postOriginal.title,
        genresId: genresId ? +genresId : +postOriginal.genresId,
        public_id: public_id,
        validator: 0,
      };
      try {
        await ApiUpdatePost(id, data);
        return res.status(201).json({ message: "ok", statuscode: 0 });
      } catch {
        return next(createError(406, "Not Acceptable"));
      }
    } else {
      return next(createError(404, "Not Found Post"));
    }
  } catch {
    return next(createError(400, "Bad Request"));
  }
};

export const handleBrowsePost = async (req, res, next) => {
  try {
    await ApiBrowsePost(req.body.id, req.body.validator);
    return res.status(201).json({
      message: "ok",
      statuscode: 0,
    });
  } catch {
    return next(createError(404, "Not Found Post"));
  }
};

export const handleStatisticalFollowGenre = async (req, res, next) => {
  try {
    const data = await ApiStatisticalPostFollowGenres();
    return res.status(200).json(data);
  } catch {
    return next(createError(400, "Bad Request"));
  }
};

export const handleApiStatisticalPostFollowMonth = async (req, res, next) => {
  try {
    const data = await ApiStatisticalPostFollowMonth();
    return res.status(200).json(data);
  } catch {
    return next(createError(400, "Bad Request"));
  }
};

export const handleApiCount = async (req, res, next) => {
  try {
    const datapost = await ApiCountPost();
    const datapost7daysago = await ApiCount7DayAgo();
    return res.status(200).json({
      datapost,
      datapost7daysago,
    });
  } catch {
    return next(createError(400, "Bad Request"));
  }
};

export const handleApiCountFollowId = async (req, res, next) => {
  try {
    let id = req.query.id;
    const data = await ApiCountPostFollowId(id);
    if (data) {
      return res.status(200).json(data);
    } else {
      return next(createError(404, "Not Found Post"));
    }
  } catch {
    return next(createError(400, "Bad Request"));
  }
};

