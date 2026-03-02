# API Integration Guide

This document explains how the frontend integrates with your microservice architecture.

## Architecture Overview

```
┌─────────────────┐
│  Next.js App    │
│  (This Project) │
└────────┬────────┘
         │ HTTP Requests
         ↓
┌─────────────────────────┐
│   API Gateway (nginx)   │
│   Port: 80              │
└────────┬────────────────┘
         │ Routes
    ┌────┴─────────┐
    ↓              ↓
┌────────────┐  ┌─────────────────┐
│Auth Service│  │ Other Services  │
│Port: 4000  │  │                 │
└────────────┘  └─────────────────┘
```

## Backend Services Expected

### Auth Microservice (Port 4000)

Your auth microservice should handle:

#### 1. Sign Up Endpoint
```
POST /auth/signup
Content-Type: application/json

Request Body:
{
  "name": "string",           // Full name
  "email": "string",          // Email address (must be unique)
  "password": "string"        // At least 6 characters
}

Response (200 OK):
{
  "token": "string",          // JWT token
  "user": {
    "_id": "string",          // MongoDB ObjectId
    "name": "string",
    "email": "string",
    "role": "user|admin",     // Default: "user"
    "provider": "local",      // "local" or "google"
    "createdAt": "ISO date",
    "updatedAt": "ISO date"
  }
}

Error Response (400/409):
{
  "message": "string"         // Error message
}
```

#### 2. Sign In Endpoint (Local)
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "string",
  "password": "string"
}

Response (200 OK):
{
  "token": "string",
  "user": { ...same as signup }
}

Error Response (401/404):
{
  "message": "Invalid credentials"
}
```

#### 3. Sign In Endpoint (Google OAuth)
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "googleToken": "string"     // Google ID token from frontend
}

Response (200 OK):
{
  "token": "string",
  "user": {
    ...user_data,
    "provider": "google"
  }
}

Error Response:
{
  "message": "Google authentication failed"
}
```

#### 4. Dashboard/Profile Endpoint (Protected)
```
GET /auth/dashboard
Headers:
{
  "Authorization": "Bearer jwt_token_here"
}

Response (200 OK):
{
  "message": "Welcome to dashboard",
  "user": { ...user_data }
}

Error Response (401):
{
  "message": "Unauthorized"
}
```

## Frontend Implementation Details

### Auth Context (`lib/auth-context.tsx`)

The auth context provides:

```typescript
{
  user: User | null,              // Current user data
  token: string | null,           // JWT token
  loading: boolean,               // Loading state
  isAuthenticated: boolean,       // Auth status
  signup: (name, email, password) => Promise<void>,
  login: (email, password) => Promise<void>,
  googleLogin: (googleToken) => Promise<void>,
  logout: () => void
}
```

### Usage in Components

```tsx
import { useAuth } from '@/lib/auth-context';

function MyComponent() {
  const { user, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <p>Please sign in</p>;
  }
  
  return (
    <>
      <p>Hello, {user?.name}!</p>
      <button onClick={logout}>Sign Out</button>
    </>
  );
}
```

## API Gateway Configuration

Your nginx API Gateway should forward requests like this:

```nginx
upstream auth_service {
    server auth:4000;
}

server {
    listen 80;

    location /auth/ {
        proxy_pass http://auth_service;
        proxy_http_version 1.1;
        
        # Preserve headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Important for websockets (optional)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Environment Configuration

Frontend expects these environment variables:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost      # API Gateway URL
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_id      # Google OAuth Client ID
```

**Note**: `NEXT_PUBLIC_*` variables are exposed to the browser.

## Token Management

### Storage
- **Where**: Browser's localStorage
- **Key**: `authToken`
- **Format**: JWT token string

### User Data
- **Where**: Browser's localStorage
- **Key**: `user`
- **Format**: JSON stringified user object

### Persistence
Tokens persist across page refreshes via `useEffect` in `AuthProvider`.

### Cleanup
On logout, both localStorage keys are removed.

## Error Handling

Frontend handles these HTTP status codes:

| Status | Action |
|--------|--------|
| 200 | Success - Store token & redirect |
| 400 | Bad request - Show validation error |
| 401 | Unauthorized - Redirect to signin |
| 409 | Conflict - Email exists, show error |
| 500 | Server error - Show generic error |

## CORS Configuration

Frontend makes requests from `http://localhost:3000` in development.

Your API Gateway should handle CORS if needed:

```nginx
add_header 'Access-Control-Allow-Origin' 'http://localhost:3000';
add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';
```

## Testing the Integration

### 1. Test Sign Up
```bash
curl -X POST http://localhost/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Test Sign In
```bash
curl -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Test Protected Route
```bash
curl -X GET http://localhost/auth/dashboard \
  -H "Authorization: Bearer your_jwt_token_here"
```

## Deployment Checklist

- [ ] Update `NEXT_PUBLIC_API_URL` to production API Gateway URL
- [ ] Configure Google OAuth for production domain
- [ ] Enable HTTPS on both frontend and backend
- [ ] Set up CORS properly for production domain
- [ ] Implement token refresh mechanism (optional)
- [ ] Set up error logging/monitoring
- [ ] Test all auth flows in staging environment
- [ ] Update authorized redirect URIs in Google Console

## Common Issues

### "Failed to fetch"
- Check if API Gateway is running
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS headers from API Gateway

### "Invalid token"
- Token might have expired
- Check if token is being stored correctly
- Verify token format is valid JWT

### Google Sign-In not appearing
- Verify Google Client ID is set
- Check browser console for script loading errors
- Ensure authorized origins include your domain

### Infinite redirect loop
- Check `AuthProvider` is wrapping the app
- Verify protected routes logic
- Clear localStorage and try again

## Next Steps

1. **Verify Auth Microservice** is running and accessible
2. **Test Endpoints** using curl or Postman
3. **Configure Environment Variables** in `.env.local`
4. **Run Frontend** with `npm run dev`
5. **Test Auth Flows** - signup, signin, logout
6. **Deploy** when ready

## Reference Documentation

- [Auth Context Code](./lib/auth-context.tsx)
- [Protected Route Wrapper](./lib/protected-route.tsx)
- [Google Sign-In Component](./components/google-signin-button.tsx)
- [Setup Guide](./SETUP_GUIDE.md)
