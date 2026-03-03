const Showtime = require('../models/Showtime');

// @desc    Get all showtimes for a specific movie
// @route   GET /api/showtimes/movie/:movieId
// @access  Public
exports.getShowtimesByMovie = async (req, res) => {
    try {
        // Showtimes are populated with basic movie info
        const showtimes = await Showtime.find({ movie: req.params.movieId }).populate('movie', 'title posterUrl duration');
        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get specific showtime details (returns booked seat positions)
// @route   GET /api/showtimes/:id
// @access  Public
exports.getShowtimeById = async (req, res) => {
    try {
        const showtime = await Showtime.findById(req.params.id).populate('movie', 'title posterUrl');
        if (!showtime) {
            return res.status(404).json({ message: 'Showtime not found' });
        }
        res.json(showtime);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new showtime (Admin)
// @route   POST /api/showtimes
// @access  Private/Admin
exports.createShowtime = async (req, res) => {
    try {
        const { movie, date, time, venue, price, totalSeats } = req.body;
        const showtime = await Showtime.create({
            movie, date, time, venue, price, totalSeats
        });
        res.status(201).json(showtime);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a showtime (Admin)
// @route   DELETE /api/showtimes/:id
// @access  Private/Admin
exports.deleteShowtime = async (req, res) => {
    try {
        const showtime = await Showtime.findByIdAndDelete(req.params.id);
        if (!showtime) {
            return res.status(404).json({ message: 'Showtime not found' });
        }
        res.json({ message: 'Showtime removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
