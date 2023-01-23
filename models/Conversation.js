import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    contact: { type: String, required: true },
    name: { type: String, required: true },
    messages: [{
        speaker: { type: String, required: true },
        text: { type: String },
        timestamp: { type: Date, required: true }
    }]
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export { Conversation };
