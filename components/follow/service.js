const boom = require("@hapi/boom");
const followModel = require("./model");
const { ObjectId } = require("mongodb");

class FollowService {
  async save(id, idFollowed) {
    const data = {
      user: id,
      followed: new ObjectId(idFollowed),
    };
    const followed = await followModel(data);
    followed.save();
    return followed;
  }
  async unfollow(id, idFollowed) {
    await followModel.deleteOne({ user: id, followed: idFollowed });
    return { response: true };
  }
  async following(userId, page = 1, limit = 5) {
    const query = { user: userId };
    const options = {
      page,
      limit,
      populate: {
        path: "user followed",
        select: "-password -role -__v -email",
      },
    };
    const following = await followModel.paginate(query, options);
    if (!following) {
      throw boom.notFound();
    }
    const userFollowing = await this.followUserIds(userId);
    return {
      page: following.page,
      itemPerPage: following.limit,
      totalPages: following.totalPages,
      totalFollowing: following.totalDocs,
      following: following.docs,
      user_following: userFollowing.following,
      user_follow_me: userFollowing.followers,
    };
  }
  async followers(userId, page = 1, limit = 5) {
    const query = { followed: userId };
    const options = {
      page,
      limit,
      populate: {
        path: "user",
        select: "-password -role -__v -email",
      },
    };
    const followers = await followModel.paginate(query, options);
    if (!followers) {
      throw boom.notFound();
    }
    const userFollowers = await this.followUserIds(userId);
    return {
      page: followers.page,
      itemPerPage: followers.limit,
      totalPages: followers.totalPages,
      totalFollowers: followers.totalDocs,
      followers: followers.docs,
      user_following: userFollowers.following,
      user_follow_me: userFollowers.followers,
    };
  }

  async followUserIds(userId) {
    const followingClean = [];
    const followersClean = [];
    try {
      const following = await followModel
        .find({ user: userId })
        .select({ _id: 0, __v: 0, user: 0, createAt: 0 });
      following.forEach((follow) => {
        followingClean.push(follow.followed);
      });
      const followers = await followModel
        .find({ followed: userId })
        .select({ _id: 0, __v: 0, followed: 0, createAt: 0 });
      followers.forEach((follow) => {
        followersClean.push(follow.user);
      });
      return {
        following: followingClean,
        followers: followersClean,
      };
    } catch (error) {
      return { Error: error.message };
    }
  }
  async followThisUser(userId, idFollowed) {
    try {
      const following = await followModel.findOne({
        user: userId,
        followed: idFollowed,
      });
      const follower = await followModel.findOne({
        user: idFollowed,
        followed: userId,
      });
      return {
        following,
        follower,
      };
    } catch (error) {
      return { Error: error.message };
    }
  }
}

module.exports = FollowService;
