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

export let CheckUser = async (email) => {
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

export let AddUser = async (data) => {
  return new Promise((resolve, reject) => {
    db.User.create(data)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export let UpdateUser = async (id, data) => {
  return new Promise((resolve, reject) => {
    db.User.update(data, {
      where: {
        id: id,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export let CheckPassword = async (id, password) => {
  return new Promise((resolve, reject) => {
    db.User.findOne({
      where: {
        id: id,
      },
      raw: true,
      logging: false,
    })
      .then(async (user) => {
        if (user) {
          if (await bcrypt.compare(password, user.password)) {
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export let findOneUser = async (id) => {
  return new Promise((resolve, reject) => {
    db.User.findOne({
      where: {
        id: id,
      },
      raw: true,
      logging: false,
    })
      .then((user) => {
        if (user) {
          resolve(user);
        } else {
          resolve(false);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}