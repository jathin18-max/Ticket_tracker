# Deployment Guide for Render

## Prerequisites
- GitHub account with your code pushed
- Render account (sign up at render.com)
- Database ready (MySQL hosted or local)

---

## BACKEND DEPLOYMENT

### Step 1: Prepare Backend for Render
1. Update `backend/.env` with production values:
```
PORT=5000
DB_HOST=your-mysql-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=ticket_tracker
NODE_ENV=production
```

2. Verify `package.json` has a start script:
```json
"scripts": {
  "start": "node server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

3. Ensure all dependencies are in `backend/package.json`

### Step 2: Create Backend Service on Render
1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository and branch (main/master)
5. Fill in the details:
   - **Name**: `ticket-tracker-backend`
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
6. Click **"Advanced"** and add Environment Variables:
   - `DB_HOST` = your MySQL host
   - `DB_USER` = your DB user
   - `DB_PASSWORD` = your DB password
   - `DB_NAME` = ticket_tracker
   - `NODE_ENV` = production
7. Click **"Create Web Service"**
8. Wait for deployment (takes 2-3 minutes)
9. Copy your backend URL (e.g., `https://ticket-tracker-backend.onrender.com`)

---

## FRONTEND DEPLOYMENT

### Step 3: Update Frontend API URL
1. Update `frontend/.env` with your backend URL:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

2. Push this change to GitHub:
```bash
git add frontend/.env
git commit -m "Update API URL for production"
git push
```

### Step 4: Create Frontend Service on Render
1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Static Site"** (for Vite frontend)
3. Connect your GitHub repository
4. Fill in the details:
   - **Name**: `ticket-tracker-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
5. Click **"Create Static Site"**
6. Wait for deployment (takes 1-2 minutes)
7. Your frontend will be live at the provided URL

---

## IMPORTANT CONFIGURATION

### Update CORS in Backend
Edit `backend/server.js` to allow your frontend URL:
```javascript
const cors = require("cors");
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
```

Add to backend environment variables on Render:
- `FRONTEND_URL` = https://your-frontend-url.onrender.com

### Database Connection
Your MySQL database must be accessible from Render servers:
- If using local MySQL: Not possible (Render can't reach local networks)
- Solution: Use managed MySQL services:
  - [PlanetScale](https://planetscale.com) - Free tier available
  - [AWS RDS](https://aws.amazon.com/rds/)
  - [Railway](https://railway.app)
  - [Vercel Postgres](https://vercel.com/postgres)

---

## DEPLOYMENT CHECKLIST

Backend:
- [ ] `backend/package.json` has "start" script
- [ ] `backend/.env` with all required variables
- [ ] GitHub repository is public or connected
- [ ] Database is accessible from internet
- [ ] CORS is configured with frontend URL

Frontend:
- [ ] `frontend/.env` points to backend URL
- [ ] `frontend/package.json` build script works locally
- [ ] Changes pushed to GitHub
- [ ] Build directory is `frontend/dist`

---

## POST-DEPLOYMENT STEPS

1. Test API endpoints from frontend
2. Check browser console for errors (F12)
3. Check Render dashboard logs if issues occur
4. Update any hardcoded URLs to use environment variables
5. Test all features (login, tickets, uploads)

---

## TROUBLESHOOTING

**Build fails:**
- Check logs on Render dashboard
- Ensure all dependencies are installed
- Verify build command is correct

**Frontend can't reach backend:**
- Confirm `VITE_API_URL` is correct
- Check CORS settings in backend
- Ensure backend service is running

**Database connection errors:**
- Verify DB host, user, password
- Ensure database is accessible from internet
- Check firewall/security group settings

**Uploads not working:**
- Check multer configuration
- Ensure `/uploads` directory exists on backend
- Note: Some hosting services have read-only filesystems

---

## COST CONSIDERATIONS
- Render Free Tier: Limited, services spin down after 15 min of inactivity
- Upgrade to Paid: $7-12/month for always-on services
- Database: Separate charges may apply
