import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DB from "./config/db.js";
import userAuthRoutes from "./routers/UsersAuth.route.js";
import schoolRoutes from './routers/school.route.js';
import adminRoutes from './routers/admin.route.js';
import fileRoutes from './routers/file.route.js';
import classRoutes from './routers/class.route.js';
import activityLogRoutes from './routers/activityLog.route.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    exposedHeaders: ['Content-Disposition']
}));
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'backend/uploads')));

//routes
app.use('/api/auth', userAuthRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/activity-logs', activityLogRoutes);

// database connection
DB();

app.get('/', (req, res) => {
    res.send('Hello! This is the academic operations backend server.');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})