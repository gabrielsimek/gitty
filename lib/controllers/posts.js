const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');
module.exports = Router().post('/', authenticate, async (req, res, next) => {
  try {
    console.log('req.body', req.body);
    console.log('req.user', req.user);

    const post = await Post.insert(req.body.post, req.user.username);
    res.send(post);
  } catch (error) {
    next(error);
  }
});
