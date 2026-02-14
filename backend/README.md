# Production Database Configuration - Quick Reference

## ✅ What Was Fixed

1. **Connection Pooling** - Replaced single connection with pool (10 concurrent connections)
2. **SSL/TLS Support** - Added secure connections for cloud databases
3. **Error Handling** - Comprehensive error logging and auto-reconnection
4. **Timeouts** - 60-second timeouts to prevent hanging
5. **Graceful Shutdown** - Clean pool closure on server termination

## 🚀 Quick Setup for Production

### Step 1: Set Environment Variables

In your production environment (Render, Railway, Heroku, etc.), set these:

```
DB_HOST=your-database-host.com
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=ticket_tracker
DB_PORT=3306
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

### Step 2: Run Database Schema

Execute `schema.sql` on your production database to create all tables.

### Step 3: Update CORS Origins

In `server.js`, update the `allowedOrigins` array:

```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "https://your-actual-frontend-domain.com"  // ← Add your domain
];
```

### Step 4: Deploy

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

## 🔧 Common Database Providers

### AWS RDS
```
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
```

### Azure MySQL
```
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
DB_USER=username@servername
```

### PlanetScale
```
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
```

### Railway/Render
```
DB_SSL=false
```

## 🐛 Troubleshooting

| Error | Solution |
|-------|----------|
| Connection refused | Check DB_HOST and firewall rules |
| Access denied | Verify DB_USER and DB_PASSWORD |
| SSL error | Try `DB_SSL_REJECT_UNAUTHORIZED=false` |
| Too many connections | Reduce `connectionLimit` in `db.js` |

## 📚 Full Documentation

See `PRODUCTION_SETUP.md` for complete details.
