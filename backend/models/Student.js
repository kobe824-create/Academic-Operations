import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    // An official ID for the student, unique within the school
    studentId: {
        type: String,
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    }
});

// Ensure studentId is unique per school
studentSchema.index({ studentId: 1, school: 1 }, { unique: true });

const Student = mongoose.model('Student', studentSchema);

export default Student;
