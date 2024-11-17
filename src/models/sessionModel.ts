import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
    clientId: string;
    sessionData: Record<string, any>;
}

const SessionSchema: Schema = new Schema({
    clientId: { type: String, required: true, unique: true },
    sessionData: { type: Object, required: true },
});

export default mongoose.model<ISession>('Session', SessionSchema);
