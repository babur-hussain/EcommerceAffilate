#!/bin/bash

echo "🚀 Setting up HTTPS for api.lfvs.in..."
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root or with sudo"
    exit 1
fi

# Update system
echo "📦 Updating system packages..."
dnf update -y

# Install Nginx and Certbot
echo "📦 Installing Nginx and Certbot..."
dnf install -y nginx certbot python3-certbot-nginx

# Create Nginx configuration
echo "⚙️  Creating Nginx configuration..."
cat > /etc/nginx/conf.d/api.conf << 'EOF'
server {
    listen 80;
    server_name api.lfvs.in;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase timeouts for long requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# Test Nginx configuration
echo "🔍 Testing Nginx configuration..."
nginx -t

if [ $? -ne 0 ]; then
    echo "❌ Nginx configuration test failed!"
    exit 1
fi

# Start and enable Nginx
echo "▶️  Starting Nginx..."
systemctl start nginx
systemctl enable nginx

# Check if backend is running
echo "🔍 Checking if backend is running..."
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend is running on port 3000"
else
    echo "⚠️  Warning: Backend doesn't seem to be running on port 3000"
    echo "   Make sure your Node.js app is running before proceeding with SSL!"
fi

# Check if domain resolves
echo "🔍 Checking DNS resolution..."
if nslookup api.lfvs.in > /dev/null 2>&1; then
    echo "✅ DNS is configured correctly"
else
    echo "⚠️  Warning: DNS might not be fully propagated yet"
    echo "   You may need to wait a few minutes and try again"
fi

# Test HTTP access
echo "🔍 Testing HTTP access..."
if curl -s http://api.lfvs.in > /dev/null 2>&1; then
    echo "✅ HTTP access working!"
else
    echo "⚠️  Warning: Cannot access http://api.lfvs.in yet"
fi

# Install SSL certificate
echo ""
echo "🔐 Installing SSL certificate from Let's Encrypt..."
echo "   You'll be prompted for:"
echo "   1. Email address (for renewal notifications)"
echo "   2. Agreement to Terms of Service"
echo "   3. Whether to redirect HTTP to HTTPS (choose YES/2)"
echo ""

certbot --nginx -d api.lfvs.in --non-interactive --agree-tos --email sarvrachna.com@gmail.com --redirect

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SSL Certificate installed successfully!"
    echo "✅ HTTPS is now active at: https://api.lfvs.in"
    echo ""
    echo "🔄 Setting up auto-renewal..."
    systemctl enable certbot-renew.timer
    
    echo ""
    echo "✅ All done! Your backend is now accessible via HTTPS!"
    echo "   HTTP: http://api.lfvs.in  → redirects to HTTPS"
    echo "   HTTPS: https://api.lfvs.in ✓"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Update your dashboard .env to use https://api.lfvs.in"
    echo "   2. Redeploy your dashboard to Vercel"
else
    echo ""
    echo "⚠️  SSL installation failed or was skipped"
    echo "   Common reasons:"
    echo "   - DNS not fully propagated (wait 5-30 minutes)"
    echo "   - Port 80/443 not open in security group"
    echo "   - Domain not pointing to this server"
    echo ""
    echo "   You can retry SSL setup later with:"
    echo "   sudo certbot --nginx -d api.lfvs.in"
fi
