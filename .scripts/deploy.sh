#!/bin/bash
set -e

if [ -s "$HOME/.nvm/nvm.sh" ]; then
if [ "$NODE_MAJOR" -lt 20 ]; then
	echo "Node.js 20+ is required for EOD-form build. Current version: $(node -v 2>/dev/null || echo 'not found')"
	echo "If Node is installed via nvm, ensure it is available to non-interactive shells."
	exit 1

echo "Deployment started ..."
echo "Using Node $(node -v) and npm $(npm -v)"

# Pull the latest version of the app
git pull origin main
echo "New changes copied to server !"

# Copying src to /var/www/
echo "Copying src to /var/www/tqhcfr"
sudo cp -r src/* /var/www/tqhcfr

# Build and deploy EOD-form to subdomain root
echo "Building EOD-form"
cd EOD-form
npm ci
npm run build

echo "Copying EOD-form dist to /var/www/eod"
ensure_writable_dir /var/www/eod
sudo rm -rf /var/www/eod/*
sudo cp -r dist/* /var/www/eod
cd ..

echo "Deployment Finished!"