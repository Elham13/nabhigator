#!/bin/bash
set -e

# Change directory to the project folder
cd /home/ubuntu/navigator-admin

# Get current date and time
currentDateTime=$(date +"%Y%m%d%H%M%S")

# Define target directory
targetDir="/home/ubuntu/deployments/navigator-admin$currentDateTime"

if [ -d ".next" ] 
#&& [ -f ".next/BUILD_ID" ] && [ -d ".next/static" ] && [ -f ".next/prerender-manifest.json" ]; then
# if [ -d ".next" ] && [ -f ".next/BUILD_ID" ] && [ -d ".next/static" ] && [ -f ".next/prerender-manifest.json" ]; then
    echo "Build successful."

    # Step 3: Copy the current folder to the target directory
    cp -r . "$targetDir"

    # Write targetDir to a temporary file
    echo "$targetDir" > /tmp/targetDirNavAdmin.txt
else
    echo "Build failed. The .next directory was not found. Deployment aborted."
    exit 1
fi