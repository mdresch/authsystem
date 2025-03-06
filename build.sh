#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

echo "Building Docusaurus (dino)..."
cd dino
npm install

echo "Current PATH before modification: $PATH"  # Added: Show current PATH

echo "Executing Docusaurus build..." # Added: Confirmation message

yarn run build  # Execute docusaurus directly

echo "Docusaurus build completed."  # Added: Completion message

cd .. # Go back to the root

echo "Building Next.js (main)..."
npm run build # Assumes your next.config.js or package.json has the build command.

echo "Build completed successfully."
exit 0 # Ensure the script exits with a success code