# Gathable

A timetable and scheduling web application


# Directory Structure

Gathable/: the project folder  
├── content/: contains static files for different pages  
├── server.js: entry point of the server, contains client <--> server functions  
├── serverUtil.js: server functions  
└── createDb.sql: sql file for initializing the MySQL database  

# Server Configurations
Change current directory to Gathable/ and enter:  
```node server.js```  
To change the server port number, edit line 8 of server.js:  
```javascript
const express = require('express')
const url = require('url')
const cookieParser = require('cookie-parser')       // for reading cookies
const ac = require('./content/function/account.js') // functions for checking format correctness of username and email
const util = require('./serverUtil.js')             // server utility functions for performing hash operations and sending emails
const app = express()

const PORT = 3100  // <------ change server port here

app.use(express.static('content'));
app.use(express.json()); // we are sending json
app.use(cookieParser());
```  
To change the MySQL connection parameters, edit line 20 to line 25 of server.js:  
```javascript
// initialize database
var mysql = require('mysql')
const e = require('express')
const { get } = require('http')
var con = mysql.createConnection({ // database connection
    // create connection to MySQL server
    host: 'localhost',                    // <------ change MySQL settings starting here
    port: '3306',
    user: 'root',
    password: 'csci3100b8',
    database: 'gathable',
    multipleStatements: false // disabled to prevent SQL Injection Attacks
})
```  
To change the server email address, edit serverUtil.js from line 4 to line 7:  
```javascript
const jsSHA = require("jssha"); // package for hash operations
const nodemailer = require('nodemailer'); // package for sending emails
var transporter = nodemailer.createTransport({
    service: 'gmail',                     // <------ change email settings starting here
    auth: {
        user: 'gathable@gmail.com',
        pass: 'asdfg1234qwerty'
    }
});
```  
