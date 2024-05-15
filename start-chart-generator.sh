#!/bin/bash

# Start Docker build and run processes in the background
if ! docker images | grep -q "chordpro-chromium"; then
    docker build -t chordpro-chromium .
fi
docker run -p 80:5000 --rm -v $(pwd):/data chordpro-chromium &
wait