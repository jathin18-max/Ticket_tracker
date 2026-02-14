# How to Add Environment Variables in Render

## Current Error:
```
❌ MySQL connection pool failed: 
Error code: ECONNREFUSED
Database connection was refused.
```

**Cause:** No database credentials configured in Render

## Solution: Add Environment Variables

### Step 1: Go to Render Dashboard
1. Visit: **https://dashboard.render.com/**
2. Login if needed

### Step 2: Select Your Backend Service
1. Find and click: **ticket-tracker-backend-ad1o**
2. You should see your service details

### Step 3: Add Environment Variables
1. On the left sidebar, click **"Environment"**
2. You'll see a section called "Environment Variables"
3. Click **"Add Environment Variable"** button

### Step 4: Add These Variables (One by One)

For now, let's use **temporary placeholder values** to test:

| Key | Value |
|-----|-------|
| `DB_HOST` | `localhost` |
| `DB_USER` | `root` |
| `DB_PASSWORD` | `password` |
| `DB_NAME` | `ticket_tracker` |
| `DB_PORT` | `3306` |
| `DB_SSL` | `false` |
| `NODE_ENV` | `production` |

**How to add each one:**
1. Click "Add Environment Variable"
2. Enter the **Key** (e.g., `DB_HOST`)
3. Enter the **Value** (e.g., `localhost`)
4. Click outside or press Enter
5. Repeat for all variables

### Step 5: Save Changes
1. After adding all variables, click **"Save Changes"** button at the bottom
2. Render will automatically **redeploy** your backend
3. Wait 1-2 minutes for deployment to complete

### Step 6: Check Logs
1. Click **"Logs"** tab on the left sidebar
2. Watch the deployment logs
3. You should still see the error (because we used placeholder values)

---

## Next: Set Up Real Database

After you see the variables are working, you'll need to:

1. **Set up Railway MySQL** (see `RAILWAY_SETUP.md`)
2. **Replace the placeholder values** with real Railway credentials
3. **Save changes** again - Render will redeploy
4. **Check logs** - should see ✅ success!

---

## Quick Reference

**Your Backend Service:**
- URL: https://ticket-tracker-backend-ad1o.onrender.com
- Dashboard: https://dashboard.render.com/

**Navigation:**
- Dashboard → Your Service → Environment → Add Variables → Save

**After Railway Setup:**
Replace placeholder values with:
- `DB_HOST` = Railway's `MYSQLHOST`
- `DB_USER` = Railway's `MYSQLUSER`
- `DB_PASSWORD` = Railway's `MYSQLPASSWORD`
- `DB_NAME` = Railway's `MYSQLDATABASE`
- `DB_PORT` = `3306`
- `DB_SSL` = `false`

---

## Troubleshooting

**Can't find Environment tab?**
- Make sure you clicked on the backend service (not frontend)
- Look for "Environment" in the left sidebar

**Variables not saving?**
- Make sure to click "Save Changes" button at the bottom
- Wait for the page to confirm

**Still seeing errors?**
- Check you added all 7 variables
- Verify spelling is exact (case-sensitive)
- Check logs for new error messages
