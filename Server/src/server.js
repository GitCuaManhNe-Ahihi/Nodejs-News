import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import ConnectDB from "./config/connectDB.js";
import configViewEngineApp from "./config/viewEngine.js";
import { LogEvent, streamMorgan } from "./Helper/index.js";
import InitAPI from "./route/InitAPIWeb.js";
import InitRouteWeb from "./route/Route.Ejs.js";
const createError = require("http-errors");

dotenv.config();

const app = express();
app.use(
  cors({origin:true})
);
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  }),
) 
//app.use(helmet()); // Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(
  morgan(
    `combined:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms`,
    { stream: streamMorgan }
  )
);
//Morgan is a logger middleware for node.js. It can be used to log all requests and responses to your server.

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT);
  
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Expose-Headers", "Authorization");
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
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
configViewEngineApp(app);
InitAPI(app);
InitRouteWeb(app)
app.use((req, res, next) => next(createError(404, "Not Found")));
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  LogEvent(req.method, req.url, err.message);
  res.json({
    message: err.message,
    status: err.status,
  });
});

let port = process.env.PORT || 3606;
ConnectDB();
app.listen(port, () => {
  console.log("Server is running on port", port);
});
