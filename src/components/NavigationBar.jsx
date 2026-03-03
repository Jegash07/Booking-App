import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BiMoviePlay } from 'react-icons/bi';

// Responsive and dynamic navigation bar
const NavigationBar = () => {
    const { user, logout } = useContext(AuthContext); // user object to determine login state and role
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Navbar expand="lg" className="custom-navbar" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <BiMoviePlay size={32} className="me-2 text-danger" />
                    Movie Ticket Booking App
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>

                        {/* Conditional rendering based on Authentication status */}
                        {!user ? (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Button as={Link} to="/register" className="btn-primary-custom ms-2 px-4 shadow-sm">
                                    Register
                                </Button>
                            </>
                        ) : (
                            <>
                                {/* Admin specific routes */}
                                {user.role === 'admin' && (
                                    <Nav.Link as={Link} to="/admin" className="text-warning fw-bold">Dashboard (Admin)</Nav.Link>
                                )}
                                <Nav.Link as={Link} to="/my-bookings">My Bookings</Nav.Link>
                                <span className="text-secondary mx-3">|</span>
                                <span className="text-white me-3">Hi, {user.name}</span>
                                <Button onClick={handleLogout} variant="outline-light" size="sm" className="btn-sm rounded-pill px-3">
                                    Logout
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
