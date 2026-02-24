import Class from '../models/Class.js';
import Student from '../models/Student.js';
import Users from '../models/users.js';
import { logActivity } from './activityLogController.js';

// @desc    Create a new class
// @route   POST /api/classes
// @access  Private/Admin or Teacher
export const createClass = async (req, res) => {
    const { name, teacherId } = req.body;
    const user = await Users.findById(req.user.id);

    try {
        const newClass = new Class({
            name,
            school: user.school,
            teacher: teacherId,
        });
        await newClass.save();
        logActivity(req.user.id, 'Created class', `Class "${name}"`);
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all classes for a school
// @route   GET /api/classes
// @access  Private/Admin or Teacher
export const getClasses = async (req, res) => {
    const user = await Users.findById(req.user.id);
    try {
        const classes = await Class.find({ school: user.school }).populate('teacher', 'name');
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get a single class by ID with students
// @route   GET /api/classes/:classId
// @access  Private/Admin or Teacher
export const getClassById = async (req, res) => {
    const { classId } = req.params;
    try {
        const classData = await Class.findById(classId).populate('teacher', 'name');
        if (!classData) {
            return res.status(404).json({ message: 'Class not found.' });
        }
        const students = await Student.find({ class: classId });
        res.status(200).json({ ...classData.toObject(), students });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Add a student to a class
// @route   POST /api/classes/:classId/students
// @access  Private/Admin or Teacher
export const addStudent = async (req, res) => {
    const { name, studentId } = req.body;
    const { classId } = req.params;
    const user = await Users.findById(req.user.id);

    try {
        const studentExists = await Student.findOne({ studentId, school: user.school });
        if (studentExists) {
            return res.status(400).json({ message: 'A student with this ID already exists in this school.' });
        }

        const newStudent = new Student({
            name,
            studentId,
            school: user.school,
            class: classId,
        });
        await newStudent.save();
        logActivity(req.user.id, 'Added student', `Student "${name}" (${studentId})`);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all students in a class
// @route   GET /api/classes/:classId/students
// @access  Private/Admin or Teacher
export const getStudentsInClass = async (req, res) => {
    const { classId } = req.params;
    try {
        const students = await Student.find({ class: classId });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Update a student's information
 * @route   PATCH /api/classes/:classId/students/:studentId
 * @access  Private/Admin or Teacher
 */
export const updateStudent = async (req, res) => {
    const { classId, studentId: sId } = req.params;
    const { name, studentId } = req.body;
    const user = await Users.findById(req.user.id);

    try {
        const student = await Student.findOne({ _id: sId, school: user.school, class: classId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found in this class.' });
        }

        // If changing studentId, check for uniqueness
        if (studentId && studentId !== student.studentId) {
            const exists = await Student.findOne({ studentId, school: user.school });
            if (exists) {
                return res.status(400).json({ message: 'A student with this ID already exists in this school.' });
            }
            student.studentId = studentId;
        }

        if (name) student.name = name;

        await student.save();
        logActivity(req.user.id, 'Updated student', `Student "${student.name}" (${student.studentId})`);

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
