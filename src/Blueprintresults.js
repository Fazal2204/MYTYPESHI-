// src/BlueprintResults.js - Displays the formatted AI analysis

import React from 'react';

// A small helper component for SVG icons to add a professional touch
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feedback-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

// This is a "presentational" component. Its only job is to receive data ('props') and display it.
function BlueprintResults({ data, onBack }) {
  // We safely destructure the data, providing empty fallbacks to prevent crashes if data is missing
  const { suggestions = [], improvedResume = {}, recommendedOpportunities = [] } = data || {};

  // Further fallback for nested properties
  const { header = '', summary = '', experience = [], skills = '' } = improvedResume;

  return (
    <div className="blueprint-container">
      <div className="blueprint-header">
        <h2 className="blueprint-main-title">Your AI-Generated Career Blueprint</h2>
        <button onClick={onBack} className="back-button">&larr; Start Over</button>
      </div>
      
      <div className="blueprint-grid">
        {/* Column 1: The Improved Resume */}
        <div className="resume-preview-container">
          <h3 className="blueprint-section-title">ATS-Optimized Resume Preview</h3>
          <div className="resume-preview">
            <div className="resume-header">
              {header.split('\n').map((line, index) => <p key={index}>{line}</p>)}
            </div>
            <div className="resume-section">
              <h4>Professional Summary</h4>
              <p>{summary}</p>
            </div>
            <div className="resume-section">
              <h4>Experience</h4>
              {experience.map((item, index) => <p key={index}>• {item}</p>)}
            </div>
             <div className="resume-section">
              <h4>Skills</h4>
              {skills.split('\n').map((line, index) => <p key={index}>{line}</p>)}
            </div>
          </div>
        </div>

        {/* Column 2: Feedback and Opportunities */}
        <div className="feedback-and-ops-container">
          <div className="feedback-section">
            <h3 className="blueprint-section-title">Actionable Feedback & ATS Tips</h3>
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <CheckIcon />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="recommended-ops-section">
            <h3 className="blueprint-section-title">Recommended For You</h3>
            {recommendedOpportunities.length > 0 ? (
                recommendedOpportunities.map(op => (
                   <div className="opportunity-card compact" key={op.id}>
                    <h3>{op.title} <span className="opportunity-type">({op.type})</span></h3>
                    <p>{op.description}</p>
                    <a href={op.url} target="_blank" rel="noopener noreferrer">Learn More</a>
                  </div>
                ))
            ) : (
                <p>No specific opportunities found based on this resume. Broaden your skills to get more recommendations!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlueprintResults;

