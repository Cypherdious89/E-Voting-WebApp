const mongoose = require('mongoose');

const Image = new mongoose.Schema(
    {
        name: {type: String, required: true},
        file: {type: String, required: true},
        uploadTime: {type: String, required: true},
    },
    {collection: 'candidate-image-data'}
);

const Candidate = new mongoose.Schema(
    {
        Name: {type: String, required: true, maxlength: 40},
        Age: {type: Number, required: true},
        Photo: {type: Image, required: true},
        UID: {type: String, required: true},
        DOB: {type: String, required: true},
        votes: {type: Array}
    },
    {collection: 'candidate-data'}
)

const Election = new mongoose.Schema(
    {
        open: {type: Boolean, required: true},
        title: {type: String, required: true},
        description: {type: String, required: true},
        area: {type: String},
        department: {type: String},
        constraints: {type: Array, required: true},
        maxCandidates: {type: Number, required: true},
        maxVoter: {type: Number, required: true},
        maxWinners: {type: Number, required: true},
        ageRestriction: {type: Boolean},
        active: {type: Boolean, default: true},
        phase: {type: Number, enum: [0, 1, 2, 3, 4], default: 0},
        voters: {type: Array},
        candidates: {type: [Candidate]}
    }, 
    {collection: 'election-data'}
)

const ElectionSchema = mongoose.model('ElectionData', Election);

module.exports = ElectionSchema;
