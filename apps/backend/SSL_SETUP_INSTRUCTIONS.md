# 🚀 SSL Setup Instructions for EC2

Your backend is currently running at: `http://3.208.16.32`
After this setup, it will be available at: `https://api.lfvs.in`

## ⏰ DNS Status
DNS record has been added for `api.lfvs.in` → `3.208.16.32`
**Wait 5-30 minutes for DNS propagation before proceeding!**

Check DNS status:
```bash
nslookup api.lfvs.in
# Should return: 3.208.16.32
```

---

## 📋 Step 1: Copy Setup Script to EC2

From your local machine:

```bash
# Copy the setup script to EC2
scp -i ~/.ssh/ecommerceaff.pem setup-ssl.sh ec2-user@3.208.16.32:~/
```

---

## 🔧 Step 2: Run the Setup Script on EC2

SSH into your EC2 instance:

```bash
ssh -i ~/.ssh/ecommerceaff.pem ec2-user@3.208.16.32
```

Then run the automated setup:

```bash
# Make script executable
chmod +x setup-ssl.sh

# Run as root
sudo ./setup-ssl.sh
```

The script will automatically:
1. ✅ Install Nginx and Certbot
2. ✅ Configure reverse proxy to your Node.js app (port 3000)
3. ✅ Get FREE SSL certificate from Let's Encrypt
4. ✅ Set up auto-renewal for the certificate
5. ✅ Enable HTTPS and redirect HTTP → HTTPS

---

## ✅ Step 3: Verify Setup

Test that everything is working:

```bash
# Test HTTP (should redirect to HTTPS)
curl -I http://api.lfvs.in

# Test HTTPS
curl -I https://api.lfvs.in

# Check specific endpoint
curl https://api.lfvs.in/health
```

---

## 🔒 Step 4: Verify AWS Security Group

Make sure your EC2 security group allows:
- **Port 80 (HTTP)** - for Let's Encrypt validation & redirect
- **Port 443 (HTTPS)** - for secure access
- **Port 3000** - should only be accessible from localhost (not public)

---

## 🌐 Step 5: Update & Deploy Frontend Apps

Your environment files have been updated to use `https://api.lfvs.in`:
- ✅ Dashboard: `apps/dashboard/.env.local`
- ✅ Web: `apps/web/.env`

Now push changes and redeploy:

```bash
# From project root
git add .
git commit -m "feat: Switch to HTTPS API domain (api.lfvs.in)"
git push origin main

# Dashboard and Web will auto-deploy on Vercel
```

---

## 🔄 SSL Certificate Auto-Renewal

The script sets up automatic renewal via systemd timer.
Your certificate will auto-renew before expiration (every 90 days).

To manually test renewal:
```bash
sudo certbot renew --dry-run
```

---

## 🆘 Troubleshooting

### DNS not resolving
```bash
# Wait 5-30 minutes
# Check: nslookup api.lfvs.in
```

### Certbot fails
```bash
# 1. Ensure DNS is resolved
# 2. Check ports 80/443 are open
# 3. Ensure backend is running on port 3000
# 4. Retry: sudo certbot --nginx -d api.lfvs.in
```

### Backend not accessible
```bash
# Check if backend is running
docker ps
docker logs ecommerceearn-backend

# Restart backend if needed
cd ~/
./deploy-ec2.sh  # Re-run your deployment
```

### Nginx issues
```bash
# Check Nginx status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

---

## ✨ Next Steps After SSL Setup

1. ✅ Test API endpoints: `https://api.lfvs.in/health`
2. ✅ Redeploy dashboard to Vercel (auto-deploys after git push)
3. ✅ Test seller dashboard login
4. ✅ Verify mixed content errors are gone!

---

## 🎯 Expected Result

**Before:**
- ❌ Dashboard (HTTPS) → Backend (HTTP) = Mixed Content Error

**After:**
- ✅ Dashboard (HTTPS) → Backend (HTTPS) = Secure Connection!
