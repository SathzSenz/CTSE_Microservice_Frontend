'use client';

import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/lib/protected-route';
import { useRouter } from 'next/navigation';
import { LogOut, User, Mail, Shield, Calendar, Settings } from 'lucide-react';

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                {user?.name ? getInitials(user.name) : 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
              <p className="text-xs text-muted-foreground">Welcome back!</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome, {user?.name}!
          </h2>
          <p className="text-muted-foreground">
            You're successfully logged in to your account. Manage your profile and preferences below.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <User className="w-6 h-6 text-primary" />
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {user?.role || 'User'}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Profile</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your account information is secure and up to date.
            </p>
            <button className="text-sm font-medium text-primary hover:underline">
              Edit Profile →
            </button>
          </div>

          {/* Email Card */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10">
                <Mail className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-700 dark:text-green-400">
                Verified
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Email</h3>
            <p className="text-sm text-muted-foreground break-all mb-4">
              {user?.email}
            </p>
            <button className="text-sm font-medium text-primary hover:underline">
              Change Email →
            </button>
          </div>

          {/* Security Card */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-700 dark:text-green-400">
                Secure
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Security</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your password and authentication settings.
            </p>
            <button className="text-sm font-medium text-primary hover:underline">
              Security Settings →
            </button>
          </div>
        </div>

        {/* User Details Section */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Account Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Full Name
              </label>
              <p className="text-lg font-medium text-foreground">{user?.name}</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Email Address
              </label>
              <p className="text-lg font-medium text-foreground">{user?.email}</p>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Account Type
              </label>
              <p className="text-lg font-medium text-foreground capitalize">
                {user?.role || 'User'}
              </p>
            </div>

            {/* Provider */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Authentication Provider
              </label>
              <p className="text-lg font-medium text-foreground capitalize">
                {user?.provider || 'Local'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-border">
            <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
              Update Profile
            </button>
            <button className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors font-medium">
              Download Data
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 px-4 py-2 border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/10 transition-colors font-medium"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
