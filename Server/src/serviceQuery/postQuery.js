import db from "../models";
import moment from "moment";
const { Op } = require("sequelize");
export const QueryAllpost = async () => {
  return new Promise((resolve, reject) => {
    db.Post.findAll({
      raw: true,
      limit: 100,
      logging: false,
      where: {
        validator: 1,
      },
      include: [
        {
          model: db.Genres,
          attributes: ["name"],
          as: "genres",
        },
      ],
    })
      .then((data) => {
        resolve(data, { message: "ok", code: 0 });
      })
      .catch((err) => {
        reject(err, { message: "ok", code: 0 });
      });
  });
};
export const Postnew = async (data) => {
  return new Promise((resolve, reject) => {
    db.Post.create(data)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const PostFollowId = async (ID) => {
  return new Promise((resolve, reject) => {
    db.Post.findAll({
      logging: false,
      where: {
        id: {
          [Op.eq]: ID,
        },
      },
      include: [
        {
          model: db.User,
          attributes: ["name", "email", "image"],
          as: "user",
        },
        {
          model: db.Genres,
          attributes: ["name"],
          as: "genres",
        },
      ],
      raw: true,
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const PostNearTime = async (data) => {
  return new Promise((resolve, reject) => {
    db.Post.findAll({
      logging: false,
      where: {
        createdAt: {
          [Op.gte]: moment().subtract(3, "hours").toDate(),
        },
        validator: 1,
      },
      include: [
        {
          model: db.Genres,
          attributes: ["name"],
          as: "genres",
        },
      ],
      limit: 3,
      raw: true,
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const post24H = async () => {
  try {
    const post = await db.Post.findAll({
      where: {
        createdAt: {
          [Op.gte]: moment().subtract(1, "days").toDate(),
        },
        validator: 1,
      },
      include: [
        {
          model: db.Genres,
          attributes: ["name"],
          as: "genres",
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 6,
      raw: true,
      logging: false,
    });
    if (post) {
      return post;
    }
    return [];
  } catch (err) {
    return [];
  }
};
export const getAllGenres = async () => {
  return new Promise((resolve, reject) => {
    db.Genres.findAll({
      logging: false,
      raw: true,
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject([]);
      });
  });
};
