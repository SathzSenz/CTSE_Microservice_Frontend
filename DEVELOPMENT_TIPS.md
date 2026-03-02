# Development Tips & Best Practices

This guide contains helpful tips for developing and extending the authentication frontend.

## 🎯 Common Development Tasks

### Adding a New Protected Page

1. Create the page file:
```tsx
// app/mypage/page.tsx
'use client';

import { ProtectedRoute } from '@/lib/protected-route';
import { useAuth } from '@/lib/auth-context';

function MyPageContent() {
  const { user } = useAuth();
  
  return (
    <main>
      <h1>Welcome, {user?.name}</h1>
    </main>
  );
}

export default function MyPage() {
  return (
    <ProtectedRoute>
      <MyPageContent />
    </ProtectedRoute>
  );
}
```

2. Add navigation link to the page (e.g., in dashboard)

### Adding More OAuth Providers

1. Create a new button component:
```tsx
// components/github-signin-button.tsx
'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export function GitHubSignInButton() {
  const { login } = useAuth();
  const router = useRouter();

  const handleGitHubLogin = async () => {
    // Implement GitHub OAuth flow
    // 1. Redirect to GitHub authorization
    // 2. Handle callback
    // 3. Get token
    // 4. Call login() with token
  };

  return (
    <button onClick={handleGitHubLogin}>
      Sign in with GitHub
    </button>
  );
}
```

2. Add to signin/signup pages

### Extending User Profile

Update the `User` interface in `lib/auth-context.tsx`:

```tsx
export interface User {
  _id?: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
  provider?: 'local' | 'google';
  avatar?: string;           // Add new fields
  bio?: string;              // as needed
  phone?: string;
}
```

### Adding Form Validation

The app uses React Hook Form. To add custom validation:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
});

type FormData = z.infer<typeof schema>;

export function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
}
```

## 🐛 Debugging Tips

### View Auth State
Add this to any component:
```tsx
import { useAuth } from '@/lib/auth-context';

function DebugComponent() {
  const auth = useAuth();
  
  console.log('[Auth State]', {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
  });
  
  return null;
}
```

### Check localStorage
In browser console:
```javascript
// View token
console.log(localStorage.getItem('authToken'));

// View user
console.log(JSON.parse(localStorage.getItem('user')));

// Clear all
localStorage.clear();
```

### Monitor API Calls
1. Open DevTools (F12)
2. Go to Network tab
3. Sign in/up
4. See all requests/responses
5. Check headers and body

### Check Google API Loading
```javascript
// In browser console
console.log(window.google);  // Should not be undefined
```

## 📱 Testing on Mobile

### Local Mobile Testing
```bash
# Find your computer's IP
ipconfig getifaddr en0  # macOS
hostname -I             # Linux

# Access from mobile
http://YOUR_IP:3000
```

### Responsive Testing
1. DevTools > Toggle Device Toolbar (Ctrl+Shift+M)
2. Test all screen sizes
3. Test touch interactions
4. Check form inputs on mobile

## 🚀 Performance Optimization

### Code Splitting
Automatically done by Next.js, but you can optimize:

```tsx
// Load component only when needed
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./heavy'), {
  loading: () => <div>Loading...</div>,
});
```

### Image Optimization
Use Next.js Image component:
```tsx
import Image from 'next/image';

<Image
  src="/profile.jpg"
  alt="Profile"
  width={200}
  height={200}
/>
```

### Memoization
Prevent unnecessary re-renders:
```tsx
import { memo } from 'react';

const UserCard = memo(function UserCard({ user }) {
  return <div>{user.name}</div>;
});
```

## 🎨 Styling Tips

### Custom Colors
Add to `app/globals.css`:
```css
:root {
  --mycolor: oklch(0.5 0.1 200);
}

.my-element {
  @apply bg-[color:var(--mycolor)];
}
```

### Responsive Classes
```tsx
<div className="text-sm md:text-base lg:text-lg">
  Text size changes on different screens
</div>
```

### Dark Mode
Already built-in! Use `dark:` prefix:
```tsx
<div className="bg-white dark:bg-black">
  Changes in dark mode
</div>
```

## 📦 Adding Dependencies

### Install Package
```bash
npm install package-name
# or
pnpm add package-name
```

### Use in Code
```tsx
import { Component } from 'package-name';

export function MyComponent() {
  return <Component />;
}
```

### Remove Unused Package
```bash
npm uninstall package-name
```

## 🔄 State Management

### Using Auth Context
```tsx
import { useAuth } from '@/lib/auth-context';

function MyComponent() {
  const { user, token, isAuthenticated, logout } = useAuth();
  
  return (
    <>
      {isAuthenticated ? (
        <button onClick={logout}>Logout {user?.name}</button>
      ) : (
        <p>Not logged in</p>
      )}
    </>
  );
}
```

### Lifting State Up
If you need shared state beyond auth:

```tsx
// Create a new context
import { createContext, useContext, useState } from 'react';

const MyContext = createContext();

export function MyProvider({ children }) {
  const [state, setState] = useState(null);
  
  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
}

export function useMyState() {
  return useContext(MyContext);
}
```

## 🧪 Testing Checklist

### Sign Up
- [ ] Valid email format required
- [ ] Password min 6 characters
- [ ] Passwords must match
- [ ] Existing email shows error
- [ ] Success redirects to dashboard
- [ ] User data is saved

### Sign In
- [ ] Invalid credentials show error
- [ ] Success redirects to dashboard
- [ ] Remember login on refresh
- [ ] Logout clears session

### Google Auth
- [ ] Button renders correctly
- [ ] Clicking opens Google consent
- [ ] Successful auth redirects
- [ ] User created if new

### Dashboard
- [ ] Only accessible when logged in
- [ ] Shows user information
- [ ] Logout button works
- [ ] Logout redirects to signin

### Navigation
- [ ] Home redirects to dashboard if logged in
- [ ] Home redirects to signin if not
- [ ] Signin/signup links work
- [ ] Back buttons work

## 📋 Deployment Checklist

Before deploying:

- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables set in hosting
- [ ] Google OAuth configured for production domain
- [ ] API Gateway URL updated
- [ ] Build successful: `npm run build`
- [ ] Production preview tested locally: `npm run start`
- [ ] HTTPS enabled
- [ ] Security headers set up
- [ ] Error monitoring configured
- [ ] Analytics integrated

## 🔐 Security Checklist

- [ ] Never commit `.env.local`
- [ ] HTTPS enabled in production
- [ ] CORS properly configured
- [ ] Input validation on all forms
- [ ] No sensitive data in localStorage (currently using JWT which is fine)
- [ ] Rate limiting on API
- [ ] Token expiration implemented
- [ ] Secure cookies if moving to HTTP-only
- [ ] CSP headers configured
- [ ] XSS protection enabled

## 🆘 Quick Fixes

### Clear Cache
```bash
# Remove .next folder
rm -rf .next

# Restart dev server
npm run dev
```

### Reset Auth
```javascript
// In browser console
localStorage.clear();
location.reload();
```

### Fix Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Check TypeScript Errors
```bash
npx tsc --noEmit
```

## 📚 Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 💡 Pro Tips

1. **Use `console.log("[v0]", ...)` for debugging** - Makes logs easy to find
2. **Keep components small and focused** - Easier to test and maintain
3. **Use TypeScript** - Catch errors early
4. **Test on real devices** - Emulation isn't always accurate
5. **Monitor performance** - Use DevTools Lighthouse
6. **Keep dependencies updated** - `npm outdated` to check
7. **Use git branches** - Keep features separate
8. **Write comments** - Help future you and teammates

## 🎓 Learning Path

If you're new to Next.js/React:

1. Start with [React Fundamentals](https://react.dev/learn)
2. Learn [Next.js Basics](https://nextjs.org/learn)
3. Explore [Tailwind CSS](https://tailwindcss.com/docs)
4. Practice with components
5. Study the code in this project
6. Extend with new features
7. Deploy to Vercel

## 🤔 Common Questions

**Q: Can I use Redux instead of Context?**
A: Yes! Replace auth context with Redux store in `lib/` and update imports.

**Q: How to add email verification?**
A: Add verification endpoint to auth service, store verification status in user, show verification page.

**Q: How to implement password reset?**
A: Add reset endpoint, send email with token, create reset form page, validate token.

**Q: Can I host on AWS/DigitalOcean?**
A: Yes! Follow their Next.js deployment guides. Main change: update `NEXT_PUBLIC_API_URL`.

**Q: How to add rate limiting?**
A: Implement on backend API. Frontend can show friendly errors if rate limited.

**Q: How to handle token expiration?**
A: Add refresh token endpoint, implement in auth context useEffect.

Good luck with your development! 🚀
