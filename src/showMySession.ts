import mongoose from 'mongoose';
import Session from './models/sessionModel';

const MONGO_URI = 'mongodb://localhost:27017/whatsapp';

const viewSessions = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const sessions = await Session.find();
        console.log('Sessions:', sessions);
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

viewSessions();