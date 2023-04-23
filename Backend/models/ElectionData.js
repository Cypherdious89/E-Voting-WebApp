const mongoose = require('mongoose');

const Image = new mongoose.Schema(
    {
        fileName: {type: String, required: true},
        file: {data: Buffer, contentType: String},
        uploadTime: {type: Date, default: Date.now},
    },
    {collection: 'candidate-image-data'}
);

const Candidate = new mongoose.Schema(
    {
        candidateName: {type: String, required: true, maxlength: 40},
        candidateAge: {type: Number, required: true},
        candidatePhoto: {type: [Image], required: true},
        candidateUID: {type: String, required: true}
    },
    {collection: 'candidate-data'}
)

const Election = new mongoose.Schema(
    {
        title: {type: String, required: true},
        area: {type: String, required: true},
        maxCandidate: {type: Number, required: true},
        maxVoter: {type: Number, required: true},
        maxVoteCount: {type: Number, required: true},
        ageRestriction: {type: Boolean, required: true},
        candidates: {type: [Candidate]},
        voters: {type: Array},
        active: {type: Boolean, default: true},
        phase: {type: Number, default: 0}
    }, 
    {collection: 'election-data'}
)

const ElectionSchema = mongoose.model('ElectionData', Election);

module.exports = ElectionSchema;
