import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner, Badge, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { BiTimeFive, BiCalendarEvent, BiMap } from 'react-icons/bi';
import { AuthContext } from '../context/AuthContext';
import { fallbackMovies, generateFallbackShowtimes } from './Home';

const MovieDetails = () => {
    const { id } = useParams(); // URL params fetch movie ID
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

                const movieRes = await axios.get(`http://localhost:5000/api/movies/${id}`);
                setMovie(movieRes.data);

                const showtimesRes = await axios.get(`http://localhost:5000/api/showtimes/movie/${id}`);
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
            {/* Background Banner utilizing movie poster */}
            <div
                className="w-100 position-relative d-flex align-items-end mb-5 shadow-lg"
                style={{
                    height: '500px',
                    background: `url(${movie.posterUrl}) no-repeat center center`,
                    backgroundSize: 'cover',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="position-absolute w-100 h-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)' }}></div>
                <Container className="position-relative pb-5" style={{ zIndex: 10 }}>
                    <Row className="align-items-end">
                        <Col md={3} className="d-none d-md-block text-center">
                            <img src={movie.posterUrl} alt={movie.title} className="img-fluid rounded-4 shadow-lg border border-3" style={{ height: '400px', objectFit: 'cover', borderColor: '#d4af37', transform: 'translateY(15%)' }} />
                        </Col>
                        <Col md={9} className="text-white d-flex flex-column justify-content-end pb-3 ps-md-5">
                            <h1 className="fw-bolder display-4" style={{ fontFamily: "'Playfair Display', serif", textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{movie.title}</h1>
                            <div className="d-flex gap-3 mb-4 mt-2">
                                <Badge bg="light" className="fs-6 py-2 px-3 fw-bold shadow-sm" style={{ color: '#000' }}>{movie.genre}</Badge>
                                <Badge bg="warning" className="fs-6 py-2 px-3 fw-bold shadow-sm" style={{ color: '#000' }}>{movie.language}</Badge>
                                <span className="fs-5 text-warning fw-bold" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}><BiTimeFive className="me-1 mb-1" /> {movie.duration} mins</span>
                            </div>
                            <p className="fs-5 text-light opacity-75" style={{ maxWidth: '800px', lineHeight: '1.6', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>{movie.description}</p>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container className="mt-5 pt-5">
                <h3 className="mb-5 border-start border-danger border-5 ps-3 py-1 mt-4">Available Showtimes & Locations</h3>
                {showtimes.length === 0 ? (
                    <div className="p-5 text-center bg-dark rounded-4 shadow border-0">
                        <h4 className="text-muted">No showtimes available presently. Check again later.</h4>
                    </div>
                ) : (
                    <Row>
                        {/* Showtimes mapping per venue iteration mapping mapped onto Cards */}
                        {showtimes.map((showtime) => {
                            const showDate = new Date(showtime.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                            return (
                                <Col md={6} lg={4} key={showtime._id} className="mb-4">
                                    <div className="bg-dark rounded-4 p-4 shadow border-0 h-100" style={{ transition: 'transform 0.3s, box-shadow 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.5)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)'; }}>
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <h5 className="mb-0 text-white d-flex align-items-center fw-bold" style={{ fontSize: '1.1rem' }}><BiCalendarEvent className="me-2 text-warning fs-4" />{showDate}</h5>
                                            <Badge bg="secondary" text="white" className="fs-6 py-2 px-3 shadow-sm border-0 fw-bold">{showtime.time}</Badge>
                                        </div>
                                        <p className="text-muted fs-5 mb-4 d-flex align-items-center fw-bold"><BiMap className="me-2 text-danger fs-3" />{showtime.venue}</p>
                                        <hr style={{ opacity: '0.1' }} />
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <div>
                                                <p className="mb-0 text-muted small text-uppercase fw-bold" style={{ letterSpacing: '1px' }}>Standard Ticket</p>
                                                <h4 className="mb-0 fw-bold" style={{ color: '#28a745' }}>₹{showtime.price}</h4>
                                            </div>
                                            <Button
                                                variant="danger"
                                                className="btn-primary-custom px-4 rounded-pill shadow"
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
