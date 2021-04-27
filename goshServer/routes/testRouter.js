const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Tests = require('../models/tests')

const testRouter = express.Router();

testRouter.use(bodyParser.json());

testRouter.route('/') // mounting
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { res.sendStatus(200);})
.get(cors.corsWithOptions, (req,res,next) => {
    Tests.find({})
    .populate('conductedBy')
    .then((tests) => {
        out_tests = tests.map(entry => {
            let temp = {
                conductedBy: entry.conductedBy ? (entry.conductedBy.lastName + ", " + entry.conductedBy.firstName): null,
                conductedByUsername: entry.conductedBy ? (entry.conductedBy.username): null,
            }
            return {...entry._doc, ...temp}
        });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(out_tests);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    req.body.conductedBy = req.user._id;
    Tests.create(req.body)
    .then((test) => {
        console.log('Test Created ', test);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(test);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403; //operation not supported
    res.end('PUT operation not supported on /tests');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Tests.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

testRouter.route('/:testId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
//populate user ids
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Tests.findById(req.params.testId)
    .populate('conductedBy')
    .then((test) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(test);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /tests/' 
        + req.params.testId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    var filter = {_id: req.params.testId};
    Tests.findOneAndUpdate(filter, {
        $set: req.body
    }, { new: true })
    .populate('conductedBy')
    .then((test) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        if (test !== null){
            let temp = {
                conductedBy: test.conductedBy ? (test.conductedBy.lastName + ", " + test.conductedBy.firstName): null,
                conductedByUsername: test.conductedBy ? (test.conductedBy.username): null,
            }
            res.json({...test._doc, ...temp});
        }
        else {
            res.json(test);
        }
    }, (err) => next(err))
    .catch((err) => next(err));  
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Tests.findByIdAndRemove(req.params.testId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = testRouter;