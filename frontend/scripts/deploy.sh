#!/bin/bash

# Exit on error
set -e

# Build the application
echo "Building the application..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
  echo "Build failed!"
  exit 1
fi

# Generate sitemap
echo "Generating sitemap..."
npm run generate-sitemap

# Check if sitemap was generated
if [ ! -f "build/sitemap.xml" ]; then
  echo "Sitemap generation failed!"
  exit 1
fi

# Check environment variables
echo "Checking environment variables..."
required_vars=(
  "REACT_APP_API_URL"
  "REACT_APP_SUPABASE_URL"
  "REACT_APP_SUPABASE_ANON_KEY"
  "REACT_APP_BASE_URL"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Error: $var is not set"
    exit 1
  fi
done

# Check bundle size
echo "Checking bundle size..."
js_size=$(stat -f%z "build/static/js/main.chunk.js" 2>/dev/null || stat -c%s "build/static/js/main.chunk.js")
css_size=$(stat -f%z "build/static/css/main.chunk.css" 2>/dev/null || stat -c%s "build/static/css/main.chunk.css")

js_size_mb=$(echo "scale=2; $js_size/1024/1024" | bc)
css_size_kb=$(echo "scale=2; $css_size/1024" | bc)

echo "Bundle sizes:"
echo "JavaScript: ${js_size_mb}MB"
echo "CSS: ${css_size_kb}KB"

if (( $(echo "$js_size_mb > 2" | bc -l) )); then
  echo "Warning: JavaScript bundle is large (>2MB). Consider code splitting."
fi

echo "Deployment checks passed successfully!" 