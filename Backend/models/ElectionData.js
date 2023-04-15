const mongoose = require('mongoose');

const image = new mongoose.Schema(
    {
        fileName: {type: String, required: true},
        file: {data: Buffer, contentType: String},
        uploadTime: {type: Date, default: Date.now},
    },
    {collection: 'candidate-image-data'}
);

const candidate = new mongoose.Schema(
    {
        candidateName: {type: String, required: true, maxlength: 40},
        candidateAge: {type: Number, required: true},
        candidatePhoto: {type: [Image], required: true},
        candidateUID: {type: String, required: true}
    },
    {collection: 'candidate-data'}
)

const voter = new mongoose.Schema(
    {
        VoterName: {type: String},
        VoterAge: {type: Number},
        VoterHashID: {type: String, required: true}
    },
    {collection: 'voter-data'}
)

const election = new mongoose.Schema(
    {
        title: {type: String, required: true},
        MaxCandidate: {type: Number, required: true},
        MaxVoter: {type: Number, required: true},
        MaxVote: {type: Number, required: true},
        AgeRestriction: {type: Boolean, required: true},
        candidates: {type: [Candidate]},
        voters: {type: [Voter]}
    }, 
    {collection: 'election-data'}
)

const ImageSchema = mongoose.model('CandidteImage', image);
const CandidateSchema = mongoose.model('CandidateData', candidate);
const VoterSchema = mongoose.model('VotersData', voter)
const ElectionSchema = mongoose.model('ElectionData', election);

module.exports = {Image: ImageSchema, Candidate: CandidateSchema, Voter: VoterSchema, Election: ElectionSchema};