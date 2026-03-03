const mongoose = require('mongoose');

// Booking schema to store ticket info for user
const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User making the booking
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true }, // Selected showtime
    seatsBooked: [{ type: Number, required: true }], // Seat numbers booked
    totalAmount: { type: Number, required: true }, // Total cost of booking
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
