import ActivityLog from '../models/ActivityLog.js';
import Users from '../models/users.js';

/**
 * Helper — call this from other controllers to record an action.
 * Does NOT throw on failure so it never breaks the parent request.
 */
export const logActivity = async (userId, action, details = '') => {
    try {
        const user = await Users.findById(userId).select('school');
        if (!user) return;
        await ActivityLog.create({
            user: userId,
            action,
            details,
            school: user.school,
        });
    } catch (err) {
        console.error('Failed to log activity:', err.message);
    }
};

/**
 * @desc    Get activity logs for the admin's school
 * @route   GET /api/activity-logs
 * @access  Private/Admin
 */
export const getSchoolLogs = async (req, res) => {
    try {
        const admin = await Users.findById(req.user.id);
        const logs = await ActivityLog.find({ school: admin.school })
            .populate('user', 'name role')
            .sort({ createdAt: -1 })
            .limit(200);
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};
