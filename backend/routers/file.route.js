import express from 'express';
import { uploadFile, getSchoolFiles, editFile, createInternalFile, getFileById, deleteFile, downloadFile, viewFile } from '../controllers/fileController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// @route   GET /api/files
// @desc    Get all files for the user's school
router.get('/', protect, getSchoolFiles);

// @route   POST /api/files/upload
// @desc    Upload a file
router.post('/upload', protect, upload.single('file'), uploadFile);

// @route   POST /api/files/internal
// @desc    Create an internal file
router.post('/internal', protect, createInternalFile);

// @route   GET /api/files/download/:fileId
// @desc    Download a file
router.get('/download/:fileId', protect, downloadFile);

// @route   GET /api/files/view/:fileId
// @desc    View a file in browser (especially for PDFs)
router.get('/view/:fileId', protect, viewFile);

// @route   GET /api/files/:fileId
// @desc    Get a single file
router.get('/:fileId', protect, getFileById);

// @route   PATCH /api/files/:fileId
// @desc    Edit a file (for re-approval)
router.patch('/:fileId', protect, editFile);

// @route   DELETE /api/files/:fileId
// @desc    Delete a file
router.delete('/:fileId', protect, deleteFile);

export default router;