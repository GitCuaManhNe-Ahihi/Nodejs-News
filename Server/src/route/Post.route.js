import * as ARTICLE from "../controller/adminPageController"
import multer from "multer";
import * as LOAD from "../controller/fileController";
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
  route.get("/article", ARTICLE.handleResAllPost);
  route.get("/statisticalgenres", ARTICLE.handleStatisticalFollowGenre);
  route.get("/statisticalmonth", ARTICLE.handleApiStatisticalPostFollowMonth);
  route.get("/article/sum", ARTICLE.handleApiCount);
  route.get("/article/sum/id", ARTICLE.handleApiCountFollowId);
  route.post("/article/own", ARTICLE.handleYourPost);
  route.post("/article/new", ARTICLE.handleNewPost);
  route.post("/picture", upload.single("image"), LOAD.handUploadimage);
  route.delete("/picture", LOAD.handleimageDestroy);
  route.delete("/article", ARTICLE.handleDeletePost);
  route.put("/article", ARTICLE.handleEditPost);
  route.patch("/article/browser", ARTICLE.handleBrowsePost);
};

export default Article_route;
