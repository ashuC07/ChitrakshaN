const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SUBMISSIONS_FILE = path.join(__dirname, 'submissions.json');

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname))); // Serve static files from current directory

// Endpoint to handle form submission
app.post('/api/contact', (req, res) => {
    const { name, email, type, message } = req.body;

    // Basic server-side validation
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const newSubmission = {
        id: Date.now(),
        date: new Date().toISOString(),
        name,
        email,
        type: type || 'Not specified',
        message
    };

    // Read existing submissions or create new array if file doesn't exist
    let submissions = [];
    try {
        if (fs.existsSync(SUBMISSIONS_FILE)) {
            const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf8');
            submissions = JSON.parse(data);
        }
    } catch (err) {
        console.error('Error reading submissions file:', err);
        // Continue with an empty array if file parsing fails
    }

    submissions.push(newSubmission);

    // Save back to file
    try {
        fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), 'utf8');
        console.log(`New contact submission from ${name} (<${email}>)`);
        res.status(200).json({ success: true, message: 'Message received successfully!' });
    } catch (err) {
        console.error('Error writing submissions file:', err);
        res.status(500).json({ error: 'Failed to save submission.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Static files are being served from ${__dirname}`);
});
