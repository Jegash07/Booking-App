const mongoose = require('mongoose');

// Showtime schema representing a specific screening of a movie
const showtimeSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true }, // Reference to Movie model
    date: { type: Date, required: true, index: true }, // Date of show
    time: { type: String, required: true }, // e.g., '14:30'
    venue: { type: String, required: true }, // Cinema Hall or Screen Name
    price: { type: Number, required: true }, // Base ticket price
    totalSeats: { type: Number, default: 100 }, // Total capacity
    bookedSeats: [{ type: Number }] // Array of booked seat numbers (1 to totalSeats)
}, { timestamps: true });

module.exports = mongoose.model('Showtime', showtimeSchema);
