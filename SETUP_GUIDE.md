# Auth Frontend Setup Guide

This is a Next.js authentication frontend that integrates with your microservice architecture.

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Configure Environment Variables**
   
   Copy `.env.example` to `.env.local` and update the following:
   
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost  # Your API Gateway URL
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_id_here  # Your Google OAuth Client ID
   ```

3. **Setup Google OAuth (Optional)**
   
   If you want Google Sign-In functionality:
   
   a. Go to [Google Cloud Console](https://console.cloud.google.com/)
   b. Create a new project or select existing one
   c. Enable the Google+ API
   d. Create OAuth 2.0 credentials (Web application)
   e. Add these authorized origins:
      - `http://localhost:3000` (development)
      - Your production domain
   f. Copy the Client ID to `.env.local`

4. **Start the Development Server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### ✅ Authentication Pages
- **Sign Up** (`/signup`) - Create new account with local credentials
- **Sign In** (`/signin`) - Login with email/password
- **Google OAuth** - Sign in/up with Google account
- **Dashboard** (`/dashboard`) - Protected user dashboard

### ✅ Auth System
- JWT token storage in localStorage
- React Context API for auth state management
- Protected route wrapper for dashboard
- Auto-redirect based on auth status
- Persistent login across page refreshes
- Logout functionality

### ✅ Form Features
- Real-time form validation
- Error handling with user-friendly messages
- Loading states on buttons
- Password confirmation validation
- Email and password validation

## Project Structure

```
app/
├── page.tsx                 # Home/redirect page
├── layout.tsx              # Root layout with AuthProvider
├── globals.css             # Global styles
├── signup/
│   └── page.tsx           # Sign up page
├── signin/
│   └── page.tsx           # Sign in page
└── dashboard/
    └── page.tsx           # Protected dashboard page

lib/
├── auth-context.tsx       # Auth provider and hooks
└── protected-route.tsx    # Route protection component

components/
└── google-signin-button.tsx  # Google OAuth button
```

## API Integration

The frontend communicates with your auth microservice through the API Gateway.

### Available Endpoints

**Sign Up**
```
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "provider": "local"
  }
}
```

**Sign In (Local)**
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: (same as signup)
```

**Sign In (Google)**
```
POST /auth/login
Content-Type: application/json

{
  "googleToken": "google_id_token_here"
}

Response: (same as signup)
```

**Protected Route Example**
```
GET /auth/dashboard
Authorization: Bearer jwt_token_here

Response:
{
  "message": "Welcome to dashboard",
  "user": { ...user_data }
}
```

## Customization

### Change Colors
Edit `app/globals.css` to customize the color scheme:
- `--primary` - Main brand color
- `--secondary` - Secondary color
- `--accent` - Accent color
- `--destructive` - Error/danger color

### Change API URL
Update `NEXT_PUBLIC_API_URL` in `.env.local`:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Add More Auth Methods
You can extend the `AuthProvider` in `lib/auth-context.tsx` to support:
- GitHub OAuth
- Email verification
- Password reset
- Two-factor authentication

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
1. Build the app: `npm run build`
2. Set environment variables
3. Start the server: `npm run start`

## Environment Variables for Production

When deploying, set these in your hosting platform:

```
NEXT_PUBLIC_API_URL=https://your-api-gateway.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_production_google_client_id
```

## Troubleshooting

### Google Sign-In Not Working
1. Check if Google Client ID is correct in `.env.local`
2. Verify authorized origins in Google Cloud Console
3. Check browser console for errors
4. Ensure `http://localhost:3000` is in authorized origins for local dev

### API Calls Failing
1. Check if auth microservice is running
2. Verify `NEXT_PUBLIC_API_URL` is correct
3. Check CORS settings on your API Gateway
4. Look at browser Network tab to see actual requests

### Tokens Not Persisting
1. Check if localStorage is enabled in browser
2. Verify browser privacy/incognito mode
3. Check browser storage quota

### Protected Routes Not Working
1. Verify token is being stored in localStorage
2. Check if `AuthProvider` wraps the app in `layout.tsx`
3. Look at browser console for errors

## Security Notes

⚠️ **Important for Production**

Current implementation:
- ✅ JWT tokens stored in localStorage
- ✅ HTTPS recommended for production
- ⚠️ Consider moving to HTTP-only cookies for enhanced security

To improve security:
1. Enable HTTPS in production
2. Implement CSRF protection on API
3. Add rate limiting on auth endpoints
4. Implement token refresh mechanism
5. Use HTTP-only cookies instead of localStorage

## Support

For issues related to:
- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)
- **Auth Logic**: Check `lib/auth-context.tsx`
- **Microservice Integration**: Verify API Gateway is running and URLs are correct
- **Google OAuth**: [Google Cloud Console](https://console.cloud.google.com/)

## License

MIT
