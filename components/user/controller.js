const UserService = require("./service");
const fs = require("fs");
const model = require("./model");
const followModel = require("../follow/model");
const publicationModel = require("../publication/model");
const path = require("path");
const userService = new UserService();

class UserController {
  async list(req, res, next) {
    try {
      return res
        .status(200)
        .json(
          await userService.find(req.query.page, req.query.limit, req.user.sub)
        );
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      return res.status(200).json(await userService.findById(id, req.user.sub));
    } catch (error) {
      next(error);
    }
  }

  async count(req, res, next) {
    let userId = req.user.sub;
    if (req.params.id) {
      userId = req.params.id;
    }
    try {
      const following = await followModel.count({ user: userId });
      const followed = await followModel.count({ followed: userId });
      const publications = await publicationModel.count({ user: userId });
      return res.status(200).json({
        userId,
        following,
        followed,
        publications,
      });
    } catch (error) {}
  }

  async create(req, res, next) {
    try {
      const body = req.body;
      res.status(201).json(await userService.create(body));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const body = req.body;
      res.status(200).json(await userService.updtate(id, body));
    } catch (error) {
      next(error);
    }
  }

  async upload(req, res, next) {
    if (!req.file) {
      reject("Invalid query");
    }
    const file = req.file.filename;
    const file_split = file.split(".");
    const extension = file_split[1];
    if (
      extension != "png" &&
      extension != "jpg" &&
      extension != "jpeg" &&
      extension != "gif"
    ) {
      fs.unlinkSync(req.file.path);
      return {
        Error:
          "Invalid file extension, only extensions are supported (png, jpg, jpeg or gif)",
      };
    } else {
      res
        .status(200)
        .json(
          await model
            .findByIdAndUpdate(
              req.user.sub,
              { image: req.file.filename },
              { new: true }
            )
            .select({ password: 0 })
        );
    }
  }

  async getAvatar(req, res, next) {
    const pathFile = "./assets/avatar/" + req.params.file;
    fs.stat(pathFile, (error, exist) => {
      if (exist) {
        res.status(200).sendFile(path.resolve(pathFile));
      } else {
        res.status(404).send({
          message: "File not found",
        });
      }
    });
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      res.status(200).json(await userService.delete(id));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
