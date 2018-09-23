/*
    Server-side socket.io main
*/

/** Choose a port */
var port = 42069;
var express = require("express");
var socket = require("socket.io");
var mysql = require("mysql");
var sanitize = require('sqlstring');
var md5 = require('md5');

var app = express();

/** Import file loader. */
var fs = require("fs");
var path = require('path');
var server = app.listen(port, function () {

  log("Art Auction | Listening to requests on port " + port);

  // Static files
  app.use(express.static("public"));

  // Socket setup
  var io = socket(server);

  var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "art-auction"
  });

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to db, art-auction.");
  });


  io.on("connection", (socket) => {

    // Test if account username exist.
    socket.on("test", pack => {
      con.query('SELECT * FROM users WHERE username = ' + sanitize.escape(pack.username), (err, result) => {
        if (err) throw err;
        socket.emit("test", result.length > 0);
      })
    })

    // Sign up
    socket.on("sign_up", pack => {

      var err = "";

      if (pack.password.length < 5) err = "Password must be at least 5 characters long";
      if (pack.password.length > 300) err = "Password is too long";
      // Encrypt password
      pack.password = md5(pack.password);

      if (!pack.username.match('([A-Za-z0-9\-\_]+)')) err = "Username is not allowed.";
      if (pack.username.length > 20) err = "Too long username.";
      if (pack.username.length < 3) err = "Too short username.";

      con.query('SELECT * FROM users WHERE username = ' + sanitize.escape(pack.username), (err, result) => {
        if (err) throw err;
        if (result.length > 0) err = "Username is already taken."
      })

      if (err === "") {
        // Create account
        try {
          con.query("INSERT INTO `users`(`username`, `password`) VALUES (" + sanitize.escape(pack.username) + ", " + sanitize.escape(pack.password) + ")", (error, result) => {
            if (!error) {
              console.log("Created account for: " + pack.username);
              socket.emit("successful_account_creation", true);
            }
          })
        } catch (e) {}
      } else {
        socket.emit("err", err);
      }
    })




















    /* END OF SOCKET */
  });
});


function log(msg) {
  console.log(msg)
}