const express = require('express'); // Import our Express dependency
const multer = require('multer');
const fs = require('fs');
const path = require('path'); // Import the path module
const spawn = require('child_process').spawn;
const { exec } = require("child_process");

const app = express(); // Create an Express application
const PORT = 5000; // Port number we want to use of this server

const html_path = path.join(__dirname, 'templates'); // HTML files folder

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'static', 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage }).single('chordproFile');

// Route for serving the conversion form
app.get('/', (req, res) => {
    res.sendFile(path.join(html_path, 'ccpdfgenerator.html')); // Update the file path here
});

// Route for serving the conversion form
app.post('/submit', upload, (req, res) => {
    try {
        console.log(req.body);

        const cpnicepdfPath = '/usr/local/bin/cpnicepdf';
        const { chordproContent, transposeValue, outputFileName } = req.body;

        if (chordproContent === '' || transposeValue === '' || outputFileName === '') {
            console.log('All fields are required');
            throw new Error('All fields are required');
        }

        if (transposeValue < -12 || transposeValue > 12) {
            console.log('Transpose value must be between -12 and 12');
            throw new Error('Transpose value must be between -12 and 12');
        }

        // Write the textarea content to a .chordpro file
        const chordproFilePath = path.join(__dirname, 'static', 'uploads', `chordproFile.chordpro`);
        try {
            fs.writeFileSync(chordproFilePath, chordproContent);
        } catch (err) {
            console.error(err);
            throw new Error('Failed to write chordpro file');
        }

        const command = `${cpnicepdfPath} ${chordproFilePath} ${path.join(__dirname, 'generated-chord-charts', `${outputFileName}.pdf`)} ${transposeValue} ${path.join(__dirname, 'chordpro.json')}`;
        console.log(command);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log("error: " + stderr);
                res.send('<script>alert("Conversion Error: did not complete");</script>');
            } else {
                console.log("success: " + stdout);        
                const generatedFilePath = path.join(__dirname, 'generated-chord-charts', `${outputFileName}.pdf`);
                res.setHeader('Content-Type', 'application/pdf');
                res.sendFile(generatedFilePath);
            }
        });
    } catch (err) {
        console.error(err);
        // Delete the uploaded file if an error is thrown
        fs.unlinkSync(path.join(__dirname, 'static', 'uploads', `chordproFile.chordpro`));
        res.send('<script>alert("Conversion Error: did not complete");</script>');
    };
});

// Set the MIME type for CSS files
app.get('/static/css/ccpdfgenerator.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, 'static', 'css', 'ccpdfgenerator.css'));
});

// Start the server
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
