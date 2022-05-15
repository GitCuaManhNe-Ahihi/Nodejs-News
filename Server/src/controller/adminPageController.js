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
import { ApiDeleteUser, ApiGetUser } from "../serviceQuery/userQuery";
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
    if (
      req.body.content &&
      req.body.title &&
      req.body.userId &&
      req.body.genresId
    ) {
      const data = {
        content: req.body.content,
        title: req.body.title,
        userId: req.body.userId,
        genresId: req.body.genresId,
        public_id: req.body.public_id,
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
    ApiDeletePost(req.query.id)
      .then((data) => {
        return res.status(204).json({ message: "ok", statuscode: 0 });
      })
      .catch((err) => {
        return next(createError(404, "Not Found Post"));
      });
  } catch (err) {
    next(createError(404, "Not Found Post"));
  }
};

export const handleEditPost = async (req, res, next) => {
  try {
    const id = req.body.id;
    let postOriginal = await ApiOnePost(id);
    if (postOriginal) {
      const data = {
        content: req.body.content ? req.body.content : postOriginal.content,
        title: req.body.title ? req.body.title : postOriginal.title,
        genresId: req.body.genresId
          ? +req.body.genresId
          : +postOriginal.genresId,
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

export const handleApiDeleteUser = async (req, res, next) => {
  try {
    try {
      await ApiDeleteUser(req.query.id);
      return res.status(204).json({ message: "ok", statuscode: 0 });
    } catch {
      return next(createError(404, "Not Found User"));
    }
  } catch {
    return next(createError(400, "Bad Request"));
  }
};

export const handleApiGetUser = async (req, res, next) => {
  try {
    const data = await ApiGetUser();
    return res.status(200).json(data);
  } catch {
    return next(createError(400, "Bad Request"));
  }
};
