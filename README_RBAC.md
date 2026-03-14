# Role-Based Access Control (RBAC) System

## Quick Start

The RBAC system is now fully integrated into your Provincial Safety Dashboard. This document provides a quick reference.

### What's Included

✅ **Role Management** - 8 predefined roles with permission matrix  
✅ **Authentication** - Firebase Auth with custom claims  
✅ **Access Control** - Database-level rules + React component guards  
✅ **Audit Logging** - Track all sensitive operations  
✅ **Cloud Functions** - Role assignment, emergency overrides, exports  
✅ **Examples** - Ready-to-use components and patterns  

---

## The 8 Roles

| Role | Access Level | Key Permissions |
|------|-------------|-----------------|
| **National Executive** | 🔴 Full | Everything + cross-province view |
| **Premier** | 🔴 Full Province | All Limpopo data + role management |
| **Minister** | 🟠 Sector | Sector data + shared metrics |
| **Director** | 🟡 Department | Department operations + dispatch |
| **Commander** | 🟡 Department | Police-specific operations |
| **Chief** | 🟡 Department | Specialized command (traffic, etc) |
| **Admin** | 🟣 System | User/role management + logs |
| **Analyst** | 🟢 Read-Only | Data access, reports, exports |
| **Guest** | ⚪ Limited | Create incidents (citizens) |

---

## Quick Integration

### 1. Wrap App with Auth Provider

```tsx
// src/app/layout.tsx
import { AuthProvider } from '@/hooks/useAuth';

export default function RootLayout({ children }) {
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

### 2. Use Role Hooks

```tsx
import { useRole } from '@/hooks/useRole';

export function MyComponent() {
  const { role, department, canRead, canUpdate } = useRole();
  
  return (
    <div>
      {role === 'premier' && <AdminPanel />}
      {canUpdate('incidents') && <EditButton />}
    </div>
  );
}
```

### 3. Guard Sensitive Sections

```tsx
import { RoleGuard, SectionGuard } from '@/components/auth/RoleGuard';

export function Dashboard() {
  return (
    <div>
      {/* Everyone sees this */}
      <KPIMetrics />
      
      {/* Premier only */}
      <RoleGuard allowedRoles={['premier', 'admin']}>
        <AdminPanel />
      </RoleGuard>
      
      {/* Visible sections only */}
      <SectionGuard sectionName="role-management">
        <RoleManagement />
      </SectionGuard>
    </div>
  );
}
```

### 4. Audit Sensitive Actions

```tsx
import { logAuditEvent, SENSITIVE_ACTIONS } from '@/lib/audit';
import { useAuth } from '@/hooks/useAuth';

export function ExportButton() {
  const { user, claims } = useAuth();
  
  const handleExport = async () => {
    try {
      const data = await exportData();
      
      await logAuditEvent(
        user!.uid,
        user!.email!,
        claims?.role || 'guest',
        SENSITIVE_ACTIONS.DATA_EXPORT,
        'incidents',
        'all',
        { status: 'success', newValues: { count: data.length } }
      );
    } catch (error) {
      await logAuditEvent(
        user!.uid,
        user!.email!,
        claims?.role || 'guest',
        SENSITIVE_ACTIONS.DATA_EXPORT,
        'incidents',
        'all',
        { status: 'failed', errorMessage: error.message }
      );
    }
  };
  
  return <button onClick={handleExport}>Export</button>;
}
```

---

## Files Reference

### Core System
- `src/lib/rbac.ts` - Roles, permissions, utilities
- `src/lib/firebase.ts` - Firebase initialization
- `src/hooks/useAuth.ts` - Authentication context
- `src/hooks/useRole.ts` - Role information hook

### Components
- `src/components/auth/RoleGuard.tsx` - Role/department/section guards
- `src/components/auth/Permission.tsx` - Permission utilities
- `src/components/auth/RbacExamples.tsx` - Example implementations

### Backend
- `firestore.rules` - Database-level access control
- `functions/index.ts` - Cloud Functions for role management
- `src/lib/audit.ts` - Audit logging

### Documentation
- `RBAC_DEPLOYMENT_GUIDE.md` - Setup & deployment
- `RBAC_INTEGRATION_GUIDE.md` - Developer patterns
- `README_RBAC.md` - This file

---

## Common Tasks

### Check User's Role
```tsx
const { role, department } = useRole();
console.log(`User role: ${role}, Department: ${department}`);
```

### Check Specific Permission
```tsx
const { canCreate, canRead, canUpdate, canDelete } = useRole();
if (canUpdate('incidents')) {
  // Show edit button
}
```

### Restrict Component to Role
```tsx
<RoleGuard allowedRoles={['premier', 'admin']}>
  <AdminContent />
</RoleGuard>
```

### Restrict to Department
```tsx
<DepartmentGuard allowedDepartments={['saps']}>
  <CrimeHotspots />
</DepartmentGuard>
```

### Check Available Sections
```tsx
const { visibleSections } = useRole();
console.log('Visible sections:', visibleSections);
```

### Log Sensitive Action
```tsx
await logAuditEvent(
  userId,
  userEmail,
  userRole,
  'role_assignment',
  'users',
  targetUserId,
  { status: 'success', previousValues: oldRole, newValues: newRole }
);
```

---

## Database Rules

Firestore security rules are in `firestore.rules`. Key restrictions:

- **Incidents** - Visible to authorized roles + relevant departments
- **Videos** - Only to departments and admins
- **Responders** - Only to their department or admins
- **Hospital Capacity** - EMS/Health only
- **Traffic Data** - Transport only
- **Infrastructure** - RAL only
- **Audit Logs** - Admins only
- **User Roles** - Admins only

---

## Sensitive Actions Tracked

The system automatically logs:
- Role assignments/revocations
- Emergency overrides
- Data exports
- Dispatch overrides
- System setting changes
- Unauthorized access attempts
- Video access
- Report generation
- Alert escalations

View audit logs in Firebase Console → Firestore → auditLogs collection.

---

## Deployment Steps

1. **Setup Firebase Project**
   ```bash
   firebase init
   firebase login
   ```

2. **Deploy Security Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Deploy Cloud Functions**
   ```bash
   cd functions && npm install
   firebase deploy --only functions
   ```

4. **Configure Environment**
   - Copy `.env.local.example` to `.env.local`
   - Add Firebase credentials
   - Add to `.gitignore`

5. **Wrap App with AuthProvider**
   - Edit `src/app/layout.tsx`
   - Wrap children with `<AuthProvider>`

6. **Test**
   - Create test users
   - Assign roles via Firebase Console
   - Verify access controls

---

## Emergency Override System

For critical situations, Premier/National Executive can temporarily elevate any user:

```tsx
import { httpsCallable } from 'firebase/functions';

const grantOverride = httpsCallable(functions, 'emergencyOverride');

await grantOverride({
  targetUserId: 'user-123',
  durationMinutes: 30,
  reason: 'Active incident response'
});
```

The override expires automatically and is logged.

---

## Troubleshooting

**"Permission denied" errors?**
- Check firestore.rules deployed correctly
- Verify custom claims set on user
- Check browser console for actual error

**Can't see buttons/sections?**
- Verify role assigned to test user
- Check visible sections in useRole()
- Confirm guards use correct role names

**Audit logs not recording?**
- Ensure auditLogs collection exists
- Check browser console for errors
- Verify user has audit logging permission

**Auth not working?**
- Check Firebase credentials in .env.local
- Verify AuthProvider wraps app
- Check browser DevTools → Application → Cookies

---

## Security Reminders

🔒 **DON'T:**
- Commit credentials to git
- Expose service account keys
- Trust client-side permission checks alone
- Skip database-level security rules

✅ **DO:**
- Use environment variables
- Deploy firestore.rules
- Audit sensitive operations
- Review logs regularly
- Enable 2FA for admins
- Backup audit trail

---

## Support

- **Setup issues:** See RBAC_DEPLOYMENT_GUIDE.md
- **Integration help:** See RBAC_INTEGRATION_GUIDE.md
- **Firebase docs:** https://firebase.google.com/docs
- **Code examples:** See src/components/auth/RbacExamples.tsx

---

**Status:** ✅ Production Ready  
**Last Updated:** 2025-03-14  
**Compliance:** POPIA, South African Government Standards
