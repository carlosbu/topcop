

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var path = require('path');
var fs = require('fs');

var bodyParser = require('body-parser');
// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/stylesheets',express.static(path.join(__dirname,'views/stylesheets')))
app.engine('html', require('ejs').renderFile);
// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('/selfenablement', function (req, res) {
    res.render('enablement.html');
});
app.get('/selfenablement/*', function (req, res) {
    res.render('dinamicEnablement.html');
});


fs.stat('./vcap-local.json', function (err, stat) {
    if (err && err.code === 'ENOENT') {
        // file does not exist
        console.log('No vcap-local.json');
        initializeAppEnv();
    } else if (err) {
        console.log('Error retrieving local vcap: ', err.code);
    } else {
        vcapLocal = require("./vcap-local.json");
        console.log("Loaded local VCAP", vcapLocal);
        appEnvOpts = {
            vcap: vcapLocal
        };
        initializeAppEnv();
    }
});

function initializeAppEnv() {
    appEnv = cfenv.getAppEnv(appEnvOpts);
    if (appEnv.isLocal) {
        require('dotenv').load();
    }
    if (appEnv.services.cloudantNoSQLDB) {
        initCloudant();
    } else {
        console.error("No Cloudant service exists.");
    }
}

// =====================================
// CLOUDANT SETUP ======================
// =====================================
var dbname = "views";
var db;

function initCloudant() {
    var cloudantURL = appEnv.services.cloudantNoSQLDB[0].credentials.url || appEnv.getServiceCreds("topcopDB").url;
    var Cloudant = require('cloudant')({
        url: cloudantURL,
        plugin: 'retry',
        retryAttempts: 10,
        retryTimeout: 500
    });
    // Create the accounts Logs if it doesn't exist
    Cloudant.db.create(dbname, function (err, body) {
        if (err && err.statusCode == 412) {
            console.log("Database already exists: ", dbname);
        } else if (!err) {
            console.log("New database created: ", dbname);
        } else {
            console.log('Cannot create database!');
        }
    });
    db = Cloudant.db.use(dbname);

}

app.get('/getInfo', function (req, res) {
    var id = req.query.id;
    res.setHeader('Content-Type','application/json');
    db.get(id, {
        revs_info: true
    }, function (err, doc) {
        if (err) {
            res.status(500).json({error:true,description: "Internal server error"})
        } else {
            var data = {
                header: doc.header,
                body: doc.body
            }
            res.status(200).json({error: false, data: data})
        }
    })
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function () {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});
