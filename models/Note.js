import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  sentiment: {
    type: String,
    enum: ['Positive', 'Negative', 'Neutral'],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isDone: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
