import File from '../models/file.js';
import Users from '../models/users.js';
import Student from '../models/Student.js';
import { logActivity } from './activityLogController.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Upload a file
 * @route   POST /api/files/upload
 * @access  Private/Teacher or Admin
 */
export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const user = await Users.findById(req.user.id);

        const newFile = new File({
            fileName: req.file.originalname,
            filePath: req.file.filename, // Store only the filename
            fileType: req.file.mimetype,
            uploadedBy: req.user.id,
            school: user.school,
            class: req.body.classId || undefined,
        });

        if (user.role === 'admin') {
            newFile.approved = true;
            newFile.approvedBy = req.user.id;
        }

        await newFile.save();
        logActivity(req.user.id, 'Uploaded file', `"${req.file.originalname}"`);

        res.status(201).json({ message: 'File uploaded successfully.', file: newFile });
    } catch (error) {
        console.error('Error uploading file:', error.stack);
        res.status(500).json({ message: 'Server error.', error: error.message, stack: error.stack });
    }
};

/**
 * @desc    Get all files for the user's school
 * @route   GET /api/files
 * @access  Private/Teacher or Admin
 */
export const getSchoolFiles = async (req, res) => {
    try {
        const user = await Users.findById(req.user.id);
        let files;

        if (user.role === 'admin') {
            files = await File.find({ school: user.school })
                .populate('uploadedBy', 'name email')
                .populate('class', 'name');
        } else {
            files = await File.find({
                school: user.school,
                $or: [
                    { approved: true },
                    { uploadedBy: req.user.id }
                ]
            })
                .populate('uploadedBy', 'name email')
                .populate('class', 'name');
        }

        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * @desc    Create an internal file (e.g., marks sheet)
 * @route   POST /api/files/internal
 * @access  Private/Teacher or Admin
 */
export const createInternalFile = async (req, res) => {
    const { fileName, fileType, classId, content: providedContent } = req.body;
    const user = await Users.findById(req.user.id);

    try {
        let content = providedContent || {};

        // If content wasn't provided (legacy/single-step), build it
        if (!providedContent) {
            if (fileType === 'marks') {
                if (!classId) {
                    return res.status(400).json({ message: 'Class ID is required for marks sheets.' });
                }
                const students = await Student.find({ class: classId }).select('name studentId');
                content = {
                    class: classId,
                    targetMarks: 100, // Default
                    students: students.map(s => ({ studentId: s.studentId, name: s.name, marks: '' })),
                };
            } else {
                content = { text: '' };
            }
        }

        const newFile = new File({
            fileName,
            source: 'internal',
            fileType,
            content,
            uploadedBy: user._id,
            school: user.school,
            class: classId || undefined,
            approved: user.role === 'admin',
            approvedBy: user.role === 'admin' ? user._id : undefined,
        });

        await newFile.save();
        logActivity(req.user.id, 'Created internal file', `"${fileName}" (${fileType})`);
        res.status(201).json(newFile);

    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * @desc    View a file in browser (especially for PDFs)
 * @route   GET /api/files/view/:fileId
 * @access  Private/Teacher or Admin
 */
export const viewFile = async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({ message: 'File not found.' });
        }

        const user = await Users.findById(req.user.id);
        if (file.school.toString() !== user.school.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this file.' });
        }

        if (file.source === 'internal') {
            return res.status(200).json(file.content);
        }

        const filePath = path.join(__dirname, '../../uploads', file.filePath);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Physical file not found on server.' });
        }

        // Set headers for viewing
        res.setHeader('Content-Type', file.fileType || 'application/octet-stream');
        res.setHeader('Content-Disposition', 'inline');

        res.sendFile(filePath);
        logActivity(req.user.id, 'Viewed file', `"${file.fileName}"`);

    } catch (error) {
        console.error('Error viewing file:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * @desc    Get a single file by ID
 * @route   GET /api/files/:fileId
 * @access  Private/Teacher or Admin
 */
export const getFileById = async (req, res) => {
    try {
        const file = await File.findById(req.params.fileId).populate('uploadedBy', 'name');
        if (!file) {
            return res.status(404).json({ message: 'File not found.' });
        }
        // Basic access control: ensure user is from the same school
        const user = await Users.findById(req.user.id);
        if (file.school.toString() !== user.school.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this file.' });
        }
        res.status(200).json(file);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};


/**
 * @desc    Allow a teacher to edit a file they uploaded (resubmit for approval)
 * @route   PATCH /api/files/:fileId
 * @access  Private/Teacher
 */
export const editFile = async (req, res) => {
    const { fileId } = req.params;
    const user = await Users.findById(req.user.id);
    const file = await File.findById(fileId);

    if (!file) {
        return res.status(404).json({ message: 'File not found.' });
    }

    if (file.uploadedBy.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'You can only edit your own files.' });
    }

    // When a teacher "edits" a file, it is reset to unapproved and must be re-approved by an admin.
    // For internal files, this is where you'd update the 'content' field.
    if (file.source === 'internal' && req.body?.content) {
        file.content = req.body.content;
    }

    file.approved = false;
    file.approvedBy = undefined;
    await file.save();
    logActivity(req.user.id, 'Resubmitted file', `"${file.fileName}"`);

    res.status(200).json({ message: 'File has been submitted for re-approval.', file });
};

/**
 * @desc    Delete a file
 * @route   DELETE /api/files/:fileId
 * @access  Private/Admin
 */
export const deleteFile = async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({ message: 'File not found.' });
        }

        // Only admins can delete files (as per requirement)
        const user = await Users.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can delete files.' });
        }

        // If it's a physical file (not internal), delete it from storage
        if (file.source !== 'internal' && file.filePath) {
            const filePath = path.join(__dirname, '../../uploads', file.filePath);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await File.findByIdAndDelete(fileId);
        logActivity(req.user.id, 'Deleted file', `"${file.fileName}"`);

        res.status(200).json({ message: 'File deleted successfully.' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * @desc    Download a file
 * @route   GET /api/files/download/:fileId
 * @access  Private/Teacher or Admin
 */
export const downloadFile = async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({ message: 'File not found.' });
        }

        // For internal files (marks, etc.), we might need to generate a text/csv file on the fly
        // but for now, let's focus on uploaded files as requested for "downloading those uploaded files"
        if (file.source === 'internal') {
            // For now, simple JSON download for internal files
            res.setHeader('Content-disposition', `attachment; filename=${file.fileName}.json`);
            res.setHeader('Content-type', 'application/json');
            return res.send(JSON.stringify(file.content, null, 2));
        }

        const filePath = path.join(__dirname, '../../uploads', file.filePath);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Physical file not found on server.' });
        }

        res.download(filePath, file.fileName);
        logActivity(req.user.id, 'Downloaded file', `"${file.fileName}"`);

    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};