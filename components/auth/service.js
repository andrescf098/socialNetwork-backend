const userModel = require("../user/model");
const userService = require("../user/service");
const boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config");

const service = new userService();
class AuthService {
  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw boom.unauthorized();
    }
    return user;
  }

  async signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
    };
    const userData = {
      email: user.email,
      nick: user.nick,
      role: user.role,
    };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: 360000 });
    return { userData, token };
  }
}
module.exports = AuthService;
