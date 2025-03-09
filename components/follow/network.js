const express = require("express");
const router = express.Router();
const FollowController = require("./controller");
const passport = require("passport");
const { checkAuthorizedRoles } = require("../../middlewares/auth.handler");
const ROLES = require("../../utils/permissions.util");
const controller = new FollowController();

router.get(
  "/following/:id",
  [
    passport.authenticate("jwt", { session: false }),
    checkAuthorizedRoles(...ROLES.registeredUser),
  ],
  controller.following
);

router.get(
  "/followers/:id",
  [
    passport.authenticate("jwt", { session: false }),
    checkAuthorizedRoles(...ROLES.registeredUser),
  ],
  controller.followers
);

router.post(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    checkAuthorizedRoles(...ROLES.registeredUser),
  ],
  controller.save
);

router.delete(
  "/unfollow/:id",
  [
    passport.authenticate("jwt", { session: false }),
    checkAuthorizedRoles(...ROLES.registeredUser),
  ],
  controller.unfollow
);

module.exports = router;
