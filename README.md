# Modern Auth Frontend

A production-ready authentication frontend built with Next.js 16 and Tailwind CSS, designed to integrate seamlessly with your microservice architecture.

## 🎯 Features

### Authentication
- ✅ **Local Authentication** - Email/password signup and signin
- ✅ **Google OAuth 2.0** - Seamless Google account integration
- ✅ **JWT Token Management** - Secure token storage and handling
- ✅ **Protected Routes** - Dashboard access restricted to authenticated users
- ✅ **Persistent Sessions** - Auto-login across page refreshes

### Pages
- 📝 **Sign Up** (`/signup`) - Create new account with validation
- 🔑 **Sign In** (`/signin`) - Login with email/password or Google
- 📊 **Dashboard** (`/dashboard`) - Protected user dashboard with profile info
- 🏠 **Home** (`/`) - Smart redirect based on auth status

### Developer Experience
- ⚡ **React Context API** - Lightweight auth state management
- 🔄 **Easy API Integration** - Configured for your microservice gateway
- 📚 **TypeScript** - Full type safety
- 🎨 **Tailwind CSS** - Responsive, modern design
- 📱 **Mobile-First** - Works perfectly on all devices
- 🔒 **Security** - Input validation, error handling, CORS ready

## 🚀 Quick Start

### 1. Setup Environment
```bash
# Copy environment variables
cp .env

# Edit .env.local with your values
```

### 2. Install & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` - You'll be redirected to signin automatically!

## 📁 Project Structure

```
├── app/
│   ├── page.tsx                    # Home page (auto-redirect)
│   ├── layout.tsx                  # Root layout with AuthProvider
│   ├── globals.css                 # Global styles
│   ├── signup/
│   │   └── page.tsx               # Sign up page
│   ├── signin/
│   │   └── page.tsx               # Sign in page
│   └── dashboard/
│       └── page.tsx               # Protected dashboard
│
├── lib/
│   ├── auth-context.tsx           # Auth provider & hooks
│   └── protected-route.tsx        # Route protection wrapper
│
├── components/
│   └── google-signin-button.tsx   # Google OAuth button
│
├── public/
│   ├── icon-light-32x32.png
│   ├── icon-dark-32x32.png
│   └── icon.svg
│
├── .env.local                      # Local environment config
├── SETUP_GUIDE.md                  # Detailed setup instructions
├── API_INTEGRATION.md              # API integration guide
├── package.json
└── README.md                       # This file
```

## 🔐 Authentication Flow

### Sign Up Flow
```
User fills form
     ↓
Validation check
     ↓
POST /auth/signup
     ↓
Receive JWT token
     ↓
Store in localStorage
     ↓
Redirect to /dashboard
```

### Sign In Flow
```
User enters credentials
     ↓
POST /auth/login (local or google)
     ↓
Receive JWT token
     ↓
Store in localStorage
     ↓
Redirect to /dashboard
```

### Protected Routes
```
Access /dashboard
     ↓
Check if authenticated
     ↓
Yes → Show dashboard
No  → Redirect to /signin
```

## 🔌 API Integration

The frontend communicates with the microservice architecture through the API Gateway.

### Expected Endpoints

#### POST `/auth/signup`
Creates a new user account
```json
Request: { "name": "string", "email": "string", "password": "string" }
Response: { "token": "jwt", "user": {...} }
```

#### POST `/auth/login`
Authenticates user (local or Google)
```json
Request (local): { "email": "string", "password": "string" }
Request (google): { "googleToken": "string" }
Response: { "token": "jwt", "user": {...} }
```

#### GET `/auth/dashboard`
Protected route (requires token)
```
Headers: { "Authorization": "Bearer {token}" }
Response: { "message": "string", "user": {...} }
```

See [API_INTEGRATION.md](./API_INTEGRATION.md) for complete API documentation.


```

### Add More OAuth Providers
Extend `lib/auth-context.tsx` and create similar buttons in `components/`.

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
EXPOSE 3000
```

## 🧪 Testing

### Manual Testing
1. **Sign Up**: Create new account at `/signup`
2. **Sign In**: Login with credentials at `/signin`
3. **Google Auth**: Test Google signin (if configured)
4. **Dashboard**: View protected dashboard at `/dashboard`
5. **Logout**: Logout and verify redirect to signin
6. **Persistence**: Refresh page, should stay logged in

### Testing Commands
```bash
# Development
npm run dev

# Build
npm run build

# Start production server
npm run start

# Lint
npm run lint
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Auth**: JWT + localStorage
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

## 📦 Dependencies

Core dependencies included:
- `next`: Next.js framework
- `react`: React library
- `react-dom`: React DOM
- `tailwindcss`: Utility-first CSS
- `lucide-react`: Icon library
- `react-hook-form`: Form state management
- `zod`: Schema validation

## 🔒 Security Considerations

**Current Implementation**:
- ✅ JWT token validation
- ✅ Input validation on forms
- ✅ Protected routes
- ✅ Secure error messages

