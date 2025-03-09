const { Strategy, ExtractJwt } = require("passport-jwt");
const config = require("../../config");

const option = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

const JwtStrategy = new Strategy(option, (payload, done) => {
  return done(null, payload);
});

module.exports = JwtStrategy;
