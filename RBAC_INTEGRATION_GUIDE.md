/**
 * RBAC Integration Guide
 * 
 * This file documents how to integrate the RBAC system into your components
 */

// ============================================
// 1. SETUP: Wrap your app with AuthProvider
// ============================================

// In your root layout or _app.tsx:
/*
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
*/

// ============================================
// 2. BASIC: Check user role in a component
// ============================================

// Example: Show different content based on role
/*
import { useRole } from '@/hooks/useRole';

function Dashboard() {
  const { role, department } = useRole();

  return (
    <div>
      <h1>Welcome, {role}</h1>
      {department && <p>Department: {department}</p>}
    </div>
  );
}
*/

// ============================================
// 3. GUARD: Render components conditionally
// ============================================

// Example: Only show section if role is in list
/*
import { RoleGuard } from '@/components/auth/RoleGuard';

function AdminPanel() {
  return (
    <RoleGuard 
      allowedRoles={['premier', 'admin']}
      fallback={<p>You don't have access</p>}
    >
      <div>Admin Panel Content</div>
    </RoleGuard>
  );
}
*/

// ============================================
// 4. PERMISSIONS: Check specific actions
// ============================================

// Example: Check if user can perform an action
/*
import { usePermission } from '@/components/auth/Permission';

function IncidentEditor() {
  const canEdit = usePermission('update', 'incidents');
  const canDelete = usePermission('delete', 'incidents');

  return (
    <div>
      <button disabled={!canEdit}>Edit</button>
      <button disabled={!canDelete}>Delete</button>
    </div>
  );
}
*/

// ============================================
// 5. DEPARTMENT GUARD: Restrict to department
// ============================================

// Example: Show content only for specific department
/*
import { DepartmentGuard } from '@/components/auth/RoleGuard';

function SAPSPanel() {
  return (
    <DepartmentGuard 
      allowedDepartments={['saps']}
      fallback={<p>SAPS only</p>}
    >
      <div>SAPS Crime Hotspots</div>
    </DepartmentGuard>
  );
}
*/

// ============================================
// 6. SECTION VISIBILITY: Role-based sections
// ============================================

// Example: Show/hide entire dashboard sections
/*
import { SectionGuard } from '@/components/auth/RoleGuard';

function Dashboard() {
  return (
    <div>
      <SectionGuard sectionName="role-management">
        <RoleManagementPanel />
      </SectionGuard>

      <SectionGuard sectionName="audit-logs">
        <AuditLogViewer />
      </SectionGuard>
    </div>
  );
}
*/

// ============================================
// 7. AUDIT LOGGING: Log sensitive actions
// ============================================

// Example: Log when a user exports data
/*
import { logAuditEvent, SENSITIVE_ACTIONS } from '@/lib/audit';
import { useAuth } from '@/hooks/useAuth';

async function handleExportData() {
  const { user, claims } = useAuth();

  try {
    // Do the export
    const data = await fetchAllIncidents();
    
    // Log the successful action
    await logAuditEvent(
      user!.uid,
      user!.email!,
      claims?.role || 'guest',
      SENSITIVE_ACTIONS.DATA_EXPORT,
      'incidents',
      'all',
      {
        status: 'success',
        newValues: { recordCount: data.length }
      }
    );
  } catch (error) {
    // Log the failed attempt
    await logAuditEvent(
      user!.uid,
      user!.email!,
      claims?.role || 'guest',
      SENSITIVE_ACTIONS.DATA_EXPORT,
      'incidents',
      'all',
      {
        status: 'failed',
        errorMessage: (error as Error).message
      }
    );
  }
}
*/

// ============================================
// 8. HIERARCHY: Check role level
// ============================================

// Example: Only show to Premier and above
/*
import { RoleHierarchyGuard } from '@/components/auth/RoleGuard';

function NationalDashboard() {
  return (
    <RoleHierarchyGuard 
      minimumRole="premier"
      fallback={<p>Requires Premier level access</p>}
    >
      <div>National Risk Index</div>
    </RoleHierarchyGuard>
  );
}
*/

// ============================================
// 9. DYNAMIC PERMISSIONS: Get available actions
// ============================================

// Example: Show only available actions for user
/*
import { useAvailableActions } from '@/components/auth/Permission';

function IncidentCard({ incidentId }) {
  const actions = useAvailableActions('incidents');

  return (
    <div>
      <h3>Incident {incidentId}</h3>
      {actions.canRead && <p>Details visible</p>}
      {actions.canUpdate && <button>Edit</button>}
      {actions.canDelete && <button>Delete</button>}
    </div>
  );
}
*/

// ============================================
// 10. FIREBASE RULES: Database access control
// ============================================

// The firestore.rules file handles database-level access control.
// No need to duplicate checks - if a read violates the rules, it fails at the database.

// Example: incident only visible to authorized roles
/*
// In firestore.rules:
match /incidents/{incidentId} {
  allow read: if request.auth.token.role in ['premier', 'director', 'admin']
}

// In React, you can still use usePermission() for UI:
// - If the user shouldn't see the button, hide it
// - If they try to access it anyway, the database rules reject the request
*/

// ============================================
// 11. ROLE ASSIGNMENT: Admin Interface
// ============================================

// Example: Admin assigning a role to a user
/*
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';

async function assignRoleToUser(targetUserId: string, newRole: string) {
  const assignRole = httpsCallable(functions, 'setUserRole');
  
  try {
    const result = await assignRole({
      targetUserId,
      role: newRole,
      department: 'saps', // optional
      sector: 'safety', // optional
    });
    
    console.log('Role assigned:', result.data);
  } catch (error) {
    console.error('Failed to assign role:', error);
  }
}
*/

// ============================================
// 12. CUSTOM CLAIMS REFRESH: After role change
// ============================================

// Example: Refresh user's claims after role update
/*
import { useAuth } from '@/hooks/useAuth';

function AdminPanel() {
  const { refreshClaims } = useAuth();

  async function handleRoleChange() {
    // ... make role change ...
    
    // Refresh the current user's claims to reflect new role
    await refreshClaims();
  }

  return <button onClick={handleRoleChange}>Update Role</button>;
}
*/

// ============================================
// DEPLOYMENT CHECKLIST
// ============================================

// □ Set environment variables in Firebase Console:
//   NEXT_PUBLIC_FIREBASE_API_KEY
//   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
//   NEXT_PUBLIC_FIREBASE_PROJECT_ID
//   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
//   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
//   NEXT_PUBLIC_FIREBASE_APP_ID

// □ Deploy Firestore security rules:
//   firebase deploy --only firestore:rules

// □ Deploy Cloud Functions:
//   cd functions && npm install
//   firebase deploy --only functions

// □ Wrap app with AuthProvider in root layout

// □ Use RoleGuard, SectionGuard, Permission components throughout

// □ Add audit logging to sensitive operations

// □ Test role-based access with different user accounts

// □ Monitor audit logs for unauthorized access attempts

export const RBAC_INTEGRATION_COMPLETE = true;
