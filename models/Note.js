import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  content: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
