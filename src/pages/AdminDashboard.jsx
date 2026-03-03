import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Nav } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // State management for mapping movies and showtimes payloads abstracting DOM interactions
    const [movies, setMovies] = useState([]);
    const [message, setMessage] = useState('');

    // Movie Form Fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');
    const [language, setLanguage] = useState('');
    const [duration, setDuration] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [posterUrl, setPosterUrl] = useState('');

    // Showtime Form Fields
    const [selectedMovie, setSelectedMovie] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [venue, setVenue] = useState('');
    const [price, setPrice] = useState('');
    const [totalSeats, setTotalSeats] = useState(100);

    useEffect(() => {
        // Only Admin can access
        if (!user || user.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/movies');
                setMovies(res.data);
            } catch (err) {
                console.error('Error fetching movies', err);
            }
        };
        fetchMovies();
    }, []);

    const handleCreateMovie = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/movies', {
                title, description, genre, language, duration, releaseDate, posterUrl
            }, config);
            setMessage('Movie Created Successfully!');
            setTitle(''); setDescription(''); setGenre(''); setLanguage(''); setDuration(''); setReleaseDate(''); setPosterUrl('');
            // Reload movies list mapping visually generically
            const res = await axios.get('http://localhost:5000/api/movies');
            setMovies(res.data);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error creating movie');
        }
    };

    const handleCreateShowtime = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/showtimes', {
                movie: selectedMovie, date, time, venue, price, totalSeats
            }, config);
            setMessage('Showtime Generated Successfully!');
            setSelectedMovie(''); setDate(''); setTime(''); setVenue(''); setPrice(''); setTotalSeats(100);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error generating showtime');
        }
    };

    return (
        <Container className="my-5 pt-3">
            <h2 className="mb-4 border-start border-warning border-5 ps-3 py-1">Admin Dashboard Core System</h2>
            {message && <Alert variant="info" onClose={() => setMessage('')} dismissible>{message}</Alert>}

            <Tab.Container defaultActiveKey="movies">
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column bg-dark p-3 border border-secondary rounded-4 shadow-lg mb-4 mb-sm-0">
                            <Nav.Item>
                                <Nav.Link eventKey="movies" className="mb-2 btn-primary-custom text-white fw-bold">Manage Movies</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="showtimes" className="btn-primary-custom text-white fw-bold">Manage Showtimes</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            {/* Movies Tab Rendering Form Context Generics */}
                            <Tab.Pane eventKey="movies">
                                <Card className="bg-dark text-white border-secondary shadow-lg">
                                    <Card.Header className="bg-gradient bg-dark border-bottom border-secondary fs-5 py-3 fw-bold shadow">
                                        Add Blockbuster Movie
                                    </Card.Header>
                                    <Card.Body className="p-4">
                                        <Form onSubmit={handleCreateMovie}>
                                            <Row>
                                                <Col md={6} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Movie Title</Form.Label>
                                                        <Form.Control type="text" className="form-control-custom" value={title} onChange={e => setTitle(e.target.value)} required />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Genre</Form.Label>
                                                        <Form.Control type="text" className="form-control-custom" value={genre} onChange={e => setGenre(e.target.value)} required />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Description Synthesis Abstract</Form.Label>
                                                <Form.Control as="textarea" rows={3} className="form-control-custom" value={description} onChange={e => setDescription(e.target.value)} required />
                                            </Form.Group>

                                            <Row>
                                                <Col md={4} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Language</Form.Label>
                                                        <Form.Control type="text" className="form-control-custom" value={language} onChange={e => setLanguage(e.target.value)} required />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Duration (Mins)</Form.Label>
                                                        <Form.Control type="number" className="form-control-custom" value={duration} onChange={e => setDuration(e.target.value)} required />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Release Date</Form.Label>
                                                        <Form.Control type="date" className="form-control-custom" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} required />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Form.Group className="mb-4">
                                                <Form.Label>Upload Custom Movie Poster Image</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    className="form-control-custom bg-dark text-white"
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (!file) return;

                                                        const formData = new FormData();
                                                        formData.append('image', file);

                                                        try {
                                                            const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` } };
                                                            const { data } = await axios.post('http://localhost:5000/api/upload', formData, config);
                                                            setPosterUrl(data.imageUrl);
                                                            setMessage('Image staged successfully. Save to publish.');
                                                        } catch (error) {
                                                            setMessage(error.response?.data?.message || 'Error occurred during image staging process.');
                                                        }
                                                    }}
                                                    required
                                                />
                                            </Form.Group>

                                            <Button variant="danger" type="submit" className="btn-primary-custom w-100 shadow py-2 fw-bold">
                                                Publish Movie Globally
                                            </Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {/* Showtimes Tab Rendering Form Context Generics */}
                            <Tab.Pane eventKey="showtimes">
                                <Card className="bg-dark text-white border-secondary shadow-lg">
                                    <Card.Header className="bg-gradient bg-dark border-bottom border-secondary fs-5 py-3 fw-bold shadow">
                                        Allocate Live Showtimes Generics
                                    </Card.Header>
                                    <Card.Body className="p-4">
                                        <Form onSubmit={handleCreateShowtime}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Select Contextual Movie Reference</Form.Label>
                                                <Form.Select className="form-control-custom bg-dark text-white" value={selectedMovie} onChange={e => setSelectedMovie(e.target.value)} required>
                                                    <option value="">-- Choose Assigned Live Movie Context --</option>
                                                    {movies.map(m => (
                                                        <option key={m._id} value={m._id}>{m.title}</option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>

                                            <Row>
                                                <Col md={6} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Screening Mapping Date Node</Form.Label>
                                                        <Form.Control type="date" className="form-control-custom" value={date} onChange={e => setDate(e.target.value)} required />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Screening Mapping Time Node</Form.Label>
                                                        <Form.Control type="time" className="form-control-custom" value={time} onChange={e => setTime(e.target.value)} required />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={4} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Venue / Cinema Hall Branch</Form.Label>
                                                        <Form.Control type="text" className="form-control-custom" value={venue} onChange={e => setVenue(e.target.value)} placeholder="e.g. Screen 1" required />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Base Visual Seats Price (₹)</Form.Label>
                                                        <Form.Control type="number" className="form-control-custom" value={price} onChange={e => setPrice(e.target.value)} required />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>Limit Availability Cap</Form.Label>
                                                        <Form.Control type="number" className="form-control-custom" value={totalSeats} onChange={e => setTotalSeats(e.target.value)} required />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Button variant="danger" type="submit" className="btn-primary-custom fw-bold w-100 shadow py-2 mt-2">
                                                Deploy Showtime Live Session Base Context
                                            </Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    );
};

export default AdminDashboard;
