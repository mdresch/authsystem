#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

echo "Building Docusaurus (dino)..."
cd dino
npm install

echo "Current PATH before modification: $PATH"  # Added: Show current PATH

export PATH=$PATH:./node_modules/.bin  # Keep this!

echo "Current PATH after modification: $PATH"

echo "Executing Docusaurus build..." # Added: Confirmation message

docusaurus build # Execute docusaurus directly

echo "Docusaurus build completed."  # Added: Completion message

echo "Checking the built Docusaurus directory:"
ls -l build #addedL show the details for the build path
echo "Files inside the build directory:" # more details
find build -type f # find the path

cd .. # Go back to the root

echo "Building Next.js (main)..."
npm run build # Assumes your next.config.js or package.json has the build command.

echo "Build completed successfully."
exit 0 # Ensure the script exits with a success code