import { getToken } from "next-auth/jwt";
import dbConnect from '../../../lib/mongodb';
import Note from '../../../models/Note';
import { analyzeSentiment } from '../../../lib/sentimentAnalysis';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const token = await getToken({ req, secret });
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const notes = await Note.find({ userId: token.sub }).sort({ createdAt: -1 });
        res.status(200).json(notes);
      } catch (error) {
        res.status(400).json({ error: 'Error fetching notes' });
      }
      break;
    case 'POST':
      try {
        const sentiment = analyzeSentiment(req.body.content);
        const note = new Note({
          content: req.body.content,
          sentiment: sentiment,
          userId: token.sub,
        });
        await note.save();
        res.status(201).json(note);
      } catch (error) {
        res.status(400).json({ error: 'Error creating note' });
      }
      break;
    case 'PUT':
      try {
        const { id, isDone } = req.body;
        const updatedNote = await Note.findOneAndUpdate(
          { _id: id, userId: token.sub },
          { isDone },
          { new: true }
        );
        if (!updatedNote) {
          return res.status(404).json({ error: 'Note not found' });
        }
        res.status(200).json(updatedNote);
      } catch (error) {
        res.status(400).json({ error: 'Error updating note' });
      }
      break;
    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
