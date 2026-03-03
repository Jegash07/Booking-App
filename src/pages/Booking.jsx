import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import { AuthContext } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import { getFallbackShowtimeById } from './Home';

// Setup Mock Stripe Test Publishable Key Native Integration mapping
const stripePromise = loadStripe('pk_test_51MockStripeKeyForTestingDemoOnly12345');

// Main Booking Mapping Container Export Setup
const Booking = () => {
    const { showtimeId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [showtime, setShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchShowtime = async () => {
            try {
                if (showtimeId && showtimeId.startsWith('fs-')) {
                    const fallbackST = getFallbackShowtimeById(showtimeId);
                    if (fallbackST) {
                        setShowtime(fallbackST);
                        setLoading(false);
                        return;
                    }
                }

                const res = await axios.get(`${API_BASE_URL}/api/showtimes/${showtimeId}`);
                setShowtime(res.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching showtime:', error);

                const fallbackST = getFallbackShowtimeById(showtimeId);
                if (fallbackST) {
                    setShowtime(fallbackST);
                    setLoading(false);
                    return;
                }

                setError('Failed to load showtime details.');
                setLoading(false);
            }
        };
        fetchShowtime();
    }, [showtimeId, user, navigate]);

    const toggleSeatSelection = (seatNo) => {
        if (showtime.bookedSeats.includes(seatNo)) return;
        if (selectedSeats.includes(seatNo)) {
            setSelectedSeats(selectedSeats.filter(seat => seat !== seatNo));
        } else {
            setSelectedSeats([...selectedSeats, seatNo]);
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="danger" /></div>;
    if (!showtime) return <h3 className="text-center text-muted mt-5">Showtime mapping lost</h3>;

    return (
        <Container className="my-5">
            <Row>
                <Col lg={8} className="mb-4">
                    <div className="bg-dark p-4 rounded-4 shadow border-0">
                        <h3 className="mb-4 border-bottom pb-3 d-flex align-items-center justify-content-between">
                            <span className="text-white fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Seat Selection - <span className="text-warning">{showtime.venue}</span></span>
                            <span className="fs-5 text-muted">{new Date(showtime.date).toLocaleDateString()} &bull; {showtime.time}</span>
                        </h3>
                        {error && <Alert variant="danger">{error}</Alert>}

                        {/* Virtual Screen Illustration */}
                        <div className="cinema-screen mt-4 mb-5 mx-auto opacity-75 d-flex align-items-center justify-content-center text-dark fw-bold shadow-lg">
                            Cinematic Screen
                        </div>

                        {/* Matrix rendering for Seats */}
                        <div className="seats-container">
                            {Array.from({ length: Math.ceil(showtime.totalSeats / 10) }).map((_, rowIndex) => (
                                <div key={rowIndex} className="seat-row">
                                    {Array.from({ length: 10 }).map((_, colIndex) => {
                                        const seatNumber = rowIndex * 10 + colIndex + 1;
                                        if (seatNumber > showtime.totalSeats) return null;

                                        const isBooked = showtime.bookedSeats.includes(seatNumber);
                                        const isSelected = selectedSeats.includes(seatNumber);

                                        let seatClass = 'seat';
                                        if (isBooked) seatClass += ' booked';
                                        if (isSelected) seatClass += ' selected';

                                        return (
                                            <div
                                                key={seatNumber}
                                                className={seatClass}
                                                onClick={() => toggleSeatSelection(seatNumber)}
                                                title={`Seat ${seatNumber}`}
                                            >
                                                {seatNumber}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* Legend reference colors */}
                        <div className="d-flex justify-content-center gap-4 mt-5 border-top pt-4">
                            <div className="legend-item"><div className="seat seat-sm" style={{ cursor: 'default', transform: 'none' }}></div> Available</div>
                            <div className="legend-item"><div className="seat seat-sm selected" style={{ cursor: 'default', transform: 'none' }}></div> Selected</div>
                            <div className="legend-item"><div className="seat seat-sm booked" style={{ cursor: 'default', transform: 'none' }}></div> Booked</div>
                        </div>
                    </div>
                </Col>

                {/* Invoice & Abstract Summary Side Pane */}
                <Col lg={4}>
                    <div className="bg-dark p-4 rounded-4 shadow border-0 sticky-top" style={{ top: '100px' }}>
                        <div className="d-flex mb-4 gap-3 align-items-center border-bottom pb-4">
                            <img src={showtime.movie.posterUrl} alt="Movie Poster" style={{ width: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                            <div>
                                <h4 className="fw-bolder text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{showtime.movie.title}</h4>
                                <p className="text-muted mb-0">{showtime.venue}</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h5 className="text-warning mb-3">Booking Summary</h5>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="opacity-75">Tickets Section</span>
                                <span className="fw-bold text-white">{selectedSeats.length} Seats Selection</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 text-muted">
                                <small>Seats: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</small>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="opacity-75">Base Rate</span>
                                <span className="text-white fw-bold">₹{showtime.price.toFixed(2)}</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <span className="fs-5 text-uppercase fw-bold">Subtotal Amount</span>
                                <span className="fs-3 fw-bold text-success">₹{(selectedSeats.length * showtime.price).toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Sub-component Injection for Safe Checkout Validation mapping logically */}
                        <Elements stripe={stripePromise}>
                            <CheckoutForm
                                selectedSeats={selectedSeats}
                                showtime={showtime}
                                user={user}
                                setError={setError}
                            />
                        </Elements>

                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Booking;
