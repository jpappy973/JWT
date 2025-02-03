import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  // TODO: If the user exists and the password is correct, return a JWT token
  try {
    const { email, password } = req.body;

    // Step 1: Find user by email (or username, depending on your model)
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Step 2: Compare the password with the stored hash
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    // Step 3: Create the payload for the JWT (usually the user ID or some other identifying data)
    const payload = {
        userId: user._id, // You can add more information like roles or permissions
    };

    // Step 4: Generate the JWT token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

    // Step 5: Send the token back to the client
    res.status(200).json({ token });

} catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
}
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;
