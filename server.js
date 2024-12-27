const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Setup multer for file upload
const upload = multer({ dest: 'uploads/' });

// GitHub API and Authentication
const GITHUB_TOKEN = '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';
const GITHUB_REPO = 'codesaifofficial/github-file-uploader';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/`;

app.use(bodyParser.json());
app.use(express.static('public'));

// Handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const content = fs.readFileSync(file.path, { encoding: 'base64' });
    const filePath = path.join('uploads', file.filename);

    try {
        const response = await axios.put(`${GITHUB_API_URL}${file.originalname}`, {
            message: 'Upload new file',
            content: content,
        }, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
            },
        });

        res.json({ fileName: file.originalname, githubUrl: response.data.content.html_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload to GitHub' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
