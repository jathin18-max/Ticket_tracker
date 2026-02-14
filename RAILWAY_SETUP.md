# Railway MySQL Setup Guide

## Step 1: Create Railway Account & MySQL Database

1. **Go to Railway:** https://railway.app/
2. **Sign up/Login** with GitHub
3. **Create New Project:**
   - Click "New Project"
   - Select "Provision MySQL"
   - Railway will create a MySQL database for you

## Step 2: Get Database Credentials

After MySQL is provisioned:

1. Click on your **MySQL service**
2. Go to the **"Variables"** tab
3. You'll see these variables (copy them):
   - `MYSQLHOST` - Your database host
   - `MYSQLUSER` - Your database user (usually "root")
   - `MYSQLPASSWORD` - Your database password
   - `MYSQLDATABASE` - Your database name (usually "railway")
   - `MYSQLPORT` - Port (usually 3306)

## Step 3: Run Database Schema on Railway

You need to create the tables in your Railway MySQL database.

### Option A: Using MySQL Workbench or TablePlus

1. Download **MySQL Workbench** or **TablePlus**
2. Create a new connection with Railway credentials:
   - Host: `MYSQLHOST` value
   - Port: `MYSQLPORT` value (usually 3306)
   - Username: `MYSQLUSER` value
   - Password: `MYSQLPASSWORD` value
   - Database: `MYSQLDATABASE` value
3. Connect and run the SQL from `backend/schema.sql`

### Option B: Using Railway CLI (Recommended)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Connect to MySQL
railway connect mysql

# Once connected, paste the contents of backend/schema.sql
# Or run: source /path/to/backend/schema.sql
```

### Option C: Using Command Line MySQL Client

```bash
mysql -h MYSQLHOST -u MYSQLUSER -p MYSQLDATABASE < backend/schema.sql
# Enter password when prompted
```

## Step 4: Configure Render Backend

Now add these environment variables to your **Render backend service**:

1. Go to your Render dashboard: https://dashboard.render.com/
2. Click on your **backend service** (ticket-tracker-backend-ad1o)
3. Go to **"Environment"** tab
4. Add these variables:

```
DB_HOST=<MYSQLHOST from Railway>
DB_USER=<MYSQLUSER from Railway>
DB_PASSWORD=<MYSQLPASSWORD from Railway>
DB_NAME=<MYSQLDATABASE from Railway>
DB_PORT=3306
DB_SSL=false
NODE_ENV=production
```

> **Important:** For Railway, set `DB_SSL=false` (Railway handles SSL differently)

5. Click **"Save Changes"**
6. Render will automatically redeploy your backend

## Step 5: Update Frontend Environment Variable

1. Go to your Render dashboard
2. Click on your **frontend service**
3. Go to **"Environment"** tab
4. Add/Update:

```
VITE_API_URL=https://ticket-tracker-backend-ad1o.onrender.com
```

5. Click **"Save Changes"** and redeploy

## Step 6: Update CORS in Backend

Make sure your `backend/server.js` has the correct frontend URL:

```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "https://ticket-tracker-rebl.onrender.com",  // Your Render frontend URL
  "https://your-actual-frontend-url.onrender.com"  // Update this
];
```

Commit and push this change if needed.

## Step 7: Verify Everything Works

1. Check Render backend logs - should see:
   ```
   ✅ MySQL connection pool established successfully
   ✅ Server running on port 5000
   ```

2. Visit your frontend URL
3. Try logging in with a user from your local database
4. If no users exist, register a new one!

## Troubleshooting

### Connection Refused
- ✅ Check Railway database is running
- ✅ Verify all credentials are correct
- ✅ Make sure `DB_SSL=false` for Railway

### Tables Don't Exist
- ✅ Run `backend/schema.sql` on Railway database
- ✅ Verify tables exist using Railway CLI or MySQL client

### CORS Errors
- ✅ Update `allowedOrigins` in `server.js`
- ✅ Redeploy backend after changes

## Railway Free Tier Limits

- **500 hours/month** of usage
- **5GB storage**
- **100GB bandwidth**

Perfect for development and small projects!

## Quick Reference

**Railway Dashboard:** https://railway.app/dashboard
**Render Dashboard:** https://dashboard.render.com/

**Your Services:**
- Backend: https://ticket-tracker-backend-ad1o.onrender.com
- Frontend: https://ticket-tracker-rebl.onrender.com (update with actual URL)

---

Need help? Check the logs:
- **Railway:** Click on MySQL service → "Logs" tab
- **Render:** Click on backend service → "Logs" tab
