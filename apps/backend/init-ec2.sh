#!/bin/bash
set -e

# ⚠️ UPDATE THESE BEFORE RUNNING
EC2_IP="3.208.16.32"
PEM_KEY="ecommerce-key.pem" 

echo "🚀 Initializing EC2 Server at $EC2_IP..."

# 1. Upload the setup script
echo "📤 Uploading setup script..."
scp -i "$PEM_KEY" -o StrictHostKeyChecking=no setup-server.sh ec2-user@$EC2_IP:~/setup-server.sh

# 2. Run the setup script remotely
echo "🔧 Running setup script on server..."
ssh -i "$PEM_KEY" -o StrictHostKeyChecking=no ec2-user@$EC2_IP << EOF
  chmod +x ~/setup-server.sh
  ~/setup-server.sh
EOF

echo "✅ Server Initialized! Docker is installed and running."
echo "👉 Now you can run './deploy-ec2.sh' to deploy your app."
