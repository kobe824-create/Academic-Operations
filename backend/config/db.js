import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB = async () => {
	const uri = process.env.MONGO_URI;

	if (!uri) {
		console.error('MongoDB connection string not found in environment variables. Set MONGO_URI or DATABASE_URL.');
		process.exit(1);
	}

	try {   
		await mongoose.connect(uri);
		console.log('MongoDB connected');
	} catch (err) {
		console.error('MongoDB connection error:', err);
		process.exit(1);
	}
}

export default DB;