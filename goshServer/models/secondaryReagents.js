const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const compositionSchema = new Schema({
    reagent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reagent',
        required: true        
    },
    lotNr: {
        type: String
    },
    reagentName: {
        type: String
    }    
}, {
    timestamps: true
});

const secReagentSchema = new Schema({
    reagentName: {
        type: String,
        required: true,
    },
    lotNr: {
        type: String,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    dateCreated: {
        type: Date,
        required: true,
    },
    assayName: {
        type: String,
        default: '',  
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true   
    },
    firstUsedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null  
    },
    discardedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null    
    },
    lastEditedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null    
    },
    status: {
        type: String,
        default: 'OK',  
    },
    reagents: [compositionSchema]
}, {
    timestamps: true
});

var SecReagents = mongoose.model('SecReagent', secReagentSchema);

module.exports = SecReagents;

