#!/bin/bash
# Script to clean and rebuild the extension

echo "Cleaning dist directory..."
rm -rf dist

echo "Building extension with Vite..."
pnpm compile

echo "Checking if extension file was built:"
if [ -f "dist/web/extension.js" ]; then
  echo "Extension file exists! Here's a preview:"
  head -n 20 dist/web/extension.js
else
  echo "ERROR: Extension file not found! Check the build configuration."
  echo "Looking for extension files in dist directory:"
  find dist -type f -name "*extension*" | xargs ls -la
fi

echo "Build complete. Run the extension with: pnpm run-in-browser" 