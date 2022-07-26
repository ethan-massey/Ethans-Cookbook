const express = require("express");
 
// recipeRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /recipe.
const recipeRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
const API_KEY = process.env.API_KEY;
const API_KEY_ERROR = {'error': 'API key required.'};
 
 
// This section will help you get a list of all the recipes.
recipeRoutes.route('/api/:api_key/recipe').get(function (req, res) {
  if (req.params.api_key === API_KEY){
    let db_connect = dbo.getDb("recipes");
    db_connect
      .collection("recipes")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  }else{
    res.json(API_KEY_ERROR);
  }
});
 
// This section will help you get a single recipe by id
recipeRoutes.route('/api/:api_key/recipe/:id').get(function (req, res) {
  if (req.params.api_key === API_KEY){
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId( req.params.id )};
    db_connect
        .collection("recipes")
        .findOne(myquery, function (err, result) {
          if (err) throw err;
          res.json(result);
        });
  }else{
    res.json(API_KEY_ERROR);
  }
});
 
// This section will help you create a new recipe.
recipeRoutes.route('/api/:api_key/recipe/add').post(function (req, response) {
  if (req.params.api_key === API_KEY){
    let db_connect = dbo.getDb();
    let myobj = {
      name: req.body.name,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
    };
    db_connect.collection("recipes").insertOne(myobj, function (err, res) {
      if (err) throw err;
      response.json(res);
    });
  }else{
    res.json(API_KEY_ERROR);
  }
});
 
// This section will help you update a recipe by id.
recipeRoutes.route('/api/:api_key/update/:id').post(function (req, response) {
  if (req.params.api_key === API_KEY){
    let db_connect = dbo.getDb(); 
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
  }else{
    res.json(API_KEY_ERROR);
  }
});
 
// This section will help you delete a recipe
recipeRoutes.route('/api/:api_key/:id').delete((req, response) => {
  if (req.params.api_key === API_KEY){
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId( req.params.id )};
    db_connect.collection("recipes").deleteOne(myquery, function (err, res) {
      if (err) throw err;
      response.json(res);
    });
  }else{
    res.json(API_KEY_ERROR);
  }
});
 
module.exports = recipeRoutes;