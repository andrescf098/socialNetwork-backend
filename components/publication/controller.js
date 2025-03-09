const PublicationService = require("./service");
const FollowService = require("../follow/service");
const model = require("./model");
const fs = require("fs");
const path = require("path");
const service = new PublicationService();
const followService = new FollowService();

class PublicationController {
  async list(req, res, next) {
    const userId = req.params.id;
    try {
      res
        .status(200)
        .json(await service.list(userId, req.query.page, req.query.limit));
    } catch (error) {
      next(error);
    }
  }

  async save(req, res, next) {
    try {
      res.status(201).json(await service.create(req.body, req.user.sub));
    } catch (error) {
      next(error);
    }
  }

  async getImage(req, res, next) {
    const pathFile = "./assets/publications/" + req.params.file;
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

  async feed(req, res, next) {
    const page = req.params.page;
    const limit = req.query.limit;
    try {
      const myFollows = await followService.followUserIds(req.user.sub);
      res
        .status(200)
        .json(await service.feed(page, limit, myFollows.following));
    } catch (error) {
      next(error);
    }
  }

  async upload(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).send({ message: "Must have a file" });
      }
      const publicationId = req.params.id_publication;
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
            await model.findByIdAndUpdate(
              { user: req.user.sub, _id: publicationId },
              { file: req.file.filename },
              { new: true }
            )
          );
      }
    } catch (error) {
      next(error);
    }
  }

  async detail(req, res, next) {
    const { id } = req.params;
    try {
      res.status(200).json(await service.findById(id));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    const { id } = req.params;
    try {
      res.status(200).json(await service.update(id, req.body));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    const { id } = req.params;
    try {
      res.status(200).json(await service.delete(id));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PublicationController;
