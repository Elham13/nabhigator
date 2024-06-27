#!/bin/bash
set -e

# Read targetDir from the temporary file
if [ -f /tmp/targetDirNavAdmin.txt ]; then
    targetDir=$(cat /tmp/targetDirNavAdmin.txt)
else
    echo "Target directory file not found. Deployment aborted."
    exit 1
fi

# Stop and delete the current PM2 process
pm2 stop navigator-admin || true
pm2 delete navigator-admin || true

# Change directory to the target directory
cd "$targetDir"
cp /home/ubuntu/scripts/navigator-admin/.env .env
# Start the application with PM2
pm2 start npm --name "navigator-admin" -- start
pm2 save
pm2 startup

echo "Deployment successful."
