const BookingSchema = require('../Models/BookingSchema');

// GET /Booking
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingSchema.find();
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

// GET /Booking/:id
exports.getBookingById = async (req, res) => {
  try {
    const booking = await BookingSchema.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching booking", error: error.message });
  }
};

// POST /Booking
exports.createBooking = async (req, res) => {
  try {
    const { nameC, email, nameR, prix, check_in, check_out } = req.body;
    const datenew = new Date();
    if (new Date(check_in) < datenew || new Date(check_out) < datenew) {
      return res.status(400).json({ message: "Date is invalid" });
    }
    const newBooking = new BookingSchema({ nameC, email, nameR, prix, check_in, check_out });
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
};

// PUT /Booking/:id
exports.updateBookingById = async (req, res) => {
  try {
    const { nameC, email, nameR, prix, check_in, check_out } = req.body;
    const updatedBooking = await BookingSchema.findByIdAndUpdate(
      req.params.id,
      { nameC, email, nameR, prix, check_in, check_out },
      { new: true }
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating booking", error: error.message });
  }
};

// DELETE /Booking/:id
exports.deleteBookingById = async (req, res) => {
  try {
    const deletedBooking = await BookingSchema.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(deletedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting booking", error: error.message });
  }
};

// DELETE /Bookingd
exports.deleteAllBookings = async (req, res) => {
  try {
    await BookingSchema.deleteMany({});
    res.status(200).json({ message: "All documents deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting documents", error: error.message });
  }
};

// DELETE /BookingdAll
exports.deleteSelectedBookings = async (req, res) => {
  try {
    const { bookings } = req.body;
    await BookingSchema.deleteMany({ _id: { $in: bookings } });
    res.status(200).json({ message: "Selected documents deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting selected documents", error: error.message });
  }
};

// GET /Bookingpay
exports.getBookingsByIds = async (req, res) => {
  try {
    const { bookings } = req.body;
    const result = await BookingSchema.find({ _id: { $in: bookings } });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};
