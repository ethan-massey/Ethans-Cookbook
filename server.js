const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/recipes"));
// token functions and auth routes
const auth = require('./routes/auth')
app.use(auth.authRoutes);
// get driver connection
const dbo = require("./db/conn");

// Clean old sessions from db
const dbSessionClean = require('./db-session-clean');
dbSessionClean.initCleanSessions();

// ---------------- Added for production ---------------------------------//
// Accessing the path module
const path = require("path");

// Step 1:
app.use(express.static(path.resolve(__dirname, "./client/build")));
// Step 2:
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});
// ---------------- Added for production ---------------------------------//
 
app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
 
  });
  console.log(`Server is running on port: ${port}`);
});