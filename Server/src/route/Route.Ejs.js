import { homePage, postPage } from "../controller/homeController";
import express from "express";

const route = express.Router();
export default InitRouteWeb = (app) => {
     route.get("/", homePage)
          .get("/post", postPage);
    return app.use(route);

}