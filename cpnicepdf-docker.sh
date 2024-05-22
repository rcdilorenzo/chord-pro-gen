#!/bin/bash

# Define a function called cpnicepdf
cpnicepdf() {
    transpose=0
    mode=""

    # Check if the second argument is not provided
    if [ -z ${2+x} ]; then
        # If not provided, generate the PDF filename by replacing "chordpro" with "pdf" in the first argument
        pdffilename="${1/chordpro/pdf}"
    else
        # If provided, use the second argument as the PDF filename
        pdffilename=$2
    fi

    # Check if the third argument is provided
    if [ ! -z ${3+x} ]; then
        # If provided, set the transpose value to the third argument
        transpose=$3
    fi

    # Check if the fourth argument is provided
    if [ ! -z ${4+x} ]; then
        # If provided, set the mode value to "--config=<fourth argument>"
        mode=" --config=$4"
    fi

    # Generate an HTML file from the first argument using the chordpro command, with optional transpose and mode values
    chordpro $1 --transpose=$transpose $mode --generate=HTML > tempnicepdf.html

    # Use Google Chrome in headless mode to convert the generated HTML file to PDF
    google-chrome --no-sandbox --headless --disable-gpu --print-to-pdf-no-header --print-to-pdf=$pdffilename tempnicepdf.html

    # Remove the temporary HTML file
    rm tempnicepdf.html
}

# Change directory to /data
cd /data || mkdir -p /data && cd /data

# Call the cpnicepdf function with all the command line arguments
cpnicepdf $@
