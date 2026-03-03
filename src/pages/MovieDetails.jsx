import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner, Badge, Button } from 'react-bootstrap';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import { BiTimeFive, BiCalendarEvent, BiMap } from 'react-icons/bi';
import { AuthContext } from '../context/AuthContext';
import { fallbackMovies, generateFallbackShowtimes } from './Home';

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleBookSeats = (showtimeId) => {
        if (!user) {
            alert('Please register or sign in to book your tickets!');
            navigate('/login');
        } else {
            navigate(`/book/${showtimeId}`);
        }
    };

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                if (id && id.startsWith('f')) {
                    const fallbackMovie = fallbackMovies.find(m => m._id === id);
                    if (fallbackMovie) {
                        setMovie(fallbackMovie);
                        setShowtimes(generateFallbackShowtimes(id));
                        setLoading(false);
                        return;
                    }
                }

                const movieRes = await axios.get(`${API_BASE_URL}/api/movies/${id}`);
                setMovie(movieRes.data);

                const showtimesRes = await axios.get(`${API_BASE_URL}/api/showtimes/movie/${id}`);
                setShowtimes(showtimesRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movie details:', error);
                const fallbackMovie = fallbackMovies.find(m => m._id === id);
                if (fallbackMovie) {
                    setMovie(fallbackMovie);
                    setShowtimes(generateFallbackShowtimes(id));
                }
                setLoading(false);
            }
        };
        fetchMovieData();
    }, [id]);

    if (loading) return (
        <div className="text-center mt-5 pt-5"><Spinner animation="border" style={{ color: '#d4af37' }} /></div>
    );

    if (!movie) return <h2 className="text-center mt-5 text-muted">Movie Not Found</h2>;

    return (
        <div className="pb-5">
            <div
                className="movie-details-banner w-100 position-relative d-flex align-items-end shadow-lg"
                style={{
                    minHeight: '400px',
                    height: 'auto',
                    paddingTop: '60px',
                    paddingBottom: '40px',
                    background: `linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%), url(${movie.posterUrl}) no-repeat center center`,
                    backgroundSize: 'cover',
                    backgroundAttachment: 'fixed'
                }}
            >
                <Container className="position-relative" style={{ zIndex: 10 }}>
                    <Row className="align-items-center align-items-md-end">
                        <Col md={4} lg={3} className="d-none d-md-block text-center">
                            <img src={movie.posterUrl} alt={movie.title} className="img-fluid rounded-4 shadow-lg border border-3" style={{ height: '380px', width: '100%', objectFit: 'cover', borderColor: '#d4af37' }} />
                        </Col>
                        <Col md={8} lg={9} className="text-white ps-md-5">
                            <h1 className="fw-bolder display-5 display-md-4 mb-3" style={{ fontFamily: "'Playfair Display', serif", textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{movie.title}</h1>
                            <div className="d-flex flex-wrap gap-2 gap-md-3 mb-4 mt-2">
                                <Badge bg="light" className="fs-7 fs-md-6 py-2 px-3 fw-bold shadow-sm" style={{ color: '#000' }}>{movie.genre}</Badge>
                                <Badge bg="warning" className="fs-7 fs-md-6 py-2 px-3 fw-bold shadow-sm" style={{ color: '#000' }}>{movie.language}</Badge>
                                <span className="fs-6 fs-md-5 text-warning fw-bold d-flex align-items-center" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                                    <BiTimeFive className="me-1" /> {movie.duration} mins
                                </span>
                            </div>
                            <p className="fs-6 fs-md-5 text-light opacity-75" style={{ maxWidth: '800px', lineHeight: '1.6', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>{movie.description}</p>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container className="mt-4 mt-md-5">
                <h3 className="mb-4 mb-md-5 border-start border-danger border-5 ps-3 py-1">Available Showtimes</h3>
                {showtimes.length === 0 ? (
                    <div className="p-4 p-md-5 text-center bg-dark rounded-4 shadow border-0">
                        <h4 className="text-muted fs-5 fs-md-4">No showtimes available presently.</h4>
                    </div>
                ) : (
                    <Row>
                        {showtimes.map((showtime) => {
                            const showDate = new Date(showtime.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                            return (
                                <Col sm={12} md={6} lg={4} key={showtime._id} className="mb-4">
                                    <div className="bg-dark rounded-4 p-3 p-md-4 shadow border-0 h-100 mobile-card-hover" style={{ transition: 'all 0.3s ease' }}>
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <h5 className="mb-0 text-white d-flex align-items-center fw-bold" style={{ fontSize: '1rem' }}><BiCalendarEvent className="me-2 text-warning fs-5" />{showDate}</h5>
                                            <Badge bg="secondary" text="white" className="small py-2 px-3 shadow-sm border-0 fw-bold">{showtime.time}</Badge>
                                        </div>
                                        <p className="text-muted small mb-4 d-flex align-items-center fw-bold"><BiMap className="me-2 text-danger fs-4" />{showtime.venue}</p>
                                        <hr style={{ opacity: '0.05' }} />
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <div>
                                                <p className="mb-0 text-muted smaller text-uppercase fw-bold" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>Price</p>
                                                <h4 className="mb-0 fw-bold" style={{ color: '#d4af37' }}>₹{showtime.price}</h4>
                                            </div>
                                            <Button
                                                variant="danger"
                                                className="btn-primary-custom px-3 py-2 rounded-pill shadow small"
                                                onClick={() => handleBookSeats(showtime._id)}
                                            >
                                                Book Seats
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default MovieDetails;

