import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import user from '../models/user.model';
import _ from 'lodash';

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
      console.log("Cannot process the request at this time");
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
 * This is a protected route. Will add fridge items in the fridge for User only if valid jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */


function addItemToFridge(req, res){
  //Using $push is most suitable in this scenario
  user.findOneAndUpdate({email: "syedadilimam93@gmail.com"}, {$push: { "fridgeItems": {name:"Potatoes", quantityleft: 6, thresholdqty:3 }}}, {new:true}, function(err, doc){

    if(err){
      console.log("wrong!");
    }

    return res.json({
      msg: doc.toString(),
    });

  });
}


function removeItemFromFridge(req, res){
  //Using $push is most suitable in this scenario
  user.findOneAndUpdate({email: "syedadilimam93@gmail.com"}, {$pull: { "fridgeItems": {name:"Tomatoes"}}}, {new:true}, function(err, doc){
    if(err){
      console.log("Error!");
    }
    return res.json({
      msg: doc.toString(),
    });

  });
}



function searchItemInFridge(req, res){

  user.find({"fridgeItems.name":"carrots"}, {"fridgeItems": 1}, function(err, doc){

    if(err){
      console.log("Error");
    }
    else
    {
     return res.json(doc);
    }
  }).filter(doc, {name:"carrots"});

}


export default { login, addItemToFridge, removeItemFromFridge, searchItemInFridge};
