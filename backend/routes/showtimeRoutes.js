const express = require('express');
const router = express.Router();
const { getShowtimesByMovie, getShowtimeById, createShowtime, deleteShowtime } = require('../controllers/showtimeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/movie/:movieId', getShowtimesByMovie);

router.route('/')
    .post(protect, admin, createShowtime);

router.route('/:id')
    .get(getShowtimeById)
    .delete(protect, admin, deleteShowtime);

module.exports = router;
