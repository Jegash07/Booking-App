import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchMyBookings = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const res = await axios.get('http://localhost:5000/api/bookings/mybookings', config);
                setBookings(res.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching generic bookings mapping', error);
                setLoading(false);
            }
        };
        fetchMyBookings();
    }, [user, navigate]);

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="danger" /></div>;

    return (
        <Container className="mt-5 mb-5 pt-5 pb-5">
            <h2 className="mb-5 fw-bold border-start border-danger border-5 ps-3 py-1" style={{ fontFamily: "'Playfair Display', serif" }}>Booking History & Valid Tickets</h2>
            {bookings.length === 0 ? (
                <div className="p-5 text-center bg-dark rounded-4 shadow-sm">
                    <h3 className="text-muted mb-3">No bookings yet</h3>
                    <p className="text-muted">Book your first movie experience with MovieTicket BookingApp!</p>
                    <button className="btn btn-danger btn-primary-custom mt-3 px-4" onClick={() => navigate('/')}>Browse Movies</button>
                </div>
            ) : (
                <Row>
                    {bookings.map((b) => (
                        <Col md={6} lg={6} key={b._id} className="mb-4">
                            <Card className="bg-dark text-white shadow-lg overflow-hidden position-relative border-0">
                                <div className="position-absolute end-0 top-0 bg-success text-white fw-bold px-3 py-1 rounded-start-pill mt-3 shadow-sm" style={{ zIndex: 5, letterSpacing: '1px' }}>
                                    CONFIRMED
                                </div>
                                <Card.Body className="d-flex p-0">
                                    <div style={{ width: '130px' }} className="d-none d-sm-block bg-dark">
                                        <img src={b.showtime.movie.posterUrl} alt="Movie" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div className="p-4 w-100">
                                        <h4 className="fw-bolder mb-1 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{b.showtime.movie.title}</h4>
                                        <p className="text-muted d-flex align-items-center mb-3">
                                            {new Date(b.showtime.date).toLocaleDateString()} at {b.showtime.time} | {b.showtime.venue}
                                        </p>

                                        <Row className="mb-3">
                                            <Col xs={6}>
                                                <small className="opacity-50 d-block text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Booking ID/Ref</small>
                                                <span className="font-monospace user-select-all text-secondary small">{b._id}</span>
                                            </Col>
                                            <Col xs={6}>
                                                <small className="opacity-50 d-block text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Seats ({b.seatsBooked.length})</small>
                                                <div className="d-flex flex-wrap gap-1 mt-1">
                                                    {b.seatsBooked.map(seat => (
                                                        <Badge bg="light" text="dark" key={seat} className="fw-bold border shadow-sm">{seat}</Badge>
                                                    ))}
                                                </div>
                                            </Col>
                                        </Row>

                                        <div className="d-flex justify-content-between align-items-end border-top pt-3 mt-2" style={{ borderColor: '#eee' }}>
                                            <div>
                                                <small className="opacity-50 text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Total Payment</small>
                                                <h4 className="mb-0 fw-bold" style={{ color: '#28a745' }}>₹{b.totalAmount.toFixed(2)}</h4>
                                            </div>
                                            <Badge bg="secondary" className="py-2 px-3 fw-bold rounded-pill text-white shadow-sm" style={{ letterSpacing: '0.5px' }}>Generate PDF</Badge>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default MyBookings;
