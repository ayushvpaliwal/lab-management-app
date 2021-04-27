const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reagentTestSchema = new Schema({
    key: {
        type: String,
    },
    label: {
        type: String,
        required: true
    },
    reagent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reagent'
    },
    lotNr: {
        type: String
    }
});

const reagentDataSchema = new Schema({
    key: {
        type: String,
    },
    label: {
        type: String,
        required: true
    },
    value: {
        type: String,
    },
    type: {
        type: String,
        required: true
    }
});

const otherDataSchema = new Schema({
    key: {
        type: String,
    },
    label: {
        type: String,
        required: true
    },
    value: {
        type: String,
    },
    type: {
        type: String,
        requred: true
    }
});

const equipmentSchema = new Schema({
    eqptNr: {
        type: String,
        required: true
    } 
});

const testSchema = new Schema({
    batchNr: {
        type: String,
        required: true
    },
    conductedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    equipment: [equipmentSchema],    
    assayName: {
        type: String,
        required: true,
    },
    reagents: [reagentTestSchema],
    reagentData: [reagentDataSchema],
    other: [otherDataSchema],
    status: {
        type: String,
        default: "OK"
    }
}, {
    timestamps: true
});

var Tests = mongoose.model('Test', testSchema);

module.exports = Tests;

