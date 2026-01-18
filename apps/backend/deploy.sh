#!/bin/bash
set -e

# Configuration
APP_NAME="ecommerceearn-backend"
AWS_REGION="ap-south-1" # Change this if needed
ECR_REPO_NAME="ecommerceearn-backend"

echo "🚀 Starting Deployment Process for $APP_NAME"

# Check prerequisites
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed or not in PATH."
    echo "👉 Please install Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed."
    echo "👉 Please install AWS CLI: brew install awscli"
    exit 1
fi


if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker daemon is not running. Please start Docker Desktop."
    exit 1
fi

# Get AWS Account ID
echo "🔑 Checking AWS Identity..."
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
if [ -z "$ACCOUNT_ID" ]; then
    echo "❌ Failed to get AWS Account ID. Please run 'aws configure' to request credentials."
    exit 1
fi
echo "✅ AWS Account ID: $ACCOUNT_ID"

# Login to ECR
echo "🔐 Logging in to storage ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Create ECR Repo if not exists
echo "📦 Checking ECR Repository..."
aws ecr describe-repositories --repository-names $ECR_REPO_NAME --region $AWS_REGION > /dev/null 2>&1 || \
    aws ecr create-repository --repository-name $ECR_REPO_NAME --region $AWS_REGION

# Build Docker Image
echo "🔨 Building Docker Image..."
docker build -t $APP_NAME .

# Tag Image
echo "🏷️ Tagging Image..."
docker tag $APP_NAME:latest $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:latest

# Push Image
echo "⬆️ Pushing Image to ECR (this may take a while)..."
docker push $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:latest

echo "✅ Image successfully pushed to ECR!"
echo "registry URI: $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:latest"

echo ""
echo "🚀 To deploy to AWS App Runner:"
echo "1. Go to AWS Console > App Runner"
echo "2. Create Service > Source: Container Image"
echo "3. URI: $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:latest"
echo "4. Configure using the variables in your .env file."
