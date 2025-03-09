const express = require("express");
const config = require("./config");
const routerApi = require("./routes");
const connect = require("./db");
const cors = require("cors");
const {
  boomErrorHandler,
  logErrors,
  errorHandler,
} = require("./middlewares/error.handler");

const app = express();

const whiteListCORS = ["http://localhost:5173"];
const options = {
  origin: (origin, callback) => {
    if (whiteListCORS.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed"));
    }
  },
};
app.use(cors(options));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
routerApi(app);
app.listen(config.port, () => {
  console.log("Server is running on port: " + config.port);
});

connect()
  .then(() => {
    console.log("Database is connected");
  })
  .catch((error) => {
    console.log(error);
  });

require("./utils/auth.util");
app.use(boomErrorHandler);
app.use(logErrors);
app.use(errorHandler);
