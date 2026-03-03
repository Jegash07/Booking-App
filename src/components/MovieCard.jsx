import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();

    return (
        <div className="movie-card" onClick={() => navigate(`/movie/${movie._id}`)}>
            {/* Dynamic full image mapping per classic CSS cover requirement */}
            <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
            <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-genre text-uppercase fw-bold" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>{movie.language}</p>
                <div className="mt-auto pt-2 w-100">
                    <button className="btn-primary-custom w-100 rounded-pill fs-6 shadow-sm py-2">
                        View Showtimes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
