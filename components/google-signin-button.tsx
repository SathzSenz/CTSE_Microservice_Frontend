'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window {
    google: any;
  }
}

export function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);
  const { googleLogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Initialize Google Sign-In
    const initializeGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          callback: handleCredentialResponse,
        });

        // Render the Google Sign-In button
        const buttonElement = document.getElementById('google-signin-button');
        if (buttonElement && !buttonElement.querySelector('div[role="button"]')) {
          window.google.accounts.id.renderButton(buttonElement, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
          });
        }
      }
    };

    // Check if Google API is already loaded
    if (window.google) {
      initializeGoogle();
    } else {
      // Load Google API script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    }
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      setLoading(true);
      console.log("[v0] Google credential response received");
      await googleLogin(response.credential);
      router.push('/dashboard');
    } catch (error: any) {
      console.error("[v0] Google login error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div 
        id="google-signin-button" 
        className="flex justify-center"
        style={{ opacity: loading ? 0.5 : 1 }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/50 rounded-lg">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
