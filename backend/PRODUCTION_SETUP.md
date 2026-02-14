# Production Database Setup Guide

## Overview
This guide explains how to configure your Ticket Tracker application for production deployment with a proper database connection.

## Database Configuration Changes

### What Was Fixed
- ✅ **Connection Pooling**: Replaced single connection with connection pool for better reliability
- ✅ **SSL/TLS Support**: Added SSL configuration for secure production databases
- ✅ **Error Handling**: Comprehensive error logging and automatic reconnection
- ✅ **Timeouts**: Proper timeout settings to prevent hanging connections
- ✅ **Graceful Shutdown**: Clean connection pool closure on server shutdown

## Environment Variables

### Required Variables
Create a `.env` file in the `backend` directory with these variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
DB_HOST=your-production-db-host.com
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_NAME=ticket_tracker
DB_PORT=3306

# SSL Configuration (for production databases like AWS RDS, Azure, etc.)
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
```

### Common Production Database Providers

#### 1. **AWS RDS MySQL**
```env
DB_HOST=your-instance.region.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=your-password
DB_NAME=ticket_tracker
DB_PORT=3306
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
```

#### 2. **Azure Database for MySQL**
```env
DB_HOST=your-server.mysql.database.azure.com
DB_USER=your-username@your-server
DB_PASSWORD=your-password
DB_NAME=ticket_tracker
DB_PORT=3306
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
```

#### 3. **Google Cloud SQL**
```env
DB_HOST=your-instance-ip
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=ticket_tracker
DB_PORT=3306
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
```

#### 4. **PlanetScale**
```env
DB_HOST=your-region.connect.psdb.cloud
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=ticket_tracker
DB_PORT=3306
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
```

#### 5. **Railway / Render MySQL**
```env
DB_HOST=containers-us-west-xxx.railway.app
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=railway
DB_PORT=3306
DB_SSL=false
```

## Database Schema Setup

Make sure your production database has the required tables. Run these SQL commands:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  client VARCHAR(255) NOT NULL,
  points INT NOT NULL,
  problem TEXT,
  priority VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create complete table
CREATE TABLE IF NOT EXISTS complete (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  client VARCHAR(255) NOT NULL,
  points INT NOT NULL,
  problem TEXT,
  solution TEXT,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create points table
CREATE TABLE IF NOT EXISTS points (
  id INT AUTO_INCREMENT PRIMARY KEY,
  point INT DEFAULT 0
);

-- Initialize points if empty
INSERT INTO points (point) 
SELECT 0 
WHERE NOT EXISTS (SELECT 1 FROM points);
```

## Deployment Steps

### 1. **Local Testing**
```bash
# Install dependencies
npm install

# Set up your .env file
cp .env.example .env
# Edit .env with your database credentials

# Run in development mode
npm run server

# Run in production mode
npm start
```

### 2. **Deploy to Render/Railway/Heroku**

#### Environment Variables to Set:
- `DB_HOST` - Your database host
- `DB_USER` - Your database username
- `DB_PASSWORD` - Your database password
- `DB_NAME` - Your database name
- `DB_PORT` - Usually 3306
- `DB_SSL` - Set to `true` for most cloud databases
- `DB_SSL_REJECT_UNAUTHORIZED` - Set to `true` for strict SSL
- `PORT` - Will be set automatically by platform
- `NODE_ENV` - Set to `production`
- `FRONTEND_URL` - Your frontend domain

#### Build Command:
```bash
npm install
```

#### Start Command:
```bash
npm start
```

### 3. **Frontend Configuration**

Update your frontend `.env` file:

```env
VITE_API_URL=https://your-backend-domain.com
```

Make sure to update the `allowedOrigins` array in `server.js`:

```javascript
const allowedOrigins = [
  "http://localhost:5173",                    // local development
  "https://your-frontend-domain.com"          // production frontend
];
```

## Troubleshooting

### Connection Refused
- ✅ Check if database host is accessible
- ✅ Verify firewall rules allow connections
- ✅ Confirm database is running

### Access Denied
- ✅ Verify username and password
- ✅ Check if user has proper permissions
- ✅ Ensure user can connect from your server's IP

### SSL Errors
- ✅ Set `DB_SSL=true` for cloud databases
- ✅ Try `DB_SSL_REJECT_UNAUTHORIZED=false` if using self-signed certificates
- ✅ Check if your database provider requires SSL

### Connection Pool Errors
- ✅ Check `connectionLimit` in `db.js` (default: 10)
- ✅ Verify your database plan supports enough connections
- ✅ Monitor active connections

### Timeout Errors
- ✅ Increase timeout values in `db.js` if needed
- ✅ Check network latency to database
- ✅ Verify database performance

## Monitoring

Check your logs for these messages:

- ✅ `MySQL connection pool established successfully` - Good!
- ❌ `MySQL connection pool failed` - Check credentials and host
- ❌ `Database connection was refused` - Check firewall/network
- ❌ `Database access denied` - Check username/password

## Security Best Practices

1. ✅ Never commit `.env` file to git
2. ✅ Use strong database passwords
3. ✅ Enable SSL for production databases
4. ✅ Restrict database access to your server's IP
5. ✅ Use environment variables for all sensitive data
6. ✅ Keep dependencies updated
7. ✅ Use connection pooling (already implemented)

## Performance Tips

1. ✅ Connection pooling is enabled (10 connections by default)
2. ✅ Adjust `connectionLimit` in `db.js` based on your needs
3. ✅ Monitor database query performance
4. ✅ Add indexes to frequently queried columns
5. ✅ Use prepared statements (already implemented with `?` placeholders)

## Need Help?

Common issues and solutions:
- **"Too many connections"**: Reduce `connectionLimit` in `db.js`
- **Slow queries**: Add database indexes
- **Connection drops**: Check `enableKeepAlive` is true (already set)
- **CORS errors**: Update `allowedOrigins` in `server.js`
