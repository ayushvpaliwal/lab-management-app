const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inputChildSchema = new Schema({
    key: {
        type: String,
    },
    label: {
        type: String,
        required: true
    },
    required: {
        type: Boolean,
        required: true
    },
    type: {
        type: String,
        requred: true
    }
});

const metadataSchema = new Schema({
    key: {
        type: String,
    },
    children: [inputChildSchema]
});

const testTypeSchema = new Schema({   
    assayName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "ACTIVE"
    },
    metadata: [metadataSchema]
}, {
    timestamps: true
});

var TestTypes = mongoose.model('TestType', testTypeSchema);

module.exports = TestTypes;

