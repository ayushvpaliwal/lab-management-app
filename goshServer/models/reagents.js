const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reagentSchema = new Schema({
    unit: {
        type: String,
        required: true,
    },
    reagentName: {
        type: String,
        required: true,
    },
    supplier: {
        type: String,
        required: true
    },
    lotNr: {
        type: String,
        required: true,
    },
    catNr: {
        type: String,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    dateReceived: {
        type: Date,
        required: true,
    },
    storageLocation: {
        type: String,
        required: true,
    },
    assayName: {
        type: String,
        default: '',  
    },
    condition: {
        type: String,
        default: '',  
    },
    comment: {
        type: String,
        default: '',  
    },
    action: {
        type: String,
        default: '',  
    },
    dateOfFirstUse: {
        type: Date,
        default: null
    },
    receivedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  
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
    }
}, {
    timestamps: true
});

var Reagents = mongoose.model('Reagent', reagentSchema);

module.exports = Reagents;

