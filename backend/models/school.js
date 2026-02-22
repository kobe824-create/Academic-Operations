import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    
    address: {
        type: String,
        required: true
    },

    // The headmaster of the school
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
});

const School = mongoose.model('School', schoolSchema);

export default School;
