import express from 'express';
import { registerUser, getSchoolUsers, approveFile } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes in this file are protected and require admin privileges
router.use(protect, admin);

// @route   POST /api/admin/register-user
// @desc    Register a new user (teacher or admin)
router.post('/register-user', registerUser);

// @route   GET /api/admin/users
// @desc    Get all users of the admin's school
router.get('/users', getSchoolUsers);

// @route   PATCH /api/admin/files/:fileId/approve
// @desc    Approve or reject a file
router.patch('/files/:fileId/approve', approveFile);

export default router;
