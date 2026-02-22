import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ['admin', 'teacher'],
        default: 'teacher'
    },

    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    }
    
});

const Users = mongoose.model('Users', usersSchema);

export default Users;