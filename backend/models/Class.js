import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
    },
    // Optional: Assign a primary teacher to a class
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
});

const Class = mongoose.model('Class', classSchema);

export default Class;
