const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');
const GithubUser = require('../models/GithubUser');

module.exports = class UserService {
  static async create(code) {
    const token = await exchangeCodeForToken(code);
    const { login, email, avatar_url } = await getGithubProfile(token);
    let user = await GithubUser.findByUsername(login);

    if (!user) {
      user = await GithubUser.insert({
        email,
        username: login,
        avatar: avatar_url,
      });
    }

    return user;
  }
};
