#!/bin/bash

# Start Docker build and run processes in the background
docker run -p 80:5000 --rm -v $(pwd):/data mdembree/ccpdfgenerator &
wait