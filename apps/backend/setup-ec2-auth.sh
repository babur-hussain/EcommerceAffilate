#!/bin/bash
set -e

# CONFIGURATION
EC2_IP="3.208.16.32"
PEM_KEY="ecommerce-key.pem"

echo "🔐 Configuring AWS Credentials on EC2 Server ($EC2_IP)..."
echo "We need to give the server permission to download your Docker image."

# Prompt for credentials
read -p "Enter your AWS Access Key ID: " AWS_KEY
echo ""
read -s -p "Enter your AWS Secret Access Key: " AWS_SECRET
echo ""
AWS_REGION="ap-south-1"

if [ -z "$AWS_KEY" ] || [ -z "$AWS_SECRET" ]; then
    echo "❌ Credentials cannot be empty."
    exit 1
fi

echo "🚀 sending credentials to server..."

ssh -i "$PEM_KEY" -o StrictHostKeyChecking=no ec2-user@$EC2_IP << EOF
  aws configure set aws_access_key_id "$AWS_KEY"
  aws configure set aws_secret_access_key "$AWS_SECRET"
  aws configure set default.region "$AWS_REGION"
  echo "✅ Server configured successfully!"
EOF

echo "🎉 Done! Now run ./deploy-ec2.sh again."
