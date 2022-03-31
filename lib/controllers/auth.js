const { Router } = require('express');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');
const jwt = require('jsonwebtoken');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
module.exports = Router()
  .get('/login', async (req, res, next) => {
    try {
      res.redirect(
        `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=http://localhost:7890/api/v1/github/login/callback`
      );
    } catch (error) {
      next(error);
    }
  })
  .get('/login/callback', async (req, res, next) => {
    try {
      const token = await exchangeCodeForToken(req.query.code);
      const { login, email, avatar_url } = await getGithubProfile(token);
      let user = await GithubUser.findByUsername(login);

      if (!user) {
        user = await GithubUser.insert({
          email,
          username: login,
          avatar: avatar_url,
        });
      }
      const authToken = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });
      res
        .cookie('session', authToken, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })

        .redirect('/api/v1/posts');
    } catch (error) {
      next(error);
    }

    // TODO:
    // * get code
    // * exchange code for token
    // * get info from github about user with token
    // * get existing user if there is one
    // * if not, create one
    // * create jwt
    // * set cookie and redirect
    // */
  });
