# Frontend Production Configuration

## Environment Variables

Create a `.env` file in the `frontend` directory:

### Development
```env
VITE_API_URL=http://localhost:5000
```

### Production
```env
VITE_API_URL=https://your-backend-domain.com
```

## Build for Production

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Deployment

### Deploy to Vercel/Netlify

1. **Connect your repository**
2. **Set environment variable:**
   - `VITE_API_URL` = `https://your-backend-domain.com`
3. **Build settings:**
   - Build command: `npm run build`
   - Output directory: `dist`

### Deploy to Render

1. **Create new Static Site**
2. **Build command:** `npm run build`
3. **Publish directory:** `dist`
4. **Environment variables:**
   - `VITE_API_URL` = `https://your-backend-domain.com`

## Important Notes

⚠️ **After deploying frontend, update backend CORS settings:**

In `backend/server.js`, update the `allowedOrigins` array:

```javascript
const allowedOrigins = [
  "http://localhost:5173",                    // local development
  "https://your-frontend-domain.com"          // ← Add your production domain
];
```

Then redeploy your backend.

## Troubleshooting

### CORS Errors
- Ensure your frontend domain is in the `allowedOrigins` array in `backend/server.js`
- Redeploy backend after updating CORS settings

### API Connection Failed
- Verify `VITE_API_URL` is set correctly
- Check if backend is running and accessible
- Verify backend allows your frontend domain in CORS

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist`
- Check for console errors in browser
