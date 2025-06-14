# Deployment Guide for Vultr Server

## Prerequisites
- Vultr account and server instance
- Domain name (optional, can use IP address)
- SSH access to your server

## Option 1: Static File Deployment (Nginx)

### Step 1: Set up your Vultr server
1. Create a new server instance (Ubuntu 20.04 LTS recommended)
2. SSH into your server: `ssh root@your-server-ip`

### Step 2: Install Nginx
```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
sudo ufw allow 'Nginx Full'
```

### Step 3: Upload your files
```bash
# Create directory for your application
sudo mkdir -p /var/www/bigbrains-form
sudo chown -R $USER:$USER /var/www/bigbrains-form

# Upload files via SCP (from your local machine)
scp -r * root@your-server-ip:/var/www/bigbrains-form/
```

### Step 4: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/bigbrains-form
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or IP
    root /var/www/bigbrains-form;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Optional: Add gzip compression
    gzip on;
    gzip_types text/css application/javascript text/javascript;
}
```

### Step 5: Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/bigbrains-form /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Option 2: Node.js Deployment (Express)

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