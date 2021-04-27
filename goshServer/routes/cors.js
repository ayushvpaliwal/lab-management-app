const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8100', 'capacitor://localhost', 
                    'http://localhost', 'https://gentle-moss-001c37603.azurestaticapps.net/',
                    'https://kind-water-02d950403.azurestaticapps.net/',
                    'https://white-dune-0a157b403.azurestaticapps.net/'];

var corsOptionsDelegate = (req, callback) => {
    var corsOptions;

    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true }
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions)
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);