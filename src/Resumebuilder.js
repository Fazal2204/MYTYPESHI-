import React, { useState, useRef } from 'react';
import BlueprintResults from './Blueprintresults'; // We'll show this component after analysis

// Helper component for the upload icon
const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#4F46E5', marginBottom: '1rem' }}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);


function ResumeBuilder() {
    // State for managing form data
    const [preferences, setPreferences] = useState({
        dreamJob: 'Software Engineer',
        experienceLevel: 'Student / Entry-Level',
    });
    const [resumeFile, setResumeFile] = useState(null);

    // State for managing the flow (form, loading, results)
    const [status, setStatus] = useState('form'); // 'form', 'loading', 'results'
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null); // To trigger file input click

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPreferences(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResumeFile(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setResumeFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resumeFile) {
            setError('Please upload a resume file to continue.');
            return;
        }
        
        setError('');
        setStatus('loading');

        // NOTE: This part is a placeholder for a real implementation.
        // Reading PDF/DOCX content is complex and requires a library like pdf-lib or mammoth.js.
        // For this prototype, we'll send a placeholder text to the backend.
        const mockResumeText = `This is the content of the uploaded file: ${resumeFile.name}. A real implementation would extract the actual text here.`;

        try {
            const response = await fetch('http://localhost:3001/api/resume/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeText: mockResumeText,
                    userPreferences: preferences,
                }),
            });

            if (!response.ok) {
                throw new Error('Analysis failed. Please check the server.');
            }

            const data = await response.json();
            setAnalysisResult(data);
            setStatus('results');

        } catch (err) {
            setError(err.message);
            setStatus('form'); // Go back to the form on error
        }
    };

    const handleStartOver = () => {
        setStatus('form');
        setAnalysisResult(null);
        setResumeFile(null);
        setError('');
    };

    // If the analysis is complete, show the results page
    if (status === 'results') {
        return <BlueprintResults data={analysisResult} onBack={handleStartOver} />;
    }

    // Otherwise, show the form (or loading state)
    return (
        <div className="hero-section">
            <div className="hero-content">
                <h1>AI-Powered Resume & Career Blueprint</h1>
                <p>Upload your current resume, fill out your details, and let our AI craft the perfect resume and suggest the next steps for your career.</p>
            </div>
            <div className="form-container">
                <form onSubmit={handleSubmit} className="form-grid">
                    <div className="form-group">
                        <label htmlFor="dreamJob">What is your dream job?</label>
                        <input
                            type="text"
                            id="dreamJob"
                            name="dreamJob"
                            value={preferences.dreamJob}
                            onChange={handleInputChange}
                            placeholder="e.g., Software Engineer"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="experienceLevel">What is your experience level?</label>
                        <select
                            id="experienceLevel"
                            name="experienceLevel"
                            value={preferences.experienceLevel}
                            onChange={handleInputChange}
                        >
                            <option>Student / Entry-Level</option>
                            <option>Mid-Level Professional (2-5 years)</option>
                            <option>Senior Professional (5+ years)</option>
                        </select>
                    </div>

                    <div className="form-group full-width">
                        <label>Upload your resume</label>
                        <div
                            className="file-upload-area"
                            onClick={() => fileInputRef.current.click()}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <UploadIcon />
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.txt"
                                style={{ display: 'none' }}
                            />
                            {resumeFile ? (
                                <p>Selected: <strong>{resumeFile.name}</strong></p>
                            ) : (
                                <>
                                    <p><span>Upload your resume</span> or drag and drop</p>
                                    <p style={{ fontSize: '0.9rem' }}>PDF, DOC, DOCX, TXT</p>
                                </>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="generate-button" disabled={status === 'loading'}>
                        {status === 'loading' ? 'Analyzing...' : 'Generate My Blueprint'}
                    </button>
                    {error && <p className="status-message error full-width">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default ResumeBuilder;

