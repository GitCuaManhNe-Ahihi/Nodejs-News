import express from "express";
import { handleApiGetUser } from "../controller/adminPageController.js";
import ApiRoute from "./Api.route.js";
const route = express.Router();

const InitAPI = (app) => {
  ApiRoute(route);
  return app.use("/api/v1",route);
};
export default InitAPI;