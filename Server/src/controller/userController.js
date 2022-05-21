import bcrypt from "bcryptjs";
import { sendMail, sendMailForgetPassword } from "../nodemailer";
import {
  AddUser,
  ApiDeleteUser,
  ApiGetUser,
  CheckPassword,
  CheckUser,
  UpdateUser,
} from "../serviceQuery/userQuery";
import * as HELPER from "../Helper/index.js";
import * as CLOUDINARY from "../serviceQuery/cloudinary.js";

const createError = require("http-errors");
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

export const handleAddUser = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;
    const check = await CheckUser(email);
    if (check) {
      return next(createError(409, "Email is existed"));
    } else {
      let hash = bcrypt.hashSync(password, 10);
      const data = {
        email: email,
        password: hash,
        name: name,
        admin: role,
        image:
          "https://res.cloudinary.com/hauimanhneahihi/image/upload/v1653025417/Sample_User_Icon_iffeys.png",
        gender: 0,
        phoneNumber: "",
        address: "",
        birthDay: "",
      };
      try {
        await AddUser(data);
        sendMail(password, email);
        return res.status(201).json({ message: "ok", statuscode: 0 });
      } catch {
        return next(createError(406, "Not Acceptable"));
      }
    }
  } catch {
    return createError(400, "Bad Request");
  }
};
export const handleForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.query;
    const check = await CheckUser(email);
    if (!check) {
      return next(createError(409, "Email is not existed"));
    } else {
      const password = (Math.floor(Math.random() * 9999999) + 1000000)
        .toString()
        .slice(1);
      await UpdateUser(check.id, { password: bcrypt.hashSync(password, 10) });
      sendMailForgetPassword(password, email);
      return res.status(200).json({ message: "ok", statuscode: 0 });
    }
  } catch {
    return next(createError(400, "Bad Request"));
  }
};

export const handleChangePassword = async (req, res, next) => {
  try {
    const { old, news, id } = req.body;
    console.log(old, news, id);
    try {
      const check = await CheckPassword(id, old);
      console.log(check);
      if (!check) {
        return next(createError(409, "Password is not correct"));
      } else {
        await UpdateUser(id, { password: bcrypt.hashSync(news, 10) });
        return res.status(200).json({ message: "ok", statuscode: 0 });
      }
    } catch {
      return next(createError(401, "Unauthorized"));
    }
  } catch {
    return next(createError(400, "Bad Request"));
  }
};
export const handleEditUser = async (req, res, next) => {
  try {
    if (req?.file?.path) {
      try {
        const image = await CLOUDINARY.uploadFile(req?.file?.path);
        let { name, phoneNumber, address, birthDay, gender, admin } = req.body;
        let data;
        for (const [key, value] of Object.entries( { name,phoneNumber, address, birthDay, gender, admin,image:image.url})) {
          if (value) data = { ...data, [key]: value };
        }
        HELPER.removeFileImage(req?.file?.path);
        await UpdateUser(req.body.id, { ...data});
        return res.status(200).json({ message: "ok", statuscode: 0 });
      } catch {
        return next(createError(406, "Not Acceptable"));
      }
    } else {
      try {
        let { name,phoneNumber, address, birthDay, gender, admin } = req.body;
        let data;
        for (const [key, value] of Object.entries( { name,phoneNumber, address, birthDay, gender, admin })) {
          if (value) data = { ...data, [key]: value };
          if(value=== 0 && key == 'admin')
          {
            data = { ...data, [key]: value }
          }
        }
        await UpdateUser(req.body.id, data);
        return res.status(200).json({ message: "ok", statuscode: 0 });
      } catch {
        return next(createError(406, "Not Acceptable"));
      }
    }
  } catch (error) {
    return next(createError(400, "Bad Request"));
  }
};
