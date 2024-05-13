# Use an official Ubuntu base image
FROM ubuntu:22.04

# Install required packages
RUN apt-get update -y

# Install deps
RUN apt-get install -y wget perl curl software-properties-common make libwx-perl

# Install ChordPro
RUN cpan -T chordpro

# Add the third-party repository for Chromium
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list

# Update and install Chromium
RUN apt-get update && apt-get install -y \
    google-chrome-stable \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copy the script into the image
COPY cpnicepdf-docker.sh /usr/local/bin/cpnicepdf
RUN chmod +x /usr/local/bin/cpnicepdf

# Set the working directory
WORKDIR /app

# Copy the package.json file to the working directory
COPY package.json .

# Install dependencies
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which your Node.js app is listening
EXPOSE 80

# Start the Node.js app when the container runs
CMD [ "npm", "start" ]
