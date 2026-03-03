import React from 'react';

const HeroSection = () => {
    return (
        <div className="hero-section" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop')" }}>
            <div className="hero-overlay"></div>
            <div className="hero-content mt-5">
                <h1 className="display-4 mb-3">Cinema Reimagined</h1>
                <p className="fs-5 mb-4 text-light">Immerse yourself in spectacular cinematic stories.</p>
            </div>
        </div>
    );
};

export default HeroSection;
