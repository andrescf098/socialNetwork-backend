const express = require("express");
const passport = require("passport");
const router = express.Router();
const UserController = require("./controller");
const upload = require("../../utils/storageAvatar");
const {
  getUserSchema,
  createUserSchema,
  updateUserSchema,
} = require("./schema");
const {
  checkAuthorizedRoles,
  checkIdForUser,
} = require("../../middlewares/auth.handler");
const validatorHandler = require("../../middlewares/validation.handler");
const ROLES = require("../../utils/permissions.util");

const controller = new UserController();

router.get(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    checkAuthorizedRoles(...ROLES.registeredUser),
  ],
  controller.list
);

router.get(
  "/profile/:id",
  [
    passport.authenticate("jwt", { session: false }),
    checkAuthorizedRoles(...ROLES.registeredUser),
    validatorHandler(getUserSchema, "params"),
  ],
  controller.getById
);

router.get("/avatar/:file", controller.getAvatar);

router.get(
  "/count/:id?",
  [
    passport.authenticate("jwt", { session: false }),
    checkAuthorizedRoles(...ROLES.registeredUser),
  ],
  controller.count
);

router.post(
  "/",
  [validatorHandler(createUserSchema, "body")],
  controller.create
);

router.patch(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    checkAuthorizedRoles(...ROLES.registeredUser),
    checkIdForUser(),
    validatorHandler(getUserSchema, "params"),
    validatorHandler(updateUserSchema, "body"),
  ],
  controller.update
);

router.patch(
  "/admin/:id",
  [
    passport.authenticate("jwt", { session: false }),
    checkAuthorizedRoles(...ROLES.admin),
    validatorHandler(getUserSchema, "params"),
    validatorHandler(updateUserSchema, "body"),
  ],
  controller.update
);

router.post(
  "/upload",
  [
    passport.authenticate("jwt", { session: false }),
    checkAuthorizedRoles(...ROLES.registeredUser),
    upload.single("file0"),
  ],
  controller.upload
);

router.delete(
  "/admin/:id",
  [
    passport.authenticate("jwt", { session: false }),
    checkAuthorizedRoles(...ROLES.admin),
    validatorHandler(getUserSchema, "params"),
  ],
  controller.delete
);

module.exports = router;
