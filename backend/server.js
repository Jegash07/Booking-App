const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Route files
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const showtimeRoutes = require('./routes/showtimeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const seedDB = require('./seed');
const Movie = require('./models/Movie');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Body parser

// Connect to MongoDB Database
mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('MongoDB connected successfully');
    try {
        // STEP 1: Check how many movies currently exist in the database
        const count = await Movie.countDocuments();

        // STEP 2: If the count is 0 (database is empty or newly created)
        if (count === 0) {
            console.log('No movies found. Seeding the database...');

            // STEP 3: Auto-run the seedDB function to fill the empty database 
            // with default movies (Leo, Jailer, Vikram, etc.) and their showtimes
            await seedDB();
        }
    } catch (err) {
        console.error('Error checking or seeding database:', err);
    }
}).catch(err => console.error('MongoDB connection error:', err));

// Set up public folder abstraction as Static route to expose local images easily
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Mount Routers
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please close the process using this port or use a different PORT in .env.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
    }
});
