import School from '../models/school.js';
import Users from '../models/users.js';
import bcrypt from 'bcryptjs';

/**
 * @desc    Register a new school and its first admin (headmaster)
 * @route   POST /api/schools/register
 * @access  Public
 */
export const registerSchool = async (req, res) => {
    const { schoolName, schoolAddress, adminName, adminEmail, adminPassword } = req.body;

    if (!schoolName || !schoolAddress || !adminName || !adminEmail || !adminPassword) {
        return res.status(400).json({ message: 'Please provide all required fields for school and admin registration.' });
    }

    try {
        const schoolExists = await School.findOne({ name: schoolName });
        if (schoolExists) {
            return res.status(400).json({ message: 'A school with this name already exists.' });
        }

        const userExists = await Users.findOne({ email: adminEmail });
        if (userExists) {
            return res.status(400).json({ message: 'This email is already registered.' });
        }

        const newSchool = new School({
            name: schoolName,
            address: schoolAddress,
        });

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const adminUser = new Users({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            school: newSchool._id,
        });

        newSchool.admin = adminUser._id;

        await newSchool.save();
        await adminUser.save();

        res.status(201).json({
            message: 'School and admin registered successfully.',
            school: {
                id: newSchool._id,
                name: newSchool.name,
            },
            admin: {
                id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
};
