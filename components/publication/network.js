const express = require("express");
const passport = require("passport");
const PublicationController = require("./controller");
const validatorHandler = require("../../middlewares/validation.handler");
const upload = require("../../utils/storagePublication");
const {
  getPublicationSchema,
  createPublicationSchema,
  updatePublicationSchema,
} = require("./schema");
const {
  checkAuthorizedRoles,
  checkIdPublicationForUser,
} = require("../../middlewares/auth.handler");
const ROLES = require("../../utils/permissions.util");
const router = express.Router();
const controller = new PublicationController();

router.get(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    validatorHandler(getPublicationSchema, "params"),
    checkAuthorizedRoles(...ROLES.registeredUser),
  ],
  controller.list
);

router.get(
  "/detail/:id",
  [
    passport.authenticate("jwt", { session: false }),
    validatorHandler(getPublicationSchema, "params"),
    checkAuthorizedRoles(...ROLES.registeredUser),
  ],
  controller.detail
);

router.get("/image/:file", controller.getImage);

router.get(
  "/feed/:page",
  [
    passport.authenticate("jwt", { session: false }),
    checkAuthorizedRoles(...ROLES.registeredUser),
  ],
  controller.feed
);

router.post(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    validatorHandler(createPublicationSchema, "body"),
    checkAuthorizedRoles(...ROLES.registeredUser),
  ],
  controller.save
);

router.post(
  "/upload/:id_publication",
  [
    passport.authenticate("jwt", { session: false }),
    checkAuthorizedRoles(...ROLES.registeredUser),
    upload.single("file0"),
  ],
  controller.upload
);

router.patch(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    validatorHandler(getPublicationSchema, "params"),
    validatorHandler(updatePublicationSchema, "body"),
    checkIdPublicationForUser(),
    checkAuthorizedRoles(...ROLES.registeredUser),
  ],
  controller.update
);

router.delete(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    validatorHandler(getPublicationSchema, "params"),
    checkIdPublicationForUser(),
    checkAuthorizedRoles(...ROLES.registeredUser),
  ],
  controller.delete
);

router.delete(
  "/admin/:id",
  [
    passport.authenticate("jwt", { session: false }),
    validatorHandler(getPublicationSchema, "params"),
    checkAuthorizedRoles(...ROLES.admin),
  ],
  controller.delete
);

module.exports = router;
