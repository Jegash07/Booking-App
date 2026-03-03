import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BiMoviePlay } from 'react-icons/bi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

// Footer component showing global branding
const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-5 pb-3 mt-5 border-top border-secondary">
            <Container>
                <Row className="justify-content-center text-center text-md-start">
                    <Col md={6} className="mb-4">
                        <h5 className="text-danger d-flex justify-content-center justify-content-md-start align-items-center fw-bold">
                            <BiMoviePlay size={24} className="me-2" /> MovieTicket BookingApp
                        </h5>
                        <p className="text-muted small mt-3 px-3 px-md-0">
                            The ultimate destination for booking your favorite movies. Seamless experience, real-time seat selection, and secure booking in one place.
                        </p>
                    </Col>
                    <Col md={6} className="mb-4 d-flex flex-column align-items-center align-items-md-end text-center text-md-end">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled text-muted small mt-2">
                            <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Terms of Service</a></li>
                            <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Privacy Policy</a></li>
                            <li className="mb-2"><a href="#" className="text-decoration-none text-muted">FAQs</a></li>
                            <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Contact Support</a></li>
                        </ul>
                    </Col>
                </Row>
                <div className="text-center text-muted small border-top border-secondary pt-3 mt-3">
                    &copy; {new Date().getFullYear()} MovieTicket BookingApp. All rights reserved.
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
