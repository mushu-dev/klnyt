# Service Category Images

This directory contains images for the service categories on the homepage.

## Required Images:

1. **netflix-logo.jpeg** - Netflix streaming service logo
2. **shein-temu.jpeg** - Shein and Temu fashion shopping logos
3. **electronics-icons.jpeg** - Samsung, LG, Android, Apple electronics logos
4. **playstation-symbols.jpeg** - PlayStation and gaming service symbols

## Image Requirements:

- Format: JPEG preferred
- Size: Approximately 200px wide for optimal display
- Aspect ratio: Landscape or square preferred
- File size: Under 100KB each for fast loading

## Usage:

The images are referenced in `/src/components/homepage/KlyntHomepage.tsx` in the services array. Once the image files are added to this directory, they will automatically display in the service cards with error handling fallback.

## Fallback:

If an image fails to load, the component will hide the image and display only the emoji icon and text description.