import { getSession } from 'next-auth/react';
import dbConnect from '../../../lib/mongodb';
import Note from '../../../models/Note';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const notes = await Note.find({ userId: session.user.id });
        res.status(200).json(notes);
      } catch (error) {
        res.status(400).json({ error: 'Error fetching notes' });
      }
      break;
    case 'POST':
      try {
        const note = new Note({
          content: req.body.content,
          userId: session.user.id,
        });
        await note.save();
        res.status(201).json(note);
      } catch (error) {
        res.status(400).json({ error: 'Error creating note' });
      }
      break;
    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
