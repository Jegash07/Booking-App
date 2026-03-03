import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BiMoviePlay } from 'react-icons/bi';

// Responsive and dynamic navigation bar
const NavigationBar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Navbar expand="lg" className="custom-navbar" sticky="top">
            <Container fluid="md">
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <BiMoviePlay size={28} className="me-2 text-danger" />
                    <span className="brand-text">MovieTicket <span>BookingApp</span></span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 bg-transparent" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>

                        {!user ? (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Button as={Link} to="/register" className="btn-primary-custom ms-lg-3 px-4 shadow-sm">
                                    Register
                                </Button>
                            </>
                        ) : (
                            <>
                                {user.role === 'admin' && (
                                    <Nav.Link as={Link} to="/admin" className="text-warning fw-bold">Admin</Nav.Link>
                                )}
                                <Nav.Link as={Link} to="/my-bookings">My Bookings</Nav.Link>
                                <div className="d-flex align-items-center ms-lg-3 mt-3 mt-lg-0 border-lg-start ps-lg-3 border-secondary">
                                    <span className="text-secondary display-desktop mx-2">|</span>
                                    <span className="text-white me-3 d-block d-lg-inline">Hi, {user.name}</span>
                                    <Button onClick={handleLogout} variant="outline-light" size="sm" className="btn-sm rounded-pill px-3">
                                        Logout
                                    </Button>
                                </div>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;

