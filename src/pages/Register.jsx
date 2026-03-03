import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';

// Register Form to submit user details and sign up
const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsSubmitting(true);
        try {
            const result = await register(name, email, password, role);
            if (result.success) {
                if (result.message) {
                    setSuccessMessage(result.message);
                    // Stay on page for a moment to show the message if it's offline mode
                    setTimeout(() => navigate('/'), 3000);
                } else {
                    navigate('/');
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="mt-4 mt-md-5 pt-3 pt-md-5">
            <Row className="justify-content-center">
                <Col xs={11} sm={9} md={7} lg={5}>
                    <div className="bg-dark p-4 p-md-5 rounded-4 shadow-lg border border-secondary position-relative overflow-hidden">
                        {/* Premium Gradient Background Effect */}
                        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
                            style={{ background: 'radial-gradient(circle at top right, #d4af37, transparent)' }}></div>

                        <h2 className="text-center mb-4 position-relative">Create Account</h2>

                        {error && <Alert variant="danger" className="py-2 small border-0 shadow-sm">{error}</Alert>}
                        {successMessage && <Alert variant="warning" className="py-2 small border-0 shadow-sm">{successMessage}</Alert>}

                        <Form onSubmit={handleSubmit} className="position-relative">
                            <Form.Group className="mb-3">
                                <Form.Label className="small text-secondary fw-bold">FULL NAME</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="form-control-custom"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small text-secondary fw-bold">EMAIL ADDRESS</Form.Label>
                                <Form.Control
                                    type="email"
                                    className="form-control-custom"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small text-secondary fw-bold">PASSWORD</Form.Label>
                                <Form.Control
                                    type="password"
                                    className="form-control-custom"
                                    placeholder="Minimum 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="small text-secondary fw-bold">ACCOUNT TYPE</Form.Label>
                                <Form.Select
                                    className="form-control-custom bg-dark text-white shadow-none"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="user">User - Book Tickets</option>
                                    <option value="admin">Admin - Manage App</option>
                                </Form.Select>
                            </Form.Group>

                            <Button
                                variant="danger"
                                type="submit"
                                className="w-100 btn-primary-custom py-3 shadow border-0"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="d-flex align-items-center justify-content-center">
                                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                        <span>SIGNING UP...</span>
                                    </div>
                                ) : 'CREATE ACCOUNT'}
                            </Button>
                        </Form>

                        <div className="text-center mt-4 position-relative">
                            <span className="text-muted small">Already part of our cinema? </span>
                            <Link to="/login" className="text-primary-custom text-decoration-none fw-bold small">Sign In.</Link>
                        </div>
                    </div>

                    {/* Connection Helper for Mobile Testing */}
                    <div className="text-center mt-3 text-secondary" style={{ fontSize: '0.75rem' }}>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;

