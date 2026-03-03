const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
    try {
        const { showtimeId, seatsBooked, totalAmount } = req.body;

        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) {
            return res.status(404).json({ message: 'Showtime not found' });
        }

        // Checking if requested seats are already booked
        const alreadyBooked = seatsBooked.some(seat => showtime.bookedSeats.includes(seat));
        if (alreadyBooked) {
            return res.status(400).json({ message: 'One or more seats are already booked' });
        }

        // Creating booking
        const booking = new Booking({
            user: req.user.id,
            showtime: showtimeId,
            seatsBooked,
            totalAmount
        });

        const createdBooking = await booking.save();

        // Adding booked seats to showtime
        showtime.bookedSeats.push(...seatsBooked);
        await showtime.save();

        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user's logged-in bookings
// @route   GET /api/bookings/mybookings
// @access  Private
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate({
                path: 'showtime',
                populate: { path: 'movie' }
            });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get specific booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'name email')
            .populate({
                path: 'showtime',
                populate: { path: 'movie' }
            });

        if (booking) {
            // Ensure only the user who made the booking or an admin can access it
            if (booking.user._id.toString() === req.user.id.toString() || req.user.role === 'admin') {
                res.json(booking);
            } else {
                res.status(403).json({ message: 'Not authorized to view this booking' });
            }
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user', 'id name');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
