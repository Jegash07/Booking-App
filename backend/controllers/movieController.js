const Movie = require('../models/Movie');

// @desc    Get all movies with search, filter, and sorting
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res) => {
    try {
        const { keyword, genre, sortBy } = req.query;

        let query = {};

        // Search functionality based on keyword mapping title dynamically
        if (keyword) {
            query.title = { $regex: keyword, $options: 'i' };
        }

        // Filter functionality based on genre
        if (genre) {
            query.genre = new RegExp(genre, 'i'); // case-insensitive regex
        }

        let sortOption = {};
        if (sortBy === 'newest') sortOption.releaseDate = -1;
        else if (sortBy === 'oldest') sortOption.releaseDate = 1;

        // Apply queries and sorting
        const movies = await Movie.find(query).sort(sortOption);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single movie details
// @route   GET /api/movies/:id
// @access  Public
exports.getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new movie (Admin)
// @route   POST /api/movies
// @access  Private/Admin
exports.createMovie = async (req, res) => {
    try {
        // Admin creates movies using provided data
        const movie = await Movie.create(req.body);
        res.status(201).json(movie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update an existing movie (Admin)
// @route   PUT /api/movies/:id
// @access  Private/Admin
exports.updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(movie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a movie (Admin)
// @route   DELETE /api/movies/:id
// @access  Private/Admin
exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json({ message: 'Movie removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
