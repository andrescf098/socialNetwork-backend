const boom = require("@hapi/boom");
const { config } = require("../config");
const publicationModel = require("../components/publication/model");
const userModel = require("../components/user/model");

const checkApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey === config.apiKey) {
    next();
  } else {
    next(boom.unauthorized());
  }
};
const checkAuthorizedRoles = (...roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (roles.includes(user.role)) {
      next();
    } else {
      next(boom.unauthorized());
    }
  };
};
const checkIdPublicationForUser = () => {
  return async (req, res, next) => {
    try {
      const userIdFromPublication = await publicationModel.findById(
        req.params.id
      );
      const user = req.user.sub;
      if (String(user) === String(userIdFromPublication.user)) {
        next();
      } else {
        next(boom.unauthorized());
      }
    } catch (error) {
      next(boom.unauthorized());
    }
  };
};
const checkIdForUser = () => {
  return async (req, res, next) => {
    try {
      const userId = await userModel.findById(req.params.id);
      const user = req.user.sub;
      if (String(user) === String(userId._id)) {
        next();
      } else {
        next(boom.unauthorized());
      }
    } catch (error) {
      next(boom.unauthorized());
    }
  };
};

module.exports = {
  checkApiKey,
  checkAuthorizedRoles,
  checkIdForUser,
  checkIdPublicationForUser,
};
