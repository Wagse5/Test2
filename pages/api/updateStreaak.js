import { getToken } from "next-auth/jwt";
import dbConnect from '../../lib/mongodb';
import User from '../../models/User';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const token = await getToken({ req, secret });
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  try {
    const user = await User.findById(token.sub);
    const lastNoteDate = user.lastNoteDate || new Date(0);
    const today = new Date();
    
    if (today.toDateString() !== lastNoteDate.toDateString()) {
      if (today - lastNoteDate <= 86400000) { // 24 hours in milliseconds
        user.streak += 1;
      } else {
        user.streak = 1;
      }
      user.lastNoteDate = today;
      await user.save();
      
      res.status(200).json({ streak: user.streak, streakIncreased: true });
    } else {
      res.status(200).json({ streak: user.streak, streakIncreased: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating streak' });
  }
}
