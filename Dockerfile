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

# Install Python and other necessary packages
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get clean

# Set the working directory
WORKDIR /app

COPY requirements.txt ./
RUN pip3 install -r requirements.txt

COPY src/app.py /app/

# Download the AWS Lambda Runtime Interface Emulator
ADD https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie /usr/local/bin/aws-lambda-rie
RUN chmod 755 /usr/local/bin/aws-lambda-rie

# Configure the lambda function handler
CMD ["app.handler"]

# Set the entry point to the RIE
ENTRYPOINT ["/usr/local/bin/aws-lambda-rie"]