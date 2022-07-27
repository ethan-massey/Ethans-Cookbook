const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
 
// recipeRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /recipe.
const authRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

const JWT_EXPIRATION_SETTING = "1d";

// Login and issue JWT token if successful
authRoutes.route('/api/login').post(function (req, res) {
    let db_connect = dbo.getDb(); 
    let myquery = { user: 'admin' };
    var submitted_plaintext = req.body.password;
    // get correct hash from database
    db_connect
        .collection("users")
        .findOne(myquery, function (err, result) {
            if (err) throw err;
            // compare client plaintext to hashed password
            var passwordIsValid = bcrypt.compareSync(submitted_plaintext, result.password, function(err, result) {
                if (err) throw err;
            });
            if (!passwordIsValid) {
                return res.status(401)
                    .send({
                    accessToken: null,
                    message: "Invalid Password!"
                    });
            }else{
                //signing token with user id
                var token = jwt.sign({
                    type: 'API token'
                }, process.env.API_SECRET, {
                    expiresIn: JWT_EXPIRATION_SETTING
                });

                //responding to client request with user profile success message and  access token .
                res.status(200)
                    .send({
                        message: "Login successful",
                        accessToken: token,
                    });
            }
        });
});

// check a JWT and send response
authRoutes.route('/api/checkToken').post(function (req, res) {
    let jwtToken = req.body.token;
    let verifyResults = verifyToken(jwtToken);
    if (verifyResults.status === "error"){
        res.status(401)
            .send({
                message: verifyResults.error.message
            });
    }else{
        res.json(verifyResults);
    }
});


const verifyToken = (token) => {
    try {
        var decoded = jwt.verify(token, process.env.API_SECRET);
        return {
            "status": "success",
            "decoded": decoded
        };
    } catch(err) {
        return {
            "status": "error",
            "error": err
        }
    }
}

 
module.exports = {authRoutes, verifyToken};