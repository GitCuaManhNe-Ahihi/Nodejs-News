import { decodeJwt } from "../middware/JwtAction";
import { queryUserLogin } from "../serviceQuery/userQuery";

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

export let handleCheckToken = async (req, res) => {
  try {
    const accessToken = req.body.accesstoken
    const info = decodeJwt(accessToken);
    if (info) {
      return res.status(200).json({ message: info.message, info });
    } else {
      return res.status(200).json({ message: "error", code: 1 });
    }
  } catch (err) {
    return res.status(400).json({ code: 2, message: "err" });
  }
};
