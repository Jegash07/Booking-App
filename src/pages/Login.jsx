import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// Login Page providing authentication form
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext); // Execute login from Context
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Invokes abstract context method
        const result = await login(email, password);
        if (result.success) {
            navigate('/'); // Return to home on success
        } else {
            setError(result.message);
        }
    };

    return (
        <Container className="mt-5 pt-5">
            <Row className="justify-content-center">
                <Col md={6} lg={4}>
                    <div className="bg-dark p-5 rounded-4 shadow-lg border border-secondary">
                        <h2 className="text-center mb-4 font-weight-bold">Sign In</h2>
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
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
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    className="form-control-custom"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button variant="danger" type="submit" className="w-100 btn-primary-custom py-2 shadow-sm">
                                Next
                            </Button>
                        </Form>

                        <div className="text-center mt-4">
                            <span className="text-muted">New to MovieTicket BookingApp? </span>
                            <Link to="/register" className="text-white text-decoration-none font-weight-bold">Sign up now.</Link>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
