#!/bin/bash
set -e

echo "Deployment started ..."

# Pull the latest version of the app
git pull origin main
echo "New changes copied to server !"

# Copying src to /var/www/
echo "Copying src to /var/www/tqhcfr"
sudo cp -r src/* /var/www/tqhcfr

echo "Deployment Finished!"