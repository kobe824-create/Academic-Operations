import Users from '../models/users.js';
import File from '../models/file.js';
import bcrypt from 'bcryptjs';
import { logActivity } from './activityLogController.js';

/**
 * @desc    Register a new user (teacher or admin) for the admin's school
 * @route   POST /api/admin/register-user
 * @access  Private/Admin
 */
export const registerUser = async (req, res) => {
    const adminId = req.user.id;

    try {
        const admin = await Users.findById(adminId);

        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Please provide name, email, password, and role.' });
        }

        if (role !== 'admin' && role !== 'teacher') {
            return res.status(400).json({ message: 'Invalid role specified. Must be "admin" or "teacher".' });
        }

        const userExists = await Users.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Users({
            name,
            email,
            password: hashedPassword,
            role,
            school: admin.school, // Associate new user with the admin's school
        });

        await newUser.save();
        logActivity(req.user.id, 'Registered user', `${role} "${name}" (${email})`);

        res.status(201).json({
            message: `New ${role} registered successfully.`,
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * @desc    Get all users for the admin's school
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getSchoolUsers = async (req, res) => {
    try {
        const admin = await Users.findById(req.user.id);
        const users = await Users.find({ school: admin.school }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * @desc    Approve or reject a file
 * @route   PATCH /api/admin/files/:fileId/approve
 * @access  Private/Admin
 */
export const approveFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const { approved } = req.body;

        if (typeof approved !== 'boolean') {
            return res.status(400).json({ message: 'Invalid approval status.' });
        }

        const admin = await Users.findById(req.user.id);
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({ message: 'File not found.' });
        }

        if (file.school.toString() !== admin.school.toString()) {
            return res.status(403).json({ message: 'Forbidden: You can only manage files within your own school.' });
        }

        file.approved = approved;
        file.approvedBy = req.user.id;
        logActivity(req.user.id, approved ? 'Approved file' : 'Rejected file', `"${file.fileName}"`);
        await file.save();

        res.status(200).json({ message: `File has been ${approved ? 'approved' : 'rejected'}.`, file });

    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};
