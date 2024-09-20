import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  console.log('Signup API route hit');
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Connecting to database');
    console.log('MONGODB_URI:', process.env.MONGODB_URI); // Be careful not to log this in production
    await dbConnect();
    console.log('Database connected');

    const { name, email, password } = req.body;
    console.log('Received signup data:', { name, email, password: '***' });

    // Check if user already exists
    console.log('Checking for existing user');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    console.log('Hashing password');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    console.log('Creating new user');
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log('User created successfully');

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error in signup process:', error);
    res.status(500).json({ 
      error: 'Something went wrong', 
      details: error.message, 
      stack: error.stack,
      name: error.name
    });
  }
}
