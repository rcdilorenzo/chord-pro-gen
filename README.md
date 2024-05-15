# Chord Chart PDF Generator

This project is a Dockerized application that uses ChordPro, Chromium, and a Node.js server.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for usage, development, and testing purposes.

### Prerequisites

You need Docker installed on your machine to run this project. If you don't have Docker installed, you can download it from [here](https://www.docker.com/products/docker-desktop/).

### Installing

#### Repository Method
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. For Mac: Run build-chart-generator.sh.
   For Windows: Run build-chart-generator.bat.

#### Zip Folder Method
1. Download the zip file for the latest release.
2. Extract the folder to the desired location.
3. Navigate to the project directory.
4. For Mac: Run build-chart-generator.sh.
   For Windows: Run build-chart-generator.bat.

### Running
1. For Mac: Run start-chart-generator.sh.
   For Windows: Run start-chart-generator.bat.
2. The application should now be running at [http://localhost:80](http://localhost:80).

### Using the Program
1. Select from the computer the .chordpro file you generated.
2. Enter how much you want to transpose the chord chart (from -12 to 12).
3. Specify the name of the output file.
4. Hit the Convert to PDF button.
5. Upon success the file will be downloaded to the generated-chord-charts folder in the project.

### Stopping
1. Close out of the terminal running the Node.js server and the container will close.

## Built With

- [ChordPro](https://www.chordpro.org/) - A tool to create nice looking printable lead sheets from text files in ChordPro format.
- [Chromium](https://www.chromium.org/) - An open-source browser project that aims to build a safer, faster, and more stable way for all users to experience the web.
- [Node.js](https://nodejs.org/) - A JavaScript runtime built on Chrome's V8 JavaScript engine.

## Authors

- Micah Embree - [mdembree218](https://github.com/mdembree218)
- Christian Di Lorenzo - [rcdilorenzo](https://github.com/rcdilorenzo)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
