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

let outputFileName; // Declare outputFileName as a global variable

// Route for serving the conversion form
app.get('/', (req, res) => {
    res.sendFile(path.join(html_path, 'ccpdfgenerator.html')); // Update the file path here
});

// Route for serving the conversion form
app.post('/submit', upload, (req, res) => {
    try {
        console.log(req.body);
        console.log(req.file.path);

        const cpnicepdfPath = '/usr/local/bin/cpnicepdf';
        const { transposeValue } = req.body;
        const chordproFilePath = req.file.path;

        if (req.file === '' || transposeValue === '' || outputFileName === '') {
            console.log('All fields are required');
            throw new Error('All fields are required');
        }

        if (transposeValue < -12 || transposeValue > 12) {
            console.log('Transpose value must be between -12 and 12');
            throw new Error('Transpose value must be between -12 and 12');
        }

        outputFileName = req.body.outputFileName; // Assign the value to the global variable

        const command = `${cpnicepdfPath} ${chordproFilePath} /app/generated-chord-charts/${outputFileName}.pdf ${transposeValue} chordpro.json`;
        console.log(command);
        exec(command, (error, stdout, stderr) => {
            if (stderr !== null) {
                console.log("error: " + stderr);
            } else {
                console.log("success: " + stdout);
            }
        });
        res.sendFile(path.join(html_path, 'success.html'));
    } catch (err) {
        console.error(err);
        // Delete the uploaded file if an error is thrown
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.sendFile(path.join(html_path, 'error.html'));
    };
});


// // Set the MIME type for JavaScript files
// app.get('/static/js/nice-chord-charts.js', (req, res) => {
//     res.setHeader('Content-Type', 'application/javascript');
//     res.sendFile(path.join(__dirname, 'static', 'js', 'form.js'));
// });

// Set the MIME type for CSS files
app.get('/static/css/ccpdfgenerator.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, 'static', 'css', 'ccpdfgenerator.css'));
});

// Set the MIME type for PDF files
app.get('/download', (req, res) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.download(path.join(__dirname, 'generated-chord-charts', `${outputFileName}.pdf`));
});

// Start the server
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
