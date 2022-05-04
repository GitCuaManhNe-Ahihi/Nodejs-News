import bcrypt from "bcryptjs";
import { createJwt } from "../middware/JwtAction";
import db from "../models";
import { Op } from "sequelize";
import moment from "moment";

let checkMail = async (email) => {
  return new Promise((resolve, reject) => {
    db.User.findOne({
      where: {
        email: email,
      },
      raw: true,
      logging: false,
    }).then((user) => {
      if (user) {
        resolve(user);
      } else {
        resolve(false);
      }
    });
  }).catch((err) => {
    reject(err);
  });
};

export let queryUserLogin = async (email, password) => {
  return new Promise(async (resolve, reject) => {
    let mail = await checkMail(email);
    if (mail) {
      let user = await db.User.findOne({
        where: {
          email: email,
        },
        attributes: ["password"], // cho nay can hash nhe
        raw: true,
        logging: false,
      });
      if (user) {
        if (await bcrypt.compare(password, user.password)) {
          let userInfo = await db.User.findOne({
            where: { email: email },
            raw: true,
            logging: false,
            attributes: { exclude: ["password", "createdAt", "updatedAt"] },
          });
          let { tokenaccess, tokenrefresh } = createJwt(userInfo);
          resolve({
            ...userInfo,
            message: "",
            code: 0,
            tokenaccess,
            tokenrefresh,
          });
        } else {
          resolve({ message: "Password is wrong", code: 1 });
        }
      } else {
        resolve({ code: 3, message: "not found account" });
      }
    } else {
      resolve({ code: 2, message: "email is incorrect" });
    }
  });
};

export let queryUserRegister = async (data) => {
  return new Promise(async (resolve, reject) => {
    let mail = await checkMail(data.email);
    if (mail) {
      resolve({ code: 2, message: "email is existed" });
    } else {
      db.User.create(data)
        .then((data) => {
          resolve({ code: 0, message: "ok" });
        })
        .catch((err) => {
          reject(err);
        });
    }
  }).catch((err) => {
    reject(err);
  });
};

export let ApiCountUser = async () => {
  return new Promise((resolve, reject) => {
    db.User.count({
      raw: true,
      logging: false,
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  }).catch((err) => {  
    reject(err);
  });
};
export let ApiCountUser7DaysAgo = async () => {
  return new Promise((resolve, reject) => {
    db.User.count({
      where: {
        createdAt: {
          [Op.gte]: moment().subtract(7, "days").toDate(),
          [Op.lt]: moment().subtract(6, "days").toDate(),
        },
      },
      raw: true,
      logging: false,
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  }).catch((err) => {
    reject(err);
  });
};

export let ApiDeleteUser = async (id) => {
  return new Promise((resolve, reject) => {
    db.Post.destroy({
      where: {
        userId: id,
      },
    })
      .then(() => {
        db.User.destroy({
          where: {
            id: id,
          },
        })
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

export let ApiGetUser = async () => {
  return new Promise((resolve, reject) => {
    db.User.findAll({
      raw: true,
      logging: false,
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  }).catch((err) => {
    reject(err);
  });
};
