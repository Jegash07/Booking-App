import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import Booking from './pages/Booking';
import AdminDashboard from './pages/AdminDashboard';
import MyBookings from './pages/MyBookings';

// Main App Layout defining Routes
function App() {
  return (
    <Router>
      <ScrollToTop />
      {/* Navigation bar stays persistent across all routes */}
      <NavigationBar />
      <div style={{ minHeight: '80vh', paddingBottom: '3rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/book/:showtimeId" element={<Booking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
      {/* Footer spans the bottom of every layout */}
      <Footer />
    </Router>
  );
}

export default App;
