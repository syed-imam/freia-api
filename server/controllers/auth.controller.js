import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import user from '../models/user.model';
import _ from 'lodash';
// sample user, used for authentication



/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity

  user.findOne({ 'email': req.body.username, 'password': req.body.password }, function (err, person) {

    if (err) {
    }
    else {
      if (_.isEmpty(person)) {
        const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
        return next(err);
      }
      else
      {const token = jwt.sign({
         username: person.email
      }, config.jwtSecret);
      return res.json({
        token,
        username: person.email
      });
    }
    }

  });
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

export default { login, getRandomNumber };
