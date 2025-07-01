#!/bin/bash

# Deploy script for GCP instance

# Variables
INSTANCE_NAME="chat-app-instance"
ZONE="us-central1-a"
REMOTE_USER="rambo"
REMOTE_PATH="/home/rambo/app"

echo "🚀 Starting deployment to GCP..."

# Build the server locally first
echo "📦 Building server..."
npm run build:server

# Create a temporary directory for deployment files
echo "📁 Preparing deployment files..."
rm -rf .deploy-temp
mkdir -p .deploy-temp

# Copy necessary files (server only)
cp package*.json .deploy-temp/
cp -r packages/server .deploy-temp/server
cp -r packages/shared .deploy-temp/shared

# Copy environment file if it exists
if [ -f .env.local ]; then
    cp .env.local .deploy-temp/.env
    echo "✅ Environment file copied"
else
    echo "⚠️  Warning: .env.local not found, server will use default settings"
fi

# Transfer files to GCP instance
echo "📤 Transferring files to server..."
gcloud compute scp --recurse .deploy-temp/* ${INSTANCE_NAME}:${REMOTE_PATH}/ --zone=${ZONE}

# Run deployment commands on the server
echo "🔧 Running deployment commands on server..."
gcloud compute ssh ${INSTANCE_NAME} --zone=${ZONE} --command="
cd ${REMOTE_PATH} &&
echo '📦 Installing root dependencies...' &&
npm install &&
echo '📦 Installing server dependencies...' &&
cd server && npm install && cd .. &&
echo '📦 Installing shared dependencies...' &&
cd shared && npm install && cd .. &&
echo '🔄 Restarting application with PM2...' &&
pm2 stop chat-server || true &&
pm2 start server/dist/src/server.js --name chat-server &&
pm2 save &&
echo '✅ Deployment complete!'
"

# Clean up
rm -rf .deploy-temp

# Show server status and logs
echo "📊 Checking server status..."
gcloud compute ssh ${INSTANCE_NAME} --zone=${ZONE} --command="pm2 status && pm2 logs chat-server --lines 5 --nostream"

echo "🎉 Deployment finished!"
echo "📍 Your app should be accessible at: http://$(gcloud compute instances describe ${INSTANCE_NAME} --zone=${ZONE} --format='get(networkInterfaces[0].accessConfigs[0].natIP)'):3001"