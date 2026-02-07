const RoomsSch = require('../Models/hotelSchema');
const cloudinary = require('cloudinary').v2;

// GET /Rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await RoomsSch.find();
    res.status(200).json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching rooms", error: error.message });
  }
};

// POST /Rooms
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
      imageUrl,
      name,
      type,
      description,
      capacity,
      prix,
    });

    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving room", error: error.message });
  }
};


// GET /Rooms/:id
exports.getRoomById = async (req, res) => {
  try {
    const room = await RoomsSch.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching room", error: error.message });
  }
};

// PUT /Rooms/:id
exports.updateRoom = async (req, res) => {
  try {
    const { name, type, description, capacity, prix } = req.body;
    if (!name || !type || !description || !capacity || !prix) {
      return res.status(400).json({ message: "All fields are required" });
    }

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

    res.status(200).json({ message: "Room updated successfully", data: updatedRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating room", error: error.message });
  }
};

// DELETE /Rooms/:id
exports.deleteRoom = async (req, res) => {
  try {
    const deletedRoom = await RoomsSch.findByIdAndDelete(req.params.id);
    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(deletedRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting room", error: error.message });
  }
};
