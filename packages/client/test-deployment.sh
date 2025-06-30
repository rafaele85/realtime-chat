#!/bin/bash

# Utility script to test Vercel deployment locally
# Usage: ./test-deployment.sh
# 
# Prerequisites:
# 1. Create .env.local with your Vercel credentials:
#    VERCEL_TOKEN=your_token_here
#    VERCEL_ORG_ID=your_org_id_here  
#    VERCEL_PROJECT_ID=your_project_id_here

set -e  # Exit on any error

echo "🚀 Testing Vercel Deployment Locally"
echo "======================================"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local with your Vercel credentials:"
    echo "VERCEL_TOKEN=your_token_here"
    echo "VERCEL_ORG_ID=your_org_id_here"
    echo "VERCEL_PROJECT_ID=your_project_id_here"
    exit 1
fi

# Load environment variables
echo "📋 Loading credentials from .env.local..."
source .env.local

# Validate required variables
if [ -z "$VERCEL_TOKEN" ] || [ -z "$VERCEL_ORG_ID" ] || [ -z "$VERCEL_PROJECT_ID" ]; then
    echo "❌ Error: Missing required environment variables!"
    echo "Please ensure .env.local contains: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID"
    exit 1
fi

echo "✅ Credentials loaded (token: ${VERCEL_TOKEN:0:10}...)"

# Install Vercel CLI locally
echo "📦 Installing Vercel CLI..."
npm install vercel --save-dev --silent

# Build the project first (like CI does)
echo "🏗️  Building project..."
cd ../../  # Go to monorepo root
npm run build --workspace=shared --silent
npm run build --workspace=client --silent
cd packages/client

# Test deployment
echo "🚀 Deploying to Vercel..."
echo "This will deploy to production. Press Ctrl+C to cancel, or wait 5 seconds to continue..."
sleep 5

npx vercel --token "$VERCEL_TOKEN" --prod --yes

# Clean up
echo "🧹 Cleaning up..."
rm -rf .vercel
npm uninstall vercel --silent

echo "✅ Deployment test completed!"
echo "Check the deployment URL above to verify it works."