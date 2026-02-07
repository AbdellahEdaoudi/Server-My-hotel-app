const BookingSchema = require('../Models/BookingSchema');

// GET /Booking
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingSchema.find({ user: req.user })
      .populate('user', 'name email')
      .populate('room', 'name type prix imageUrl');
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

// GET /Booking/:id
exports.getBookingById = async (req, res) => {
  try {
    const booking = await BookingSchema.findById(req.params.id)
      .populate('user', 'name email')
      .populate('room', 'name type prix');
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
    const { user, room, prix, check_in, check_out } = req.body;

    // Set current date to midnight for fair comparison
    const newdate = new Date();
    newdate.setHours(0, 0, 0, 0);

    // Verify that the user in the request body matches the authenticated user
    if (user !== req.user) {
      return res.status(403).json({ message: "Forbidden - You can only create bookings for yourself" });
    }

    // Create date objects and set to midnight
    const checkInDate = new Date(check_in);
    checkInDate.setHours(0, 0, 0, 0);
    const checkOutDate = new Date(check_out);
    checkOutDate.setHours(0, 0, 0, 0);

    if (checkInDate < newdate || checkOutDate < newdate) {
      return res.status(400).json({ message: "Date is invalid" });
    }

    // Checking booking limit
    const existingBookingsCount = await BookingSchema.countDocuments({ user: req.user, status: 'pending' });
    if (existingBookingsCount >= 5) {
      return res.status(400).json({ message: "You have reached the limit of 5 pending bookings. Please pay for existing bookings or cancel some to make new ones." });
    }

    const newBooking = new BookingSchema({
      user,
      room,
      prix,
      check_in,
      check_out,
      status: 'pending'
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
};

// DELETE /Booking/:id
exports.deleteBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user; // req.user is already the user ID string

    const booking = await BookingSchema.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== user) {
      return res.status(403).json({ message: "Forbidden - You can only delete your own bookings" });
    }

    const deletedBooking = await BookingSchema.findByIdAndDelete(id);
    res.status(200).json(deletedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting booking", error: error.message });
  }
};

// DELETE /Bookingd
exports.deleteAllBookings = async (req, res) => {
  try {
    await BookingSchema.deleteMany({ user: req.user });
    res.status(200).json({ message: "All documents deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting documents", error: error.message });
  }
};
// PUT /Booking/:id
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Update all pending bookings for the user
    if (id === 'all') {
      const result = await BookingSchema.updateMany(
        { user: req.user, status: 'pending' },
        { $set: { status: 'paid' } }
      );
      return res.status(200).json({ message: "All pending bookings marked as paid", result });
    }

    // Update single booking
    const booking = await BookingSchema.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = 'paid';
    const updatedBooking = await booking.save();
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating booking", error: error.message });
  }
};
