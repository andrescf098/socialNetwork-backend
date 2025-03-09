const express = require("express");
const router = express.Router();
const AuthService = require("./service");
const passport = require("passport");

const service = new AuthService();

router.post(
  "/login",
  [passport.authenticate("local", { session: false })],
  async (req, res, next) => {
    try {
      const user = req.user;
      res.status(200).json(await service.signToken(user));
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
