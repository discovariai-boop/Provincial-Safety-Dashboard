# RBAC System - Deployment & Setup Guide

## Overview

This guide covers the complete setup and deployment of the Role-Based Access Control (RBAC) system for the LPISTH Provincial Safety Dashboard.

## Files Created

### Core RBAC System
- **`src/lib/rbac.ts`** - Role definitions, permissions matrix, utilities
- **`src/lib/firebase.ts`** - Firebase initialization and configuration
- **`src/hooks/useAuth.ts`** - Authentication context and provider
- **`src/hooks/useRole.ts`** - Role information hook

### Access Control Components
- **`src/components/auth/RoleGuard.tsx`** - Role-based rendering guards
- **`src/components/auth/Permission.tsx`** - Permission-based component wrappers
- **`src/components/auth/RbacExamples.tsx`** - Integration examples

### Backend & Security
- **`firestore.rules`** - Firestore security rules
- **`functions/index.ts`** - Firebase Cloud Functions for role management
- **`src/lib/audit.ts`** - Audit logging utilities

### Documentation
- **`RBAC_INTEGRATION_GUIDE.md`** - Developer integration guide
- **`RBAC_DEPLOYMENT_GUIDE.md`** - This file

---

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable Authentication, Firestore, and Storage

### 1.2 Enable Authentication Methods
In Firebase Console → Authentication → Sign-in method:
- Enable **Email/Password** for staff login
- (Optional) Enable **Google** for faster onboarding
- (Optional) Enable **Phone** for emergency override verification

### 1.3 Enable Firestore Database
1. Go to Firestore Database
2. Create database in **production mode** (security rules will be deployed)
3. Set location to **Africa (South Africa)** for compliance

---

## Step 2: Environment Configuration

### 2.1 Create `.env.local` file

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional: Emulator configuration (for development)
NEXT_PUBLIC_FIREBASE_EMULATOR_HOST=localhost:9099
NODE_ENV=development

# Service account for backend operations
FIREBASE_SERVICE_ACCOUNT_KEY=path/to/serviceAccountKey.json
```

### 2.2 Get Firebase Credentials
1. Project Settings → Service Accounts → Generate new private key
2. Save as `serviceAccountKey.json` (add to `.gitignore`)
3. Copy Web SDK credentials to `.env.local`

---

## Step 3: Deploy Firebase Security Rules

### 3.1 Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 3.2 Initialize Firebase Project
```bash
firebase init
# Select: Firestore, Functions, Storage
# Existing project: Select your Firebase project
```

### 3.3 Deploy Security Rules
```bash
# Copy firestore.rules to firebase project directory
cp firestore.rules ./firestore.rules

# Deploy rules
firebase deploy --only firestore:rules
```

**Note:** Always test rules thoroughly before deploying to production!

---

## Step 4: Deploy Firebase Cloud Functions

### 4.1 Install Function Dependencies
```bash
cd functions
npm install
npm install --save-dev firebase-functions firebase-admin
```

### 4.2 Configure Functions
Ensure your `functions/package.json` includes:
```json
{
  "dependencies": {
    "firebase-admin": "^11.0.0",
    "firebase-functions": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^4.0.0"
  }
}
```

### 4.3 Deploy Functions
```bash
# From project root
firebase deploy --only functions

# To deploy specific function
firebase deploy --only functions:setUserRole
```

**Functions Deployed:**
- `setUserRole` - Assign roles to users
- `revokeUserRole` - Remove roles
- `emergencyOverride` - Temporarily elevate permissions
- `revokeEmergencyOverride` - Revoke temporary elevation
- `cleanupExpiredOverrides` - Scheduled cleanup (every 5 minutes)
- `exportAuditLogs` - Export audit trail

---

## Step 5: Initialize Application

### 5.1 Update Root Layout

**`src/app/layout.tsx`:**
```tsx
import { AuthProvider } from '@/hooks/useAuth';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 5.2 Create Auth Pages

**`src/app/auth/login/page.tsx`:**
```tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p className="text-red-600">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## Step 6: Testing the RBAC System

### 6.1 Create Test Users

1. Go to Firebase Console → Authentication
2. Create test users with different roles:

```
Email: premier@limpopo.gov.za
Password: TempPassword123!
```

### 6.2 Assign Test Roles

1. Go to Cloud Functions logs in Firebase Console
2. Call function to set custom claims:

```bash
firebase functions:shell
> setUserRole({
  targetUserId: "user-id",
  role: "premier",
  department: null,
  sector: null
})
```

Or use the admin interface once deployed.

### 6.3 Verify Role-Based Access

Test each role to verify:
- ✅ Correct sections visible
- ✅ Permissions working
- ✅ Audit logs recording
- ✅ Database rules enforcing access

---

## Step 7: Production Deployment

### 7.1 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Firebase security rules tested
- [ ] Cloud Functions deployed and tested
- [ ] Audit logging working
- [ ] User authentication tested
- [ ] Role assignment tested
- [ ] Emergency override workflow tested
- [ ] Database backups configured

### 7.2 Deploy Next.js Application

```bash
# Build for production
npm run build

# Test production build locally
npm start

# Deploy to Firebase Hosting (if using)
firebase deploy --only hosting

# Or deploy to your preferred platform
vercel deploy
```

### 7.3 Enable Security Features

1. **Enable 2FA in Firebase:**
   - Authentication → Settings → Advanced
   - Require 2FA for admins

2. **Set up DDoS protection:**
   - Firebase → Security → Enable Security Rules

3. **Enable audit logging:**
   - Cloud Logging → Logs Explorer
   - Create alerts for suspicious activity

---

## Step 8: Monitoring & Maintenance

### 8.1 Monitor Audit Logs

```bash
# View recent audit logs
firebase functions:log

# Query specific user's actions
firestore query on auditLogs where userId == "user-id"
```

### 8.2 Monitor Role Changes

Set up alerts in Firebase Console:
```
Alert: If auditLogs.action == "role_assignment" in last 5 minutes
```

### 8.3 Regular Security Reviews

- **Daily:** Review failed authentication attempts
- **Weekly:** Audit role assignments
- **Monthly:** Review permissions matrix
- **Quarterly:** Security audit

---

## Troubleshooting

### Issue: "Cannot find module 'firebase/app'"

**Solution:**
```bash
npm install firebase
```

### Issue: Security rules blocking access

**Debug:**
1. Check `request.auth.token` in rules simulator
2. Verify custom claims set correctly
3. Check user's idToken includes claims

### Issue: Cloud Functions not triggering

**Debug:**
```bash
firebase functions:log
# Check for error messages

# Redeploy
firebase deploy --only functions
```

### Issue: Emulator not connecting

**Solution:**
```bash
firebase emulators:start
# In separate terminal
npm run dev
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Application                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              AuthProvider (Context)                   │  │
│  │  ├─ useAuth() - current user & claims               │  │
│  │  ├─ useRole() - role-based utilities                │  │
│  │  └─ signIn/signOut - auth methods                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Role-Based Components                       │  │
│  │  ├─ RoleGuard - render if role matches              │  │
│  │  ├─ Permission - render if permission granted       │  │
│  │  ├─ DepartmentGuard - render if department matches  │  │
│  │  └─ SectionGuard - render if section visible        │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Audit Logging Module                         │  │
│  │  └─ logAuditEvent() - track sensitive actions       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              Firebase Backend Services                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Firebase Auth                                      │   │
│  │  ├─ Custom Claims (role, department, sector)      │   │
│  │  └─ Email/Password, Google, Phone auth            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Cloud Firestore                                    │   │
│  │  ├─ incidents, videos, responders                  │   │
│  │  ├─ auditLogs (secured with rules)                │   │
│  │  └─ users, systemSettings (admin only)             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Cloud Functions                                    │   │
│  │  ├─ setUserRole - assign roles                     │   │
│  │  ├─ emergencyOverride - temporary elevation        │   │
│  │  └─ exportAuditLogs - compliance exports           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Firestore Security Rules                           │   │
│  │  └─ Enforce row-level access control               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Role Hierarchy Reference

```
100 - National Executive (full access)
 90 - Premier (provincial control)
 80 - Provincial Minister (sector control)
 70 - Department Director (department control)
 65 - Police Commander (unit command)
 60 - Traffic Chief (specialized command)
 55 - System Administrator (system only)
 30 - Read-Only Analyst (data access)
  0 - Citizen/Guest (limited access)
```

---

## Security Best Practices

1. **Never hardcode credentials** - use environment variables
2. **Regularly rotate service account keys** - every 90 days
3. **Monitor audit logs** - set up alerts for unusual activity
4. **Use 2FA for admins** - enforce for premier/admin accounts
5. **Implement IP whitelisting** - for sensitive operations
6. **Regular security audits** - quarterly reviews recommended
7. **Backup audit logs** - export daily for compliance

---

## Support & Escalation

- **Setup issues:** Check Firebase Console → Logs
- **Permission denied errors:** Verify firestore.rules deployment
- **Auth problems:** Clear browser cache and try again
- **Function errors:** Check Cloud Functions logs

For additional support, consult the RBAC_INTEGRATION_GUIDE.md

---

Last Updated: 2025-03-14
