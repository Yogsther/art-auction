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

var cash_interval = 4; // Hours
var starting_cash = 10; // €


/** Import file loader. */
var fs = require("fs");
var path = require('path');


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


var server = app.listen(port, function () {

  log("Art Auction | Listening to requests on port " + port);

  // Static files
  app.use(express.static("public"));

  // Socket setup
  var io = socket(server);

  io.on("connection", (socket) => {

    // Test if account username exist.
    socket.on("test", pack => {
      con.query('SELECT * FROM users WHERE username = ' + sanitize.escape(pack.username), (err, result) => {
        if (err) return;
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
      if (pack.username.length > 12) err = "Too long username.";
      if (pack.username.length < 3) err = "Username must be at least 3 characters.";

      con.query('SELECT * FROM users WHERE username = ' + sanitize.escape(pack.username), (err, result) => {
        if (err) reutrn;
        else if (result.length > 0) err = "Username is already taken."
      })

      if (err === "") { // If there are no errors
        // Create account
        try {
          con.query("INSERT INTO `users`(`username`, `password`) VALUES (" + sanitize.escape(pack.username) + ", " + sanitize.escape(pack.password) + ")", (error, result) => {
            if (!error) {
              console.log("Created account for: " + pack.username);
              give_money(pack.username, 10);
              socket.emit("successful_account_creation", true);
              socket.emit("token", get_user_key(pack.username, pack.password));
            }
          })
        } catch (e) {}
      } else {
        socket.emit("err", err);
      }
    })

  


    socket.on("log_in", pack => {
      if(pack.token && pack.token !== undefined){
        // Automatic login, actual login process
        var username = pack.token.substr(0, pack.token.lastIndexOf("_"));
        var password = pack.token.substr(pack.token.lastIndexOf("_")+1, pack.token.length-1);
        con.query('SELECT * FROM users WHERE username = ' + sanitize.escape(username), (err, result) => {
          var account = result[0];
          if(account.password === password){
            socket.emit("credentials", {
              username: account.username,
              wallet: account.wallet
            })
          }
        });
        
      } else if (pack.username && pack.password) {
          
        con.query('SELECT * FROM users WHERE username = ' + sanitize.escape(pack.username), (err, result) => {
          if (err) return;
          else if (result.length > 0) {
            // User exists
            var account = result[0];
            if(account.password == md5(pack.password)){
              // Correct password and username, send user their token and redirect them.
              socket.emit("token", get_user_key(account.username, account.password));
            }
          }
        })
        
      }

    });



    /* END OF SOCKET */
  });
});


function log(msg) {
  console.log(msg)
}

function get_user_key(username, password){
  return username.toLowerCase() + "_" + password;
}

function give_money(username, money){
  con.query("UPDATE `users` SET `wallet` = '" + money + "' WHERE `users`.`username` = " + sanitize.escape(username) + ";", (error, result) => {})
}


/**
 * Explicit words censored for users and warns admins.
 * Some, even more explicit words are not event accepted by the server and is not indexed here.
 */

// "Base List of Bad Words in English" that google uses.
let bad_words = ["asshole", "bastard", "bitch", "boong", "cock", "cocksucker", "cunt", "dick", "fag", "faggot", "fuck", "gook", "motherfucker", "piss", "pussy", "slut", "tits", "nigga"]

function containes_bad_word(comment) {
    for (badWord of bad_words) {
        if(comment.toLowerCase().indexOf(badWord) != -1) return true;
    }
    return false;
}

function censor_comment(comment) {
    for (badWord of bad_words) {
        var breakPoint = 0;
        while (comment.toLowerCase().indexOf(badWord) != -1) {
            breakPoint++;
            if(breakPoint > 50){
                console.warn("There was a problem with the censor filter, please report this bug via 'Contact me', Thanks!");
                break;
            }
            var index = comment.toLowerCase().indexOf(badWord);
            var censorString = new String();
            for (let i = 1; i < badWord.length; i++) censorString += "*";
            comment = comment.substr(0, index+1) + censorString + comment.substr(index+badWord.length, comment.length);
        }
    }
    return comment;
}

// censorComment("John FUcking Whick!!!")