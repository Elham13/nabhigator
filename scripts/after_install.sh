#!/bin/bash

# Change directory to the project folder
cd /home/ubuntu/multi-stage-form

# Get current date and time
currentDateTime=$(date +"%Y%m%d%H%M%S")

# Define target directory
targetDir="/home/ubuntu/deployments/website$currentDateTime"

# Number of deployments to keep
deploymentsToKeep=1

# Step 1: Install dependencies
npm install

# Step 2: Build the project
NODE_OPTIONS="--max-old-space-size=32000" npm run build

# Verify that the build was successful by checking for the .next directory
if [ -d ".next" ]; then
    echo "Build successful."

    # Step 3: Copy the current folder to the target directory
    cp -r . "$targetDir"

    # Step 4: Manage PM2 process
    pm2 stop nextJs
    pm2 delete nextJs
    cd "$targetDir"
    pm2 start npm --name "nextJs" -- start
    pm2 save
    pm2 startup

    echo "Deployment successful."

    # Step 5: Delete old deployment folders
    cd /home/ubuntu/deployments
    ls -t | grep '^website[0-9]\{14\}$' | tail -n +$(($deploymentsToKeep + 1)) | xargs rm -rf

    echo "Old deployments deleted."
else
    echo "Build failed. The .next directory was not found. Deployment aborted."
    exit 1
fi