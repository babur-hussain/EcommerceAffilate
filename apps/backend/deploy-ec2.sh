#!/bin/bash
set -e

# --- CONFIGURATION ---
APP_NAME="ecommerceearn-backend"
AWS_REGION="ap-south-1" 
ECR_URI="704484478453.dkr.ecr.ap-south-1.amazonaws.com/$APP_NAME:latest"

# ⚠️ UPDATE THESE BEFORE RUNNING
EC2_IP="3.208.16.32"
PEM_KEY="ecommerce-key.pem" 

echo "🚀 Deploying to EC2 ($EC2_IP)..."

# 1. Build and Push to ECR (Reusing existing logic)
echo "📦 Building & Pushing Image..."
# Check tools
if ! command -v docker &> /dev/null; then echo "❌ Docker missing"; exit 1; fi
if ! command -v aws &> /dev/null; then echo "❌ AWS CLI missing"; exit 1; fi

# Login & Push
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin 704484478453.dkr.ecr.ap-south-1.amazonaws.com
docker build -t $APP_NAME .
docker tag $APP_NAME:latest $ECR_URI
docker push $ECR_URI

# 2. Deploy to EC2 via SSH
echo "⚡ Connecting to EC2 to restart application..."

# Securely upload .env file and Firebase service account
scp -i "$PEM_KEY" -o StrictHostKeyChecking=no .env ec2-user@$EC2_IP:~/.env.production
scp -i "$PEM_KEY" -o StrictHostKeyChecking=no firebase-adminsdk.json ec2-user@$EC2_IP:~/firebase-adminsdk.json

ssh -i "$PEM_KEY" -o StrictHostKeyChecking=no ec2-user@$EC2_IP << EOF
  # Login to ECR on server
  aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin 704484478453.dkr.ecr.ap-south-1.amazonaws.com
  
  # Pull new image
  docker pull $ECR_URI
  
  # Stop old container
  docker stop $APP_NAME || true
  docker rm $APP_NAME || true
  
  # Run new container using the uploaded .env file AND mounted firebase config
  docker run -d \
    --name $APP_NAME \
    -p 80:4000 \
    --restart unless-stopped \
    --env-file ~/.env.production \
    -v /home/ec2-user/firebase-adminsdk.json:/app/firebase-adminsdk.json \
    $ECR_URI

  echo "✅ Application started on port 80!"
EOF

echo "🎉 Deployment Complete! Visit http://$EC2_IP"
