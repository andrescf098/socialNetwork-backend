const FollowService = require("./service");
const service = new FollowService();

class FollowController {
  async save(req, res, next) {
    const { idFollowed } = req.body;
    try {
      res.status(200).json(await service.save(req.user.sub, idFollowed));
    } catch (error) {
      next(error);
    }
  }
  async unfollow(req, res, next) {
    const idFollowed = req.params.id;
    try {
      res.status(200).json(await service.unfollow(req.user.sub, idFollowed));
    } catch (error) {
      next(error);
    }
  }
  async following(req, res, next) {
    try {
      res
        .status(200)
        .json(
          await service.following(
            req.params.id,
            req.query.page,
            req.query.limit
          )
        );
    } catch (error) {
      next(error);
    }
  }
  async followers(req, res, next) {
    try {
      res
        .status(200)
        .json(
          await service.followers(
            req.params.id,
            req.query.page,
            req.query.limit
          )
        );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FollowController;
