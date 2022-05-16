import { homePage, postPage } from "../controller/homeController";
import express from "express";

const route = express.Router();
const InitRouteWeb = (app) => {
  route.get("/", homePage).get("/post", postPage);
  return app.use(route);
};
export default InitRouteWeb;
