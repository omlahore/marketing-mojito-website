#!/bin/bash
# Deploy to Lightsail - BUILD LOCALLY, use standalone (no npm on server - 512MB RAM)
set -e
SERVER="ubuntu@13.232.187.181"
KEY="$HOME/Documents/Marketing-Mojito/Backups/LightsailDefaultKey-ap-south-1.pem"

cd "$(dirname "$0")"

echo "=== Cleaning local Next.js cache (avoids stale webpack chunks) ==="
rm -rf .next

echo "=== Building locally ==="
npm run build

echo "=== Preparing standalone deployment ==="
# Standalone creates minimal deploy - no npm install needed on server
STANDALONE=".next/standalone"
cp -r .next/static "$STANDALONE/.next/"
cp -r public "$STANDALONE/"

echo "=== Creating deployment package ==="
cd "$STANDALONE"
tar -czf /tmp/deploy.tar.gz .
cd - > /dev/null

echo "=== Uploading ==="
scp -i "$KEY" /tmp/deploy.tar.gz "$SERVER:/var/www/marketing-mojito/"
scp -i "$KEY" .env.local "$SERVER:/var/www/marketing-mojito/" 2>/dev/null || true

echo "=== Deploying on server ==="
ssh -i "$KEY" "$SERVER" "cd /var/www/marketing-mojito && \
  cp .env.local /tmp/.env.local.bak 2>/dev/null || true && \
  find . -mindepth 1 -maxdepth 1 ! -name '.env.local' ! -name 'deploy.tar.gz' -exec rm -rf {} + 2>/dev/null || true && \
  tar -xzf deploy.tar.gz && rm -f deploy.tar.gz && \
  cp /tmp/.env.local.bak .env.local 2>/dev/null || true && \
  pm2 restart marketing-mojito && pm2 save"

echo "✅ Deployment complete! Site live at https://marketingmojito.com (or http://13.232.187.181)"
