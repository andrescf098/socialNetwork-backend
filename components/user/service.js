const userModel = require("./model");
const boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const FollowService = require("../follow/service");
const followService = new FollowService();

class UseService {
  async find(page = 1, limit = 1, userId) {
    const options = {
      select: { password: 0, role: 0, email: 0, __v: 0 },
      sort: "_id",
      page,
      limit,
    };
    const users = await userModel.paginate({}, options);
    const userFollowing = await followService.followUserIds(userId);
    return {
      page: users.page,
      itemsPerPage: users.limit,
      totalPage: users.totalPages,
      totalUsers: users.totalDocs,
      users: users.docs,
      user_following: userFollowing.following,
      user_follow_me: userFollowing.followers,
    };
  }

  async findById(id, userId) {
    const user = await userModel
      .findById(id)
      .select({ password: 0, role: 0, email: 0, __v: 0 });
    const followInfo = await followService.followThisUser(id, userId);
    if (!user) {
      throw boom.unauthorized();
    }
    return {
      user,
      following: followInfo.following,
      follower: followInfo.follower,
    };
  }

  async findByEmail(email) {
    const user = await userModel.findOne({ email: email }).select("+password");
    if (!user) {
      throw boom.notFound("User not found");
    }
    return user;
  }

  async create(data) {
    const hash = await bcrypt.hash(data.password, 10);
    const newUser = await userModel({
      ...data,
      password: hash,
    });
    await newUser.save();
    return {
      name: newUser.name,
      lastname: newUser.lastname,
      nick: newUser.nick,
      email: newUser.email,
      role: newUser.role,
      createAt: newUser.createAt,
    };
  }

  async updtate(id, body) {
    if (body.password) {
      const hash = await bcrypt.hash(body.password, 10);
      const userData = {
        ...body,
        password: hash,
      };
      const user = await userModel
        .findByIdAndUpdate(id, userData, { new: true })
        .select({ password: 0 });
      if (!user) {
        throw boom.notFound("User not found");
      }
      return user;
    } else {
      const user = await userModel
        .findByIdAndUpdate(id, body, { new: true })
        .select({ password: 0 });
      if (!user) {
        throw boom.notFound("User not found");
      }
      return user;
    }
  }

  async delete(id) {
    await userModel.findByIdAndDelete(id);
    return { response: true };
  }
}

module.exports = UseService;
