// server.js - Final Version for Production & Sharing

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
// The PORT will be set by the deployment service, or 3001 for local production testing
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors()); // A simple cors is often enough in production as it's same-origin
app.use(express.json());

// --- THIS IS THE KEY PART ---
// Serve the static files from the React app's "build" folder
app.use(express.static(path.join(__dirname, 'build')));

// --- Mock Database ---
let opportunities = [
    { id: 1, type: 'Competition', title: 'Google Code Jam 2025', keywords: ['coding', 'software', 'engineering'], url: 'http://example.com/codejam', description: 'Global online coding competition. Solve algorithmic challenges.' },
    { id: 2, type: 'Internship', title: 'Product Manager Intern', keywords: ['product management', 'business', 'strategy'], url: 'http://example.com/pm-intern', description: 'Help define product roadmaps and strategy.' },
    { id: 3, type: 'Webinar', title: 'Intro to AI/ML', keywords: ['ai', 'machine learning', 'data science'], url: 'http://example.com/ai-webinar', description: 'Learn the fundamentals of Artificial Intelligence from industry experts.' },
    { id: 4, type: 'Community Service', title: 'Local Park Cleanup', keywords: ['environment', 'community', 'volunteering'], url: 'http://example.com/park-cleanup', description: 'Join us to help clean and preserve our local green spaces.' },
    { id: 5, type: 'Internship', title: 'Software Engineer Intern', keywords: ['coding', 'software', 'engineering', 'javascript'], url: 'http://example.com/swe-intern', description: 'Work on a real-world software project using modern web technologies.' },
    { id: 6, type: 'Online Course', title: 'Advanced JavaScript', keywords: ['javascript', 'coding', 'web development'], url: 'http://example.com/js-course', description: 'Deep dive into asynchronous JavaScript, closures, and more.' }
];

// --- API ROUTES ---
// These must be defined BEFORE the catch-all route.
app.get('/api/opportunities', (req, res) => {
    res.json(opportunities);
});

app.post('/api/resume/analyze', (req, res) => {
    try {
        const { resumeText, userPreferences } = req.body;
        if (!resumeText || !userPreferences) {
            return res.status(400).json({ error: 'resumeText and userPreferences are required.' });
        }
        const analysisResult = analyzeAndImproveResume(resumeText, userPreferences);
        res.json(analysisResult);
    } catch (error) {
        console.error("--- ERROR in /api/resume/analyze ---", error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// --- THE "CATCH-ALL" HANDLER ---
// For any request that doesn't match an API route, send back the React app's main page.
// This is the corrected syntax that resolves the PathError.
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`✅ PathFinder server is now running in PRODUCTION mode on http://localhost:${PORT}`);
});

// --- **NEW & IMPROVED** MOCK AI HELPER FUNCTION ---
function analyzeAndImproveResume(text, prefs) {
    const dreamJob = (prefs && prefs.dreamJob && prefs.dreamJob.trim() !== '') ? prefs.dreamJob : 'a top professional role';
    
    const suggestions = [
        "ATS Keyword Optimization: Your resume should include keywords from the job description. For a 'Software Engineer' role, add terms like 'API', 'backend', 'frontend', 'testing', and specific frameworks.",
        "Use Action Verbs: Replace passive phrases like 'responsible for' with powerful action verbs like 'Engineered', 'Architected', 'Developed', 'Optimized', or 'Managed'.",
        "Quantify Achievements: Instead of saying you 'improved performance', say you 'Optimized database queries, resulting in a 30% reduction in page load time'. Numbers make your impact clear.",
        "Employ the STAR Method: Structure your experience bullet points using the Situation, Task, Action, Result (STAR) method to create compelling stories of your accomplishments.",
        "File Format: Always submit your resume as a PDF file to preserve formatting, unless the application specifically requests a .docx file."
    ];
    const analysis = {
        foundSkills: ['javascript', 'react'],
        weakPhrases: ['Responsible for'],
        quantificationNeeded: true,
    };
    let improvedResume = {
        header: "Firstname Lastname\n(123) 456-780 | professional.email@example.com | linkedin.com/in/yourprofile",
        summary: `A results-driven professional with skills in JavaScript and React. Seeking to leverage these abilities in a ${dreamJob} role to build and optimize impactful software solutions.`,
        experience: [
            "Engineered a full-stack e-commerce platform using the MERN stack, resulting in a 15% increase in user engagement.",
            "Developed and integrated a RESTful API for payment processing, handling over 1,000 transactions per day.",
        ],
        skills: "Technical Skills: JavaScript (ES6+), React, Node.js, Express, MongoDB\nSoft Skills: Agile Methodologies, Problem-Solving, Team Collaboration",
    };
    let recommendedOpportunities = [];
    const requiredKeywords = dreamJob.toLowerCase().split(' ');
    if(analysis.foundSkills.length > 0) {
        requiredKeywords.push(...analysis.foundSkills);
    }
    opportunities.forEach(op => {
        if (op.keywords?.some(kw => requiredKeywords.includes(kw.toLowerCase()))) {
            recommendedOpportunities.push(op);
        }
    });
    return { 
        analysis, 
        suggestions, 
        improvedResume, 
        recommendedOpportunities: recommendedOpportunities.slice(0, 2) 
    };
}

