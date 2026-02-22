import express from 'express';
import { registerSchool } from '../controllers/schoolController.js';

const router = express.Router();

// @route   POST /api/schools/register
// @desc    Register a new school and its first admin
// @access  Public
router.post('/register', registerSchool);

export default router;
