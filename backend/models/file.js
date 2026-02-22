import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    
    filePath: {
        type: String,
        required: function() { return this.source === 'upload'; } // Required only for uploads
    },

    fileType: {
        type: String,
        required: function() { return this.source === 'upload'; }
    },

    source: {
        type: String,
        enum: ['upload', 'internal'],
        required: true,
        default: 'upload',
    },

    // For internally generated files, like marks sheets
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: function() { return this.source === 'internal'; }
    },

    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },

    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },

    approved: {
        type: Boolean,
        default: false
    },

    // This will be set by an admin
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
}, { timestamps: true });

const File = mongoose.models.File || mongoose.model('File', fileSchema);

export default File;