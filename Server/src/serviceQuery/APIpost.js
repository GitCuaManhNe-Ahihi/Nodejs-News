import db, { sequelize } from "../models";
import { destroyFile } from "./cloudinary";
import moment from "moment";
const { Op } = require("sequelize");
export const ApiAllpost = async () => {
  return new Promise((resolve, reject) => {
    db.Post.findAll({
      raw: true,
      logging: false,
      include: [
        {
          model: db.User,
          attributes: ["name"],
          as: "user",
        },
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
export const ApiOnePost = async (id) => {
  return new Promise((resolve, reject) => {
    db.Post.findOne({
      raw: true,
      logging: false,
      where: { id: id },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err, { message: "fail", code: 0 });
      });
  });
};
export const ApiYourPost = async (id) => {
  return new Promise((resolve, reject) => {
    db.Post.findAll({
      raw: true,
      logging: false,
      where: {
        userId: id,
      },
      include: [
        {
          model: db.User,
          attributes: ["name"],
          as: "user",
        },
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
export const ApiNewArticle = async (data) => {
  return new Promise((resolve, reject) => {
    db.Post.create(data)
      .then((data) => {
        resolve({ message: "ok", code: 0 });
      })
      .catch((err) => {
        console.log(err);
        reject({ message: "fail", code: 1 });
      });
  });
};

export const ApiDeletePost = async (id) => {
  return new Promise(async (resolve, reject) => {
    db.Post.destroy({
      where: {
        id: id,
      },
    })
      .then((data) => {
        resolve({ message: "ok", code: 0 });
      })
      .catch((err) => {
        reject({ message: "fail", code: 1 });
      });
  });
};

export const ApiUpdatePost = async (id, data) => {
  return new Promise((resolve, reject) => {
    db.Post.update(data, {
      where: {
        id: id,
      },
    })
      .then((data) => {
        resolve({ message: "ok", code: 0 });
      })
      .catch((err) => {
        reject({ message: "fail", code: 1 });
      });
  });
};

export const ApiBrowsePost = async (id, validator) => {
  console.log(validator);
  return new Promise((resolve, reject) => {
    db.Post.findOne({
      raw: true,
      logging: false,
      where: { id: id },
    })
      .then((data) => {
        db.Post.update(
          { ...data, validator: +validator },
          { where: { id: id } }
        )
          .then((data) => {
            resolve({ message: "ok", code: 0 });
          })
          .catch((err) => {
            reject({ message: "fail", code: 1 });
          });
      })
      .catch((err) => {
        reject(err, { message: "not find this post", code: 1 });
      });
  });
};

export const ApiStatisticalPostFollowGenres = async () => {
  return new Promise((resolve, reject) => {
    db.Post.findAll({
      raw: true,
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
      attributes: [
        [sequelize.col("genres.name"), "name"],
        [sequelize.fn("COUNT", sequelize.col("genres.name")), "count"],
      ],
      group: "genres.name",
    })

      .then((data) => {
        resolve(data, { message: "ok", code: 0 });
      })
      .catch((err) => {
        reject(err, { message: err, code: 0 });
      });
  });
};
export const ApiStatisticalPostFollowMonth = async () => {
  return new Promise((resolve, reject) => {
    db.Post.findAll({
      raw: true,
      logging: false,
      where: {
        validator: 1,
      },
      attributes: [
        [sequelize.fn("MONTH", sequelize.col("createdAt")), "month"],
        [sequelize.fn("COUNT", sequelize.col("createdAt")), "count"],
        "genresId",
      ],
      group: ["month", "genresId"],
    })

      .then((data) => {
        resolve(data, { message: "ok", code: 0 });
      })
      .catch((err) => {
        console.log(err);
        reject(err, { message: err, code: 0 });
      });
  });
};

export const ApiCountPost = async () => {
  return new Promise((resolve, reject) => {
    db.Post.count({
      where: {
        validator: 1,
      },
    })
      .then((data) => resolve(data, { message: "ok", code: 0 }))
      .catch((err) => {
        reject(err, { message: err, code: 0 });
      });
  });
};

export const ApiCount7DayAgo = async () => {
  return new Promise((resolve, reject) => {
    db.Post.count({
      where: {
        validator: 1,
        createdAt: {
          [Op.gte]: moment().subtract(7, "days").toDate(),
          [Op.lt]: moment().subtract(6, "days").toDate(),
        },
      },
    })
      .then((data) => resolve(data, { message: "ok", code: 0 }))
      .catch((err) => {
        reject(err, { message: err, code: 0 });
      });
  });
};

export const ApiCountPostFollowId = async (id) => {
  return new Promise((resolve, reject) => {
    db.Post.findAll({
      where: {
        userId: id,
      },
      raw: true,
      logging: false,
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("validator")), "count"],
        [sequelize.col("validator"), "validator"],
      ],
      group: "validator",
    })
      .then((data) => resolve(data, { message: "ok", code: 0 }))
      .catch((err) => {
        reject(err, { message: err, code: 0 });
      });
  });
};
