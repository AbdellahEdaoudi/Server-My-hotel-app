const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // References the User model
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hotel', // References the Hotel (Room) model
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'cancelled'],
        default: 'pending' // pending = in cart/booking, paid = checkout complete
    },
    prix: {
        type: Number,
        required: true,
    },
    check_in: {
        type: Date,
        required: true,
    },
    check_out: {
        type: Date,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Booking', BookingSchema);
