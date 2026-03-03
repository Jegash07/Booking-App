import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// Login Page providing authentication form
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const result = await login(email, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="mt-4 mt-md-5 pt-3 pt-md-5">
            <Row className="justify-content-center">
                <Col xs={11} sm={8} md={6} lg={4}>
                    <div className="bg-dark p-4 p-md-5 rounded-4 shadow-lg border border-secondary">
                        <h2 className="text-center mb-4 font-weight-bold">Sign In</h2>
                        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className="small text-secondary">Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    className="form-control-custom"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="formBasicPassword">
                                <Form.Label className="small text-secondary">Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    className="form-control-custom"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button
                                variant="danger"
                                type="submit"
                                className="w-100 btn-primary-custom py-2 shadow-sm"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Signing In...' : 'Next'}
                            </Button>
                        </Form>

                        <div className="text-center mt-4">
                            <span className="text-muted small">New to MovieTicket BookingApp? </span>
                            <Link to="/register" className="text-white text-decoration-none font-weight-bold small">Sign up now.</Link>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;

