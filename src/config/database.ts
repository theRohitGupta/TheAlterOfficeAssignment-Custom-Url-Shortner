import mongoose from 'mongoose';
import { MONGO_DB_URI } from '../constants/variables/env-constants';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_DB_URI);

        console.log(`MongoDB Connected Sucessfully`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;