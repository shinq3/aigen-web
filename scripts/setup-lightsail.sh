#!/bin/bash
# 初回セットアップ用スクリプト（marukana方式）
set -e

SERVER="admin@52.196.136.76"
KEY="/Users/shin/.ssh/id_rsa"
APP_DIR="/var/www/d-auchy"
APP_NAME="dauchy-studio"

echo "=== Initial setup on Lightsail ==="

ssh -i "$KEY" "$SERVER" << 'EOF'
set -e
APP_DIR="/var/www/d-auchy"
APP_NAME="dauchy-studio"

echo "--- clone repo ---"
git clone https://github.com/shinq3/DauchyStudio.git "$APP_DIR" || (cd "$APP_DIR" && git pull origin main)

cd "$APP_DIR"

echo "--- npm install ---"
npm install

echo "--- build ---"
./node_modules/.bin/vite build
./node_modules/.bin/esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "--- pm2 start ---"
export $(cat .env | grep -v '^#' | grep -v '^$' | xargs)
pm2 start dist/index.js --name "$APP_NAME"
pm2 save

echo "=== Setup done ==="
EOF
