const mongoose = require('mongoose');

// Movie schema for managing movies in the system
const movieSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true }, // Indexing title for faster search
    description: { type: String, required: true },
    genre: { type: String, required: true, index: true }, // Indexing genre for filtering
    language: { type: String, required: true },
    duration: { type: Number, required: true }, // duration in minutes
    releaseDate: { type: Date, required: true },
    posterUrl: { type: String, required: true } // URL for movie image
}, { timestamps: true });

// Adding text index for advanced text search
movieSchema.index({ title: 'text', description: 'text', genre: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
