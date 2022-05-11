import express from "express";
import multer from "multer";
import {
  handleApiCount, handleApiCountFollowId, handleApiDeleteUser, handleApiGetUser, handleApiStatisticalPostFollowMonth, handleBrowsePost, handleDeletePost,
  handleEditPost, handleLogin,
  handleNewPost,
  handleRegister,
  handleResAllPost, handleStatisticalFollowGenre, handleYourPost
} from "../controller/adminPageController.js";
import { homePage, postPage } from "../controller/homeController.js";
const route = express.Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./Server/src/files");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});
const InitRoute = (app) => {
  route.get("/", homePage).get("/post", postPage);

  route
    .post("/api/v1/authlogin", handleLogin)
    .get("/api/v1/alluser", handleApiGetUser)
    .get("/api/v1/post", handleResAllPost)
    .get("/api/v1/statisticalgenres", handleStatisticalFollowGenre)
    .get("/api/v1/statisticalmonth", handleApiStatisticalPostFollowMonth)
    .get("/api/v1/count", handleApiCount)
    .get("/api/v1/countpostid", handleApiCountFollowId)
    .post("/api/v1/yourpost", handleYourPost)
    .post(
      "/api/v1/newpost",
      upload.fields([{ name: "image", maxCount: 10 }, { name: "docx" }]),
      handleNewPost
    )
    .delete("/api/v1/delete", handleDeletePost)
    .delete("/api/v1/user", handleApiDeleteUser)
    .put(
      "/api/v1/change",
      upload.fields([{ name: "image", maxCount: 10 }, { name: "docx" }]),
      handleEditPost
    )
    .put("/api/v1/browse", handleBrowsePost);

  return app.use("/", route);
};
export default InitRoute;
