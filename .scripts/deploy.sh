#!/bin/bash
set -e

echo "Deployment started ..."

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

echo "Copying EOD-form dist to /var/www/eod.tqhcfr.cc"
sudo mkdir -p /var/www/eod.tqhcfr.cc
sudo rm -rf /var/www/eod.tqhcfr.cc/*
sudo cp -r dist/* /var/www/eod.tqhcfr.cc
cd ..

echo "Deployment Finished!"