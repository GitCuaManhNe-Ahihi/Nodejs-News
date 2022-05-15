import path from "path";
import { format } from "date-fns";
const rfs = require("rotating-file-stream");
import { Writable } from "stream";



const streamMorgan = rfs.createStream(`${format(new Date(),'dd-MM-yy')}_LogMorgan.log`, {
  size: "10M", // rotate every 10 MegaBytes written
  interval: "1d", // rotate daily
  compress: "gzip", // compress rotated files
  path: path.join(__dirname, "../Logs/logmorgan")
});


const streamError = rfs.createStream(`${format(new Date(),'dd-MM-yy')}_LogError.log`, {
    size: "10M", // rotate every 10 MegaBytes written
    interval: "1d", // rotate daily
    compress: "gzip", // compress rotated files
    path: path.join(__dirname, "../Logs/logerror")
});

const LogEvent = (type,url, message) => {
    const date = new Date();
    const dateFormat = format(date, "dd-MM-yyyy HH:mm:ss");
    const log = `${dateFormat}-${type}-${url}-${message}`;
    console.log(log);
    streamError.write(log + "\n");
};
module.exports = {
    streamMorgan,
    LogEvent
}