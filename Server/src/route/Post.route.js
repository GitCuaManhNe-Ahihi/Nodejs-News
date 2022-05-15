const {
  handleApiCount,
  handleResAllPost,
  handleStatisticalFollowGenre,
  handleApiStatisticalPostFollowMonth,
  handleApiCountFollowId,
  handleYourPost,
  handleNewPost,
  handleDeletePost,
  handleBrowsePost,
  handleEditPost,
} = require("../controller/adminPageController");
import multer from "multer";
import { handleimageDestroy, handUploadimage } from "../controller/fileController";
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./Server/src/files");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    },
  }),
});
const Article_route = (route) => {
  route.get("/article", handleResAllPost);
  route.get("/statisticalgenres", handleStatisticalFollowGenre);
  route.get("/statisticalmonth", handleApiStatisticalPostFollowMonth);
  route.get("/article/sum", handleApiCount);
  route.get("/article/sum/id", handleApiCountFollowId);
  route.post("/article/own", handleYourPost);
  route.post("/article/new", handleNewPost);
  route.post("/picture", upload.single("image"), handUploadimage);
  route.delete("/picture", handleimageDestroy);
  route.delete("/article", handleDeletePost);
  route.put("/article", handleEditPost);
  route.patch("/article/browser", handleBrowsePost);
};

export default Article_route;
