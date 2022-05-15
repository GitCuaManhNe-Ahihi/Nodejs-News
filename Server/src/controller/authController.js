import { decodeJwt } from "../middware/JwtAction";
import { queryUserLogin } from "../serviceQuery/userQuery";
const createError = require("http-errors");



export let handleLogin = async (req, res,next) => {
  if (req.body.email && req.body.password) {
    const users = await queryUserLogin(req.body.email, req.body.password);
    if (!users.code) {
      let { tokenrefresh,tokenaccess} = users;
      res.setHeader("Authorization", tokenaccess);
      res.cookie("tokenrefresh", tokenrefresh, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSide: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
     
      return  res.status(201).json({message:"ok",statuscode:0});
    } else {
      return next(createError(404, "Account or Password is incorrect"));
    }
  } else {
    return next(createError(400, "You should input email and password"));
  }
};



export let handleCheckToken = async (req, res,next) => {
  try {
    const accessToken = req.headers.authorization;
    const info = decodeJwt(accessToken.split(" ")[1]);
    if (info) {
      return res.status(200).json({ message: info.message, info });
    } else {
      return next(createError(403, "Token is invalid"));
    }
  } catch (err) {
    return next(createError(400, "Bad Request"));
  }
};
