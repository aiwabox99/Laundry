# Cleanic App Deployment Guide

## Overview
This guide covers deploying the Cleanic App backend to production environments. The backend is built with Node.js/Express and requires MongoDB, with optional SMS and email services.

## Prerequisites

### System Requirements
- Node.js 16+ 
- MongoDB 4.4+
- SSL certificate for HTTPS
- Domain name
- Minimum 1GB RAM, 1 CPU core
- 20GB+ storage

### External Services (Optional)
- **Twilio**: For SMS notifications
- **Email Provider**: SMTP service (Gmail, SendGrid, etc.)
- **Cloudinary**: For image uploads
- **PayFast**: For payment processing (South African payments)

## Environment Setup

### 1. Server Preparation

#### Ubuntu/Debian
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### 2. MongoDB Configuration

```bash
# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and user
mongo
> use cleanic_db
> db.createUser({
    user: "cleanic_user",
    pwd: "secure_password_here",
    roles: [{ role: "readWrite", db: "cleanic_db" }]
  })
> exit
```

### 3. Application Deployment

```bash
# Create application directory
sudo mkdir -p /var/www/cleanic
sudo chown -R $USER:$USER /var/www/cleanic

# Clone repository
cd /var/www/cleanic
git clone <your-repo-url> .

# Install dependencies
cd backend
npm install --production

# Copy environment file
cp .env.example .env
```

### 4. Environment Configuration

Edit `/var/www/cleanic/backend/.env`:

```env
# Production Configuration
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://cleanic_user:secure_password_here@localhost:27017/cleanic_db

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_here_minimum_32_chars
JWT_EXPIRE=7d

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# App Configuration
APP_NAME=Cleanic
APP_URL=https://yourdomain.com
API_BASE_URL=https://api.yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional Services
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

PAYFAST_MERCHANT_ID=your_payfast_merchant_id
PAYFAST_MERCHANT_KEY=your_payfast_merchant_key
PAYFAST_PASSPHRASE=your_payfast_passphrase
```

### 5. PM2 Configuration

Create `/var/www/cleanic/backend/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'cleanic-api',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

### 6. Start Application

```bash
# Create logs directory
mkdir -p /var/www/cleanic/backend/logs

# Start application with PM2
cd /var/www/cleanic/backend
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

### 7. Nginx Configuration

Create `/etc/nginx/sites-available/cleanic`:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/cleanic /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. SSL Certificate

```bash
# Get SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Test renewal
sudo certbot renew --dry-run
```

## Database Management

### Initial Setup
```bash
cd /var/www/cleanic/backend
npm run seed
```

### Backup
```bash
# Create backup script
cat > /var/www/cleanic/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/cleanic"
mkdir -p $BACKUP_DIR

# MongoDB backup
mongodump --db cleanic_db --out $BACKUP_DIR/mongodb_$DATE

# Compress backup
tar -czf $BACKUP_DIR/cleanic_backup_$DATE.tar.gz $BACKUP_DIR/mongodb_$DATE
rm -rf $BACKUP_DIR/mongodb_$DATE

# Keep only last 7 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x /var/www/cleanic/backup.sh

# Add to crontab (daily backup at 2 AM)
echo "0 2 * * * /var/www/cleanic/backup.sh" | sudo crontab -
```

## Monitoring

### 1. PM2 Monitoring
```bash
# View application status
pm2 status

# View logs
pm2 logs cleanic-api

# Monitor resources
pm2 monit
```

### 2. System Monitoring
```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Monitor application
htop
```

### 3. Log Management
```bash
# Rotate logs
sudo apt install -y logrotate

# Create logrotate config
cat > /etc/logrotate.d/cleanic << 'EOF'
/var/www/cleanic/backend/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 www-data www-data
    postrotate
        pm2 reload cleanic-api
    endscript
}
EOF
```

## Security

### 1. Firewall Configuration
```bash
# Install UFW
sudo apt install -y ufw

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2. Application Security
- Keep dependencies updated: `npm audit fix`
- Use strong JWT secrets (minimum 32 characters)
- Enable rate limiting in production
- Use HTTPS only
- Implement proper input validation
- Regular security audits

### 3. Database Security
```bash
# Secure MongoDB installation
sudo mongo --eval "db.adminCommand('listCollections')"
```

## Performance Optimization

### 1. Node.js Optimization
```javascript
// In server.js, add compression
const compression = require('compression');
app.use(compression());

// Optimize MongoDB queries with indexes
// Already implemented in models
```

### 2. Nginx Optimization
Add to nginx config:
```nginx
# Gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

# Caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Database Optimization
```javascript
// Connection pooling (already configured)
// Indexes (already implemented in models)
// Regular maintenance
```

## Scaling

### 1. Horizontal Scaling
```bash
# Use PM2 cluster mode (already configured)
pm2 scale cleanic-api +2  # Add 2 more instances
```

### 2. Load Balancing
```nginx
# Nginx upstream configuration
upstream cleanic_backend {
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
}

server {
    location / {
        proxy_pass http://cleanic_backend;
    }
}
```

### 3. Database Scaling
- MongoDB replica sets
- Read replicas for analytics
- Sharding for large datasets

## Troubleshooting

### Common Issues

1. **Application won't start**
   ```bash
   pm2 logs cleanic-api
   # Check environment variables
   # Verify MongoDB connection
   ```

2. **Database connection errors**
   ```bash
   sudo systemctl status mongod
   # Check MongoDB logs
   sudo tail -f /var/log/mongodb/mongod.log
   ```

3. **SSL certificate issues**
   ```bash
   sudo certbot certificates
   sudo certbot renew
   ```

4. **High memory usage**
   ```bash
   pm2 monit
   # Restart application
   pm2 restart cleanic-api
   ```

### Health Checks
```bash
# API health check
curl https://api.yourdomain.com/health

# Database health check
mongo --eval "db.runCommand('ping')"
```

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor logs daily
- Check SSL certificate expiry
- Database backups verification
- Security updates

### Update Procedure
```bash
# Backup before updates
/var/www/cleanic/backup.sh

# Update application
cd /var/www/cleanic
git pull origin main
cd backend
npm install --production

# Restart application
pm2 restart cleanic-api

# Verify deployment
curl https://api.yourdomain.com/health
```

## Support

For deployment issues:
1. Check application logs: `pm2 logs cleanic-api`
2. Check system logs: `sudo journalctl -u nginx`
3. Verify configuration files
4. Contact development team

## Conclusion

This deployment guide provides a comprehensive setup for production deployment of the Cleanic App backend. Follow security best practices and monitor the application regularly for optimal performance.