import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const genereateAccessToken = (data, key) => {
  try {
    let token = jwt.sign(data, key, {
      expiresIn: "1h",
    });
    return token;
  } catch (err) {
    console.log(err);
  }
};

const genereateRefreshToken = (data, key) => {
  try {
    let token = jwt.sign(data, key, {
      expiresIn: "7d",
    });
    return token;
  } catch (err) {
    console.log(err);
  }
};

export const createJwt = (data) => {
  try {
    let key = process.env.JWT_SECRET;
    const tokenaccess = genereateAccessToken(data, key);
    const tokenrefresh = genereateRefreshToken(data, key);
    return { tokenaccess, tokenrefresh };
  } catch (err) {
    console.log(err);
  }
};

export const decodeJwt = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    console.log(err);
  }
};
