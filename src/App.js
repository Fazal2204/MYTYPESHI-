import React, { useState, useEffect } from 'react';
import './index.css';
import ResumeBuilder from './Resumebuilder'; // We import the resume builder component

// This component shows the main category selection screen
function OpportunitiesView({ onSelectCategory }) {
    const categories = [
        { name: "Internship", icon: "💼", description: "Gain practical experience." },
        { name: "Competition", icon: "🏆", description: "Battle for excellence." },
        { name: "Webinar", icon: "💻", description: "Learn from experts." },
        { name: "Online Course", icon: "📚", description: "Refine your skills." },
        { name: "Community Service", icon: "❤️", description: "Make an impact." },
    ];

    return (
        <div className="hero-section">
            <div className="hero-content">
                <h1>Unlock Your Career</h1>
                <p>Explore opportunities, showcase skills, and get hired by your dream company.</p>
            </div>
            <div className="category-grid">
                {categories.map(category => (
                    <div key={category.name} className="category-card" onClick={() => onSelectCategory(category.name)}>
                        <div className="category-icon">{category.icon}</div>
                        <h3>{category.name}</h3>
                        <p>{category.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// This component shows the filtered list of opportunities for a selected category
function OpportunityListView({ category, onBack, opportunities }) {
    const filteredOps = opportunities.filter(op => op.type === category);

    return (
        <div className="opportunity-list-view">
            <button onClick={onBack} className="back-button">&larr; Back to Categories</button>
            <h2 className="list-view-title">{category} Opportunities</h2>
            <div className="opportunities-list">
                {filteredOps.length > 0 ? (
                    filteredOps.map(op => (
                        <div className="opportunity-card" key={op.id}>
                            <h3>{op.title} <span className="opportunity-type">{op.type}</span></h3>
                            <p>{op.description}</p>
                            <a href={op.url} target="_blank" rel="noopener noreferrer">Learn More</a>
                        </div>
                    ))
                ) : (
                    <p className="status-message">No opportunities found for this category right now.</p>
                )}
            </div>
        </div>
    );
}


// This is the main App component that controls the entire application
function App() {
    const [page, setPage] = useState('opportunities'); // Manages which main section is shown
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // This useEffect hook fetches the data from your backend when the app first loads
    useEffect(() => {
        // Using the full URL is correct for your current development setup (two terminals)
        fetch('http://localhost:3001/api/opportunities')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Load failed');
                }
                return response.json();
            })
            .then(data => {
                setOpportunities(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []); // The empty array [] means this runs only once

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
    };

    const handleBackToCategories = () => {
        setSelectedCategory(null);
    };

    // This function decides what to render for the "Opportunities" section
    const renderOpportunities = () => {
        if (loading) return <p className="status-message">Loading opportunities...</p>;
        if (error) return <p className="status-message error">Error: {error}. Is your server running?</p>;

        if (selectedCategory) {
            return <OpportunityListView
                category={selectedCategory}
                onBack={handleBackToCategories}
                opportunities={opportunities}
            />;
        } else {
            return <OpportunitiesView onSelectCategory={handleSelectCategory} />;
        }
    };

    return (
        <div className="App">
            <header>
                <div className="logo">PathFinder</div>
                <nav className="nav">
                    <button onClick={() => setPage('opportunities')} className={page === 'opportunities' ? 'active' : ''}>Opportunities</button>
                    <button onClick={() => setPage('resume')} className={page === 'resume' ? 'active' : ''}>AI Resume Builder</button>
                </nav>
            </header>
            <main>
                {/* This is the main content switcher */}
                {page === 'opportunities' ? renderOpportunities() : <ResumeBuilder />}
            </main>
        </div>
    );
}

export default App;

