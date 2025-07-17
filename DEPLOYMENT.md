

Node.js Deployment (Express)

### Step 1: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Upload and setup your application
```bash
# Upload all files including package.json and server.js
# Install dependencies
npm install

# Install PM2 for process management
sudo npm install -g pm2
```

### Step 3: Start your application
```bash
# Start with PM2
pm2 start server.js --name "bigbrains-form"
pm2 startup
pm2 save
```

### Step 4: Configure Nginx as reverse proxy
```bash
sudo nano /etc/nginx/sites-available/bigbrains-form
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL Certificate (Optional but Recommended)

### Install Certbot for Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## Firewall Configuration
```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Monitoring and Maintenance

### For Node.js deployment:
```bash
# Check application status
pm2 status
pm2 logs bigbrains-form

# Restart application
pm2 restart bigbrains-form
```

### For Nginx:
```bash
# Check Nginx status
sudo systemctl status nginx

# Check logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Quick Commands Summary

### Upload files via Git (if you have a repository):
```bash
git clone https://github.com/yourusername/bigbrains-form-creator.git
cd bigbrains-form-creator
```

### Test your deployment:
- Static: `http://your-server-ip` or `http://your-domain.com`
- Node.js: Same URL, but served through Express

## Troubleshooting

1. **Permission issues**: Make sure nginx user has access to files
2. **Port issues**: Ensure your application is running on the correct port
3. **Firewall**: Check if ports 80 and 443 are open
4. **Domain**: Update DNS records to point to your server IP

Choose Option 1 for simple deployment, or Option 2 if you need server-side functionality.

## Automated Deployment with deploy.sh

For automated deployments, use the included `deploy.sh` script:

### First-time Setup

1. **Upload your files to the server:**
```bash
# Create the directory
sudo mkdir -p /var/www/bigbrains-form
cd /var/www/bigbrains-form

# Initialize git and add your remote repository
sudo git init
sudo git remote add origin https://github.com/yourusername/bigbrains-form-creator.git
sudo git pull origin main

# Make deploy script executable
sudo chmod +x deploy.sh
```

2. **Run the deployment script:**
```bash
sudo ./deploy.sh
```

### Automatic Deployments

The script automatically:
- ✅ Pulls latest changes from git
- ✅ Detects static vs Node.js deployment
- ✅ Configures Nginx properly
- ✅ Handles permissions and security
- ✅ Removes the default Nginx welcome page
- ✅ Tests configuration before applying
- ✅ Provides detailed logging

### Usage Examples

```bash
# Full deployment (pull changes + redeploy)
sudo ./deploy.sh

# Check application status only
sudo ./deploy.sh --status

# Show help
sudo ./deploy.sh --help
```

### Logs and Monitoring

- **Deployment logs:** `/var/log/bigbrains-deploy.log`
- **Nginx logs:** `/var/log/nginx/access.log` and `/var/log/nginx/error.log` 

# V3 Windows Deployment Guide

This guide covers deploying the v3-windows application to `windows3.homeprosusa.org` on port 3002.

## Prerequisites

- Ubuntu/Debian server with root access
- Node.js 14+ installed
- Nginx installed
- Git installed

## Quick Deployment

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt install nginx -y

# Install PM2 globally
sudo npm install -g pm2
```

### Step 2: Create Application Directory

```bash
# Create the application directory
sudo mkdir -p /var/www/v3-windows
cd /var/www/v3-windows

# Initialize git repository (if not already done)
sudo git init
sudo git remote add origin https://github.com/yourusername/v3-windows.git
sudo git pull origin main
```

### Step 3: Deploy Application

```bash
# Make deploy script executable
sudo chmod +x deploy.sh

# Run deployment
sudo ./deploy.sh
```

## Manual Deployment Steps

### 1. Install Dependencies

```bash
cd /var/www/v3-windows
sudo npm install --production
```

### 2. Start Application with PM2

```bash
# Start the application on port 3002
sudo pm2 start server.js --name "v3-windows" -- --port 3002

# Save PM2 configuration
sudo pm2 save

# Setup PM2 to start on boot
sudo pm2 startup systemd -u root --hp /root
```

### 3. Configure Nginx

Create the Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/v3-windows
```

Add this configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name windows3.homeprosusa.org;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

Enable the site:

```bash
sudo ln -sf /etc/nginx/sites-available/v3-windows /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Set Permissions

```bash
sudo chown -R www-data:www-data /var/www/v3-windows
sudo chmod -R 755 /var/www/v3-windows
```

## DNS Configuration

Add this A record to your DNS settings:

```
windows3.homeprosusa.org → Your Server IP Address
```

## SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d windows3.homeprosusa.org
```

## Firewall Configuration

```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Monitoring and Maintenance

### Check Application Status

```bash
# Check PM2 status
sudo pm2 status v3-windows

# Check PM2 logs
sudo pm2 logs v3-windows

# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Restart Application

```bash
# Restart PM2 process
sudo pm2 restart v3-windows

# Reload Nginx
sudo systemctl reload nginx
```

### Update Application

```bash
cd /var/www/v3-windows
sudo git pull origin main
sudo npm install --production
sudo pm2 restart v3-windows
```

## Troubleshooting

### Common Issues

1. **Port already in use**: Check if port 3002 is available
   ```bash
   sudo netstat -tlnp | grep :3002
   ```

2. **Permission denied**: Ensure proper file permissions
   ```bash
   sudo chown -R www-data:www-data /var/www/v3-windows
   ```

3. **Nginx configuration error**: Test configuration
   ```bash
   sudo nginx -t
   ```

4. **PM2 process not starting**: Check logs
   ```bash
   sudo pm2 logs v3-windows
   ```

### Log Files

- **Application logs**: `/var/log/v3-windows-deploy.log`
- **Nginx access logs**: `/var/log/nginx/access.log`
- **Nginx error logs**: `/var/log/nginx/error.log`
- **PM2 logs**: `sudo pm2 logs v3-windows`

## Automated Deployment with deploy.sh

The included `deploy.sh` script automates the entire deployment process:

```bash
# Full deployment
sudo ./deploy.sh

# Check status only
sudo ./deploy.sh --status

# Show help
sudo ./deploy.sh --help
```

## Multi-Subdomain Setup

Your server now supports three subdomains:

- `windows1.homeprosusa.org` → Port 3000 (bigbrains-form)
- `windows2.homeprosusa.org` → Port 3001 (bb-windows-2)  
- `windows3.homeprosusa.org` → Port 3002 (v3-windows)

Each subdomain has its own:
- Application directory
- PM2 process
- Nginx configuration
- Port assignment

## Security Considerations

1. **Firewall**: Only allow necessary ports (22, 80, 443)
2. **SSL**: Use Let's Encrypt certificates for HTTPS
3. **Updates**: Keep system and Node.js updated
4. **Monitoring**: Set up log monitoring and alerts
5. **Backups**: Regular backups of application data

## Performance Optimization

1. **Gzip compression**: Already enabled in Nginx
2. **Static file caching**: Configured for CSS, JS, images
3. **PM2 clustering**: Can be enabled for multiple processes
4. **CDN**: Consider using a CDN for static assets 