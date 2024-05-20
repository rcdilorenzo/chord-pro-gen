#!/bin/bash

# Start Docker build and run processes in the background
docker run -p 5000:5000 --rm mdembree/ccpdfgenerator &
wait