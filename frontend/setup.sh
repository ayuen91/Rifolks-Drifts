#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Create necessary directories if they don't exist
echo "Creating necessary directories..."
mkdir -p src/components src/pages src/store/slices src/styles src/utils src/hooks src/assets

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cp .env.example .env.local
    echo "Please update .env.local with your environment variables"
fi

# Build the project
echo "Building the project..."
npm run build

echo "Setup complete! You can now run 'npm run dev' to start the development server." 