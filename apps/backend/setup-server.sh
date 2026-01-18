#!/bin/bash
set -e

echo "🚀 Setting up Server (Amazon Linux 2023)..."

# 1. Update and Install Docker
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# 2. Install AWS CLI (if not present)
if ! command -v aws &> /dev/null; then
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
fi

echo "✅ Docker Installed."
echo "👉 Please run 'aws configure' now to allow this server to pull images."
