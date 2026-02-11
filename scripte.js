require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./Models/UserSchema');
const { connectDB } = require('./config/dbConnect');

const addAdmin = async () => {
    try {
        await connectDB();

        const email = "abdellahedaoudi80@gmail.com";
        const password = "abdellahedaoudi80@gmail.com";
        const name = "Abdellah Edaoudi";
        const role = "admin";
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists');
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        console.log('Admin User added successfully');
        process.exit();
    } catch (error) {
        console.error('Error adding admin user:', error);
        process.exit(1);
    }
};

addAdmin();
