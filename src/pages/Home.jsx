import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Form } from 'react-bootstrap';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import HeroSection from '../components/HeroSection';
import SearchBar from '../components/SearchBar';

export const fallbackMovies = [
    {
        _id: 'f1',
        title: 'Leo',
        description: 'Parthiban is a mild-mannered cafe owner in Kashmir, who fends off a gang of murderous thugs and gains attention from a drug cartel claiming he was once a part of them.',
        genre: 'Action, Thriller',
        language: 'Tamil',
        duration: 164,
        releaseDate: '2023-10-19',
        posterUrl: '/leo.webp'
    },
    {
        _id: 'f2',
        title: 'Jailer',
        description: "A retired jailer goes on a manhunt to find his son's killers. But the road leads him to a familiar, albeit a bit darker place. Can he emerge from this complex situation successfully?",
        genre: 'Action, Comedy',
        language: 'Tamil',
        duration: 168,
        releaseDate: '2023-08-10',
        posterUrl: '/jailer.jpg'
    },
    {
        _id: 'f3',
        title: 'Vikram',
        description: 'A special investigator discovers a case of serial killings is not what it seems to be, and leading down this path is only going to end in a war between everyone involved.',
        genre: 'Action, Thriller',
        language: 'Tamil',
        duration: 175,
        releaseDate: '2022-06-03',
        posterUrl: '/vikram.webp'
    },
    {
        _id: 'f4',
        title: 'Ponniyin Selvan: Part I',
        description: 'Vandiyathevan sets out to cross the Chola land to deliver a message from the Crown Prince Aditha Karikalan. Kundavai attempts to establish political peace as vassals and petty chieftains plot against the throne.',
        genre: 'Action, Drama, History',
        language: 'Tamil',
        duration: 167,
        releaseDate: '2022-09-30',
        posterUrl: '/ponniyin selvan.webp'
    },
    {
        _id: 'f5',
        title: 'Maharaja',
        description: 'A barber seeks vengeance after his home is burglarized, telling police his "lakshmi" has been taken, leaving them uncertain if it\'s a person or object.',
        genre: 'Action, Thriller',
        language: 'Tamil',
        duration: 142,
        releaseDate: '2024-06-14',
        posterUrl: '/maharaja.webp'
    },
    {
        _id: 'f6',
        title: 'Indian 2',
        description: 'Senapathy, an ex-freedom fighter turned vigilante who fights against corruption...',
        genre: 'Action, Drama, Thriller',
        language: 'Tamil',
        duration: 180,
        releaseDate: '2024-07-12',
        posterUrl: '/indian 2.jpg'
    },
    {
        _id: 'f7',
        title: 'Jananayagan',
        description: 'A political thriller drama tackling society issues...',
        genre: 'Action, Drama',
        language: 'Tamil',
        duration: 155,
        releaseDate: '2000-09-01',
        posterUrl: '/jananayagan.webp'
    },
    {
        _id: 'f8',
        title: 'Sirai',
        description: 'A gripping social drama focusing on the harrowing experiences of a prison term...',
        genre: 'Drama, Thriller',
        language: 'Tamil',
        duration: 140,
        releaseDate: '1984-06-25',
        posterUrl: '/sirai.webp'
    }
];

export const generateFallbackShowtimes = (movieId) => {
    const movieObj = fallbackMovies.find(m => m._id === movieId) || {};
    return [
        {
            _id: `fs-${movieId}-1`,
            movie: movieObj,
            venue: 'PVR Cinemas, City Mall',
            date: new Date().toISOString(),
            time: '10:00 AM',
            price: 150,
            totalSeats: 60,
            bookedSeats: [2, 3, 12, 14]
        },
        {
            _id: `fs-${movieId}-2`,
            movie: movieObj,
            venue: 'INOX, VR Mall',
            date: new Date(Date.now() + 86400000).toISOString(),
            time: '04:30 PM',
            price: 200,
            totalSeats: 100,
            bookedSeats: [44, 45, 46]
        },
        {
            _id: `fs-${movieId}-3`,
            movie: movieObj,
            venue: 'Cinepolis, Nexus',
            date: new Date(Date.now() + 172800000).toISOString(),
            time: '07:15 PM',
            price: 250,
            totalSeats: 80,
            bookedSeats: [10, 11, 20, 21, 22]
        }
    ];
};

export const getFallbackShowtimeById = (showtimeId) => {
    for (const movie of fallbackMovies) {
        const showtimes = generateFallbackShowtimes(movie._id);
        const st = showtimes.find(s => s._id === showtimeId);
        if (st) return st;
    }
    return null;
};

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');

    const fetchMovies = async () => {
        try {
            setLoading(true);
            // STEP 1: Attempt to query the backend database for movies with the current search keyword
            const url = `http://localhost:5000/api/movies?keyword=${keyword}`;
            const res = await axios.get(url);

            // STEP 2: Check if the server actually returned any movies data
            if (res.data && res.data.length > 0) {
                // SUCCESS: The database has movies, set the React state to display them
                setMovies(res.data);
            } else {
                // STEP 3 (FALLBACK): The database is connected but entirely empty.
                // We instantly filter our offline `fallbackMovies` array by the keyword 
                // and display those instead of showing "Movie Not Available".
                const filteredFallback = fallbackMovies.filter(m => m.title.toLowerCase().includes(keyword.toLowerCase()));
                setMovies(filteredFallback);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching movies:', error);

            // STEP 4 (FALLBACK ON ERROR): The backend node server is completely offline/crashed.
            // Even though the API request failed completely, we capture the error here and
            // display the offline `fallbackMovies` anyway so the user always sees posters!
            const filteredFallback = fallbackMovies.filter(m => m.title.toLowerCase().includes(keyword.toLowerCase()));
            setMovies(filteredFallback);

            setLoading(false);
        }
    };

    useEffect(() => {
        // Automatically fetches and applies the text
        fetchMovies();
    }, [keyword]);

    return (
        <>
            <HeroSection />

            <Container className="my-5">
                <SearchBar keyword={keyword} setKeyword={setKeyword} />

                {/* Dynamic Display of Fetched Movies Grid */}
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                    <h2 className="mb-0 border-start border-danger border-5 ps-3 py-1">Now Showing</h2>
                    <p className="mb-0 text-muted fw-bold">{movies.length} Premieres Available</p>
                </div>

                {loading ? (
                    <div className="text-center my-5 py-5">
                        <Spinner animation="border" style={{ color: '#d4af37' }} />
                        <p className="mt-3" style={{ color: '#777' }}>Preparing the stage...</p>
                    </div>
                ) : movies.length === 0 ? (
                    <div className="text-center my-5 py-5 bg-dark shadow rounded-4 border-0">
                        <h3 className="text-warning">Movie Not Available</h3>
                        <p className="text-muted">We currently don't have this movie. Please try searching for another one.</p>
                    </div>
                ) : (
                    <Row>
                        {movies.map((movie) => (
                            <Col key={movie._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                                <MovieCard movie={movie} />
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </>
    );
};

export default Home;
