const express = require("express");
const user = require("../components/user/network");
const auth = require("../components/auth/network");
const follow = require("../components/follow/network");
const publication = require("../components/publication/network");

function routerApi(app) {
  const router = express.Router();
  app.use("/api/v1", router);
  router.use("/users", user);
  router.use("/auth", auth);
  router.use("/follow", follow);
  router.use("/publication", publication);
}

module.exports = routerApi;
