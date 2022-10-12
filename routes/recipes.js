const express = require("express");
 
// recipeRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /recipe.
const recipeRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// auth stuff
const auth = require('./auth');
 
// This section will help you get a list of all the recipes.
recipeRoutes.route('/api/recipe').get(function (req, res) {
  let db_connect = dbo.getDb("recipes");
  db_connect
    .collection("recipes")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});
 
// This section will help you get a single recipe by id
recipeRoutes.route('/api/recipe/:id').get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect
      .collection("recipes")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});
 
// This section will help you create a new recipe.
recipeRoutes.route('/api/recipe/add').post(function (req, response) {
  let db_connect = dbo.getDb();
  let sessionID = req.body.sessionID;
  auth.verifySession(sessionID, function(result){
    if (result.statusCode !== 200){
      response.status(result.statusCode).send(result);
    }else {
      // verification success
      let recipe = {
        name: req.body.name,
        ingredients: req.body.ingredients,
        steps: req.body.steps,
      };
      db_connect.collection("recipes").insertOne(recipe, function (err, res) {
        if (err) throw err;
        response.json(res);
      });
    }
  });
});
 
// This section will help you update a recipe by id.
recipeRoutes.route('/api/update/:id').post(function (req, response) {
  let db_connect = dbo.getDb(); 
  let sessionID = req.body.sessionID;

  auth.verifySession(sessionID, function(result){
    if (result.statusCode !== 200){
      response.status(result.statusCode).send(result);

    } else {
      // verification success
      let myquery = { _id: ObjectId(req.params.id) }; 
      let newvalues = {
        $set: {     
          name: req.body.name,    
          ingredients: req.body.ingredients,     
          steps: req.body.steps,   
        }
      };
      db_connect.collection("recipes").updateOne(myquery, newvalues, function(err, res){
        if (err) throw err;
        response.json(res);
      });
    }
  });
});
 
// This section will help you delete a recipe
recipeRoutes.route('/api/:id').delete((req, response) => {
  let db_connect = dbo.getDb();
  let sessionID = req.body.sessionID;

  auth.verifySession(sessionID, function(result){
    if (result.statusCode !== 200) {
      response.status(result.statusCode).send(result);

    } else {
      // verification success
      let myquery = { _id: ObjectId( req.params.id )};
      db_connect.collection("recipes").deleteOne(myquery, function (err, res) {
        if (err) throw err;
        response.json(res);
      });
    }
  });
});

module.exports = recipeRoutes;