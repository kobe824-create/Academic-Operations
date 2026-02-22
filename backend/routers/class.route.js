import express from 'express';
import { createClass, getClasses, getClassById, addStudent, getStudentsInClass } from '../controllers/classController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .post(createClass)
    .get(getClasses);

router.route('/:classId')
    .get(getClassById);

router.route('/:classId/students')
    .post(addStudent)
    .get(getStudentsInClass);

export default router;
