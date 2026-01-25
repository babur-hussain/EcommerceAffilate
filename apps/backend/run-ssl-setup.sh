#!/bin/bash

# 🚀 Automated EC2 SSL Setup
# This script copies the SSL setup script to EC2 and runs it

echo "🔍 Finding SSH key..."

# Common SSH key locations
POSSIBLE_KEYS=(
  "$HOME/.ssh/ecommerceaff.pem"
  "$HOME/.ssh/id_rsa"
  "$HOME/.ssh/id_ed25519"
  "$(ls -t $HOME/.ssh/*.pem 2>/dev/null | head -n1)"
)

SSH_KEY=""
for key in "${POSSIBLE_KEYS[@]}"; do
  if [ -f "$key" ]; then
    SSH_KEY="$key"
    echo "✅ Found SSH key: $SSH_KEY"
    break
  fi
done

if [ -z "$SSH_KEY" ]; then
  echo "❌ No SSH key found!"
  echo "Please specify your EC2 key path:"
  read -p "SSH Key Path: " SSH_KEY
fi

EC2_HOST="ec2-user@3.208.16.32"

echo ""
echo "📤 Copying SSL setup script to EC2..."
scp -i "$SSH_KEY" apps/backend/setup-ssl.sh "$EC2_HOST:~/"

if [ $? -ne 0 ]; then
  echo "❌ Failed to copy script to EC2"
  exit 1
fi

echo "✅ Script copied successfully!"
echo ""
echo "🔐 Connecting to EC2 and running SSL setup..."
echo "   This will configure HTTPS for api.lfvs.in"
echo ""

# Connect to EC2 and run the setup script
ssh -i "$SSH_KEY" "$EC2_HOST" << 'ENDSSH'
  echo "🚀 Running SSL setup on EC2..."
  chmod +x setup-ssl.sh
  sudo ./setup-ssl.sh
  
  echo ""
  echo "✅ Setup complete!"
  echo ""
  echo "🔍 Testing endpoints..."
  echo ""
  echo "HTTP (should redirect to HTTPS):"
  curl -I http://api.lfvs.in
  echo ""
  echo "HTTPS:"
  curl -I https://api.lfvs.in
ENDSSH

echo ""
echo "🎉 All done! Your backend is now running with HTTPS!"
echo "   URL: https://api.lfvs.in"
echo ""
echo "📱 Next: Your dashboard will auto-deploy on Vercel with the new API URL"
