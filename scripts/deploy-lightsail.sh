#!/bin/bash
# ローカルでビルドして dist/ だけサーバーへ転送する方式（1GB RAM対応）
set -e

SERVER="admin@52.196.136.76"
KEY="/Users/shin/.ssh/id_rsa"
APP_DIR="/var/www/d-auchy/current"
APP_NAME="dauchy-studio"

echo "=== ローカルでビルド ==="
npm run build

echo "=== dist/ をサーバーへ転送 ==="
rsync -avz -e "ssh -i $KEY" --delete dist/ "$SERVER:$APP_DIR/dist/"

echo "=== pm2 再起動 ==="
ssh -i "$KEY" "$SERVER" "cd $APP_DIR && export \$(cat .env | grep -v '^#' | grep -v '^\$' | xargs) && pm2 restart $APP_NAME --update-env"

echo "=== Deploy done ==="
