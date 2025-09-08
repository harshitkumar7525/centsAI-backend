import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

export const registerUser = expressAsyncHandler(async (req, res) => {
    const {username, email,password}= req.body;

    // checking if user exists
    const userExists = await User.find({email});
    if(userExists.length>0){
        res.status(400).json({message:"User already exists"});
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    if(user){
        res.status(201).json({
            _id: user._id,
            username: user.username,
            token: generateToken(user._id, user.username),
        });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
});

export const loginUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            username: user.username,
            token: generateToken(user._id, user.username),
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
});

export const generateToken = (id, username) => {
    return jwt.sign({ id, username }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};
