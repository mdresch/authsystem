#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

echo "Building Docusaurus (dino)..."
cd dino
npm install
node_modules/.bin/docusaurus build  # **MODIFIED LINE: Explicit path to docusaurus**

cd .. # Go back to the root

echo "Building Next.js (main)..."
npm run build # Assumes your next.config.js or package.json has the build command.

echo "Build completed successfully."
exit 0 # Ensure the script exits with a success code