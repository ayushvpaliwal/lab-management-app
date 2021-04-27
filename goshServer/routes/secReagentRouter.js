const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const SecReagents = require('../models/secondaryReagents')

const reagentRouter = express.Router();

reagentRouter.use(bodyParser.json());

reagentRouter.route('/') // mounting
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    SecReagents.find({})
    .populate('createdBy')
    .populate('lastEditedBy')
    .populate('discardedBy')
    .populate('firstUsedBy')
    .then((secReagents) => {
        if ((req.query.deleted == "true")) {
            secReagents = secReagents.filter(entry => entry.status == "DELETED");
        }
        else {
            secReagents = secReagents.filter(entry => entry.status != "DELETED");
        }
        out_secReagents = secReagents.map(entry => {
            let temp = {
                lastEditedBy: entry.lastEditedBy ? (entry.lastEditedBy.lastName + ", " + entry.lastEditedBy.firstName): null,
                createdBy: entry.createdBy ? (entry.createdBy.lastName + ", " + entry.createdBy.firstName): null,
                discardedBy: entry.discardedBy ? (entry.discardedBy.lastName + ", " + entry.discardedBy.firstName): null,
                firstUsedBy: entry.firstUsedBy ? (entry.firstUsedBy.lastName + ", " + entry.firstUsedBy.firstName): null,
            }
            return {...entry._doc, ...temp}
        });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(out_secReagents);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    req.body.createdBy = req.user._id;
    SecReagents.create(req.body)
    .then((secReagent) => {
        console.log('Reagent Created ', secReagent);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(secReagent);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403; //operation not supported
    res.end('PUT operation not supported on /secondary-reagents');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    SecReagents.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

reagentRouter.route('/:secReagentId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
//populate user ids
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    SecReagents.findById(req.params.secReagentId)
    .populate('createdBy')
    .populate('lastEditedBy')
    .populate('discardedBy')
    .populate('firstUsedBy')
    .then((secReagent) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(secReagent);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /secondary-reagents/' 
        + req.params.secReagentId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    if (req.query.action === "editDetails") {
        req.body.lastEditedBy = req.user._id;
        var filter = {_id: req.params.secReagentId};
    }    
    else if (req.query.action === "dispose") {
        req.body.discardedBy = req.user._id;
        //req.body.status = "DISPOSED"; 
        var filter = {_id: req.params.secReagentId};
    }
    else if (req.query.action === "firstTest") {
        req.body.firstUsedBy = req.user._id;
        req.body.assayName = req.query.assayName;
        var filter = {_id: req.params.secReagentId, "firstUsedBy": null};
    }
    else {
        var filter = {_id: req.params.secReagentId};
    }
    SecReagents.findOneAndUpdate(filter, {
        $set: req.body
    }, { new: true })
    .populate('createdBy')
    .populate('lastEditedBy')
    .populate('discardedBy')
    .populate('firstUsedBy')
    .then((secReagent) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        if (secReagent !== null){
            let temp = {
                lastEditedBy: secReagent.lastEditedBy ? (secReagent.lastEditedBy.lastName + ", " + secReagent.lastEditedBy.firstName): null,
                firstUsedBy: secReagent.firstUsedBy ? (secReagent.firstUsedBy.lastName + ", " + secReagent.firstUsedBy.firstName): null,
                createdBy: secReagent.createdBy ? (secReagent.createdBy.lastName + ", " + secReagent.createdBy.firstName): null,
                discardedBy: secReagent.discardedBy ? (secReagent.discardedBy.lastName + ", " + secReagent.discardedBy.firstName): null,
            }
            res.json({...secReagent._doc, ...temp});
        }
        else {
            res.json(secReagent);
        }
    }, (err) => next(err))
    .catch((err) => next(err));  
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    SecReagents.findByIdAndRemove(req.params.secReagentId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = reagentRouter;