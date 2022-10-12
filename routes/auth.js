const express = require("express");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
 
// recipeRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /recipe.
const authRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");

// Login and issue new session if successful
authRoutes.route('/api/login').post(function (req, res) {
    let db_connect = dbo.getDb(); 
    let myquery = { user: 'admin' };
    // check to see if request contains proper body fields
    if (! req.body.hasOwnProperty('password')){
        return res.status(400)
            .send({
                message: "Malformed request body from client. Body must include 'password' field."
            });
    }
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
                        message: "Invalid Password!"
                    });
            }else{
                // create session
                let session = {
                    sessionID: uuidv4(),
                    // expDate = now + 24 hours
                    expDate: new Date(new Date().getTime() + 60 * 60 * 24 * 1000)
                };
                // put in db
                db_connect.collection("sessions").insertOne(session, function (err, res) {
                    if (err) throw err;
                });

                // send success and sessionID to client
                res.status(200)
                    .send({
                        status: 'success',
                        message: "Login successful",
                        session: session
                    });
            }
        });
});

// check a sessionID to see if still valid
authRoutes.route('/api/checkSession').post(function (req, res) {
    let sessionID = req.body.sessionID;
    verifySession(sessionID, function(result){
        res.status(result.statusCode).send(result);
    });
});

// given a sessionID, checks in db for that session
// hands result to callback to be used by caller of this function
const verifySession = (sessionID, fn) => {
    let db_connect = dbo.getDb();
    let myquery = { 'sessionID': sessionID };
    db_connect.collection('sessions').findOne(myquery)
    .then(function(doc) {
        var result = {
            status: '',
            message: ''
        };
        // no session found in db
        if (!doc) {
            result.status = 'not-found';
            result.statusCode = 404;
            result.message = `No session found with ID ${sessionID}`;
        } else {
            let expDate = new Date(doc.expDate);
            let now = new Date();
            // if session expired
            if (expDate < now){
                result.status = 'session-expired';
                result.statusCode = 401;
                result.message = 'Session expired.';
                result.session = doc;
            // otherwise, successful
            } else {
                result.status = 'success';
                result.statusCode = 200;
                result.message = 'Session found.';
                result.session = doc;
            }
        }
        fn(result);
    });
}


module.exports = {authRoutes, verifySession};