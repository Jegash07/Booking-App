import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// Register Form to submit user details and sign up
const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Allow picking role directly purely for demonstration (not ideal in real prod app)
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await register(name, email, password, role);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <Container className="mt-5 pt-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <div className="bg-dark p-5 rounded-4 shadow-lg border border-secondary">
                        <h2 className="text-center mb-4">Create Account</h2>
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="form-control-custom"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
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

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
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
                                <Form.Label>Account Type</Form.Label>
                                <Form.Select
                                    className="form-control-custom bg-dark"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="user">User - Book Tickets</option>
                                    <option value="admin">Admin - Manage App</option>
                                </Form.Select>
                            </Form.Group>

                            <Button variant="danger" type="submit" className="w-100 btn-primary-custom py-2 shadow-sm">
                                Sign Up
                            </Button>
                        </Form>

                        <div className="text-center mt-4">
                            <span className="text-muted">Already have an account? </span>
                            <Link to="/login" className="text-white text-decoration-none font-weight-bold">Sign In.</Link>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
