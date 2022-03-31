const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
module.exports = Router().post('/', authenticate, async (req, res, next) => {
  try {
    res.send({ hello: 'world' });
  } catch (error) {
    next(error);
  }
});
