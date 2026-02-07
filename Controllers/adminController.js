const BookingSchema = require('../Models/BookingSchema');
const Booking = require('../Models/BookingSchema');
const ContactSchema = require('../Models/ContactSchema');
const Contact = require('../Models/ContactSchema');
const RoomsSch = require('../Models/hotelSchema');
const User = require('../Models/UserSchema');
const cloudinary = require('../utils/cloudinary');
const bcrypt = require('bcrypt');

// --- BOOKINGS ---
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('room', 'name')
            .sort({ created_at: -1 })
            .lean();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error: error.message });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting booking", error: error.message });
    }
};

// --- CONTACTS ---
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find()
            .populate('user', 'name email')
            .sort({ created_at: -1 })
            .lean();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching contacts", error: error.message });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: "Contact deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting contact", error: error.message });
    }
};

exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id).populate('user', 'name email');
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: "Error fetching contact", error: error.message });
    }
};

// --- ROOMS (MANAGEMENT) ---
exports.createRoom = async (req, res) => {
    try {
        const { name, type, description, capacity, prix } = req.body;
        if (!name || !type || !description || !capacity || !prix) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let imageUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        const newRoom = new RoomsSch({
            name,
            type,
            description,
            capacity,
            prix,
            imageUrl
        });

        const savedRoom = await newRoom.save();
        res.status(201).json(savedRoom);
    } catch (error) {
        res.status(500).json({ message: "Error creating room", error: error.message });
    }
};

exports.updateRoom = async (req, res) => {
    try {
        const { name, type, description, capacity, prix } = req.body;

        let updatedRoomData = {
            name,
            type,
            description,
            capacity,
            prix
        };

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            updatedRoomData.imageUrl = result.secure_url;
        }

        const updatedRoom = await RoomsSch.findByIdAndUpdate(
            req.params.id,
            updatedRoomData,
            { new: true }
        );

        if (!updatedRoom) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.json(updatedRoom);
    } catch (error) {
        res.status(500).json({ message: "Error updating room", error: error.message });
    }
};

exports.deleteRoom = async (req, res) => {
    try {
        const room = await RoomsSch.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Delete image from Cloudinary if exists
        if (room.imageUrl) {
            try {
                // Extract public_id from URL
                // Check if it's a cloudinary URL just in case
                if (room.imageUrl.includes('cloudinary')) {
                    const parts = room.imageUrl.split('/');
                    const filename = parts[parts.length - 1];
                    const publicId = filename.split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                }
            } catch (err) {
                console.error("Error deleting image from Cloudinary:", err);
            }
        }

        await RoomsSch.findByIdAndDelete(req.params.id);
        res.json({ message: "Room deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting room", error: error.message });
    }
};

// --- USERS (MANAGEMENT) ---
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { name, email, role, password } = req.body;

        const updateData = { name, email, role };

        // If password is provided, hash it and add to updateData
        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        await BookingSchema.deleteMany({ user: req.params.id });
        await ContactSchema.deleteMany({ user: req.params.id });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};
