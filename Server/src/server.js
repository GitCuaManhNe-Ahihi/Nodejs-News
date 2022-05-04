import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import configViewEngineApp from "./config/viewEngine.js";
import InitRoute from "./route/InitRouteWeb.js";
import ConnectDB from "./config/connectDB.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(cors());
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)


  // Pass to next layer of middleware
  next();
});
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
configViewEngineApp(app);
InitRoute(app);

let port = process.env.PORT || 3606;
ConnectDB();
app.listen(port, () => {
  console.log("Server is running on port", port);
});
