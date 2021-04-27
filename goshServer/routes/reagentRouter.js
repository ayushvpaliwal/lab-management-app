const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Reagents = require('../models/reagents')

const reagentRouter = express.Router();

reagentRouter.use(bodyParser.json());

reagentRouter.route('/') // mounting
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Reagents.find({})
    .populate('receivedBy')
    .populate('lastEditedBy')
    .populate('discardedBy')
    .populate('firstUsedBy')
    .then((reagents) => {
        if ((req.query.deleted == "true")) {
            reagents = reagents.filter(entry => entry.status == "DELETED");
        }
        else {
            reagents = reagents.filter(entry => entry.status != "DELETED");
        }
        out_reagents = reagents.map(entry => {
            let temp = {
                lastEditedBy: entry.lastEditedBy ? (entry.lastEditedBy.lastName + ", " + entry.lastEditedBy.firstName): null,
                firstUsedBy: entry.firstUsedBy ? (entry.firstUsedBy.lastName + ", " + entry.firstUsedBy.firstName): null,
                receivedBy: entry.receivedBy ? (entry.receivedBy.lastName + ", " + entry.receivedBy.firstName): null,
                discardedBy: entry.discardedBy ? (entry.discardedBy.lastName + ", " + entry.discardedBy.firstName): null,
            }
            return {...entry._doc, ...temp}
        });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(out_reagents);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    req.body.receivedBy = req.user._id;
    Reagents.create(req.body)
    .then((reagent) => {
        Reagents.find(reagent._id)
        .populate('receivedBy')
        .populate('lastEditedBy')
        .populate('discardedBy')
        .populate('firstUsedBy')
        .then((reagent) => {                                 
            reagent = reagent[Object.keys(reagent)[0]];
            console.log(reagent);
            let temp = {
                lastEditedBy: reagent.lastEditedBy ? (reagent.lastEditedBy.lastName + ", " + reagent.lastEditedBy.firstName): null,
                firstUsedBy: reagent.firstUsedBy ? (reagent.firstUsedBy.lastName + ", " + reagent.firstUsedBy.firstName): null,
                receivedBy: reagent.receivedBy ? (reagent.receivedBy.lastName + ", " + reagent.receivedBy.firstName): null,
                discardedBy: reagent.discardedBy ? (reagent.discardedBy.lastName + ", " + reagent.discardedBy.firstName): null,
            }
            console.log(temp);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({...reagent._doc, ...temp});
        })        
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403; //operation not supported
    res.end('PUT operation not supported on /reagents');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Reagents.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

reagentRouter.route('/:reagentId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Reagents.findById(req.params.reagentId)
    .populate('receivedBy')
    .populate('lastEditedBy')
    .populate('discardedBy')
    .populate('firstUsedBy')
    .then((reagent) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(reagent);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /reagents/' 
        + req.params.reagentId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    if (req.query.action === "editDetails") {
        req.body.lastEditedBy = req.user._id; 
        var filter = {_id: req.params.reagentId};
    }    
    else if (req.query.action === "dispose") {
        req.body.discardedBy = req.user._id;
        //req.body.status = "DISCARDED";
        var filter = {_id: req.params.reagentId};
    }
    else if (req.query.action === "firstTest") {
        req.body.firstUsedBy = req.user._id;
        req.body.assayName = req.query.assayName;
        req.body.dateOfFirstUse = new Date().toISOString();
        var filter = {_id: req.params.reagentId, "firstUsedBy": null};
    }
    else {
        var filter = {_id: req.params.reagentId};
    }
    Reagents.findOneAndUpdate(filter, {
        $set: req.body
    }, { new: true })
    .populate('receivedBy')
    .populate('lastEditedBy')
    .populate('discardedBy')
    .populate('firstUsedBy')
    .then((reagent) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        if (reagent !== null){
            let temp = {
                lastEditedBy: reagent.lastEditedBy ? (reagent.lastEditedBy.lastName + ", " + reagent.lastEditedBy.firstName): null,
                firstUsedBy: reagent.firstUsedBy ? (reagent.firstUsedBy.lastName + ", " + reagent.firstUsedBy.firstName): null,
                receivedBy: reagent.receivedBy ? (reagent.receivedBy.lastName + ", " + reagent.receivedBy.firstName): null,
                discardedBy: reagent.discardedBy ? (reagent.discardedBy.lastName + ", " + reagent.discardedBy.firstName): null,
            }
            res.json({...reagent._doc, ...temp});
        }
        else {
            res.json(reagent);
        }
    }, (err) => next(err))
    .catch((err) => next(err));  
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Reagents.findByIdAndRemove(req.params.reagentId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = reagentRouter;