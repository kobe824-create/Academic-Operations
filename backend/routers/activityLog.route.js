import express from 'express';
import { getSchoolLogs } from '../controllers/activityLogController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

// @route   GET /api/activity-logs
// @desc    Get all activity logs for the admin's school
router.get('/', getSchoolLogs);

export default router;
