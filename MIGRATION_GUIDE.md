# Migrating Existing Components to Use RBAC

This guide shows how to update your existing dashboard components to use the new RBAC system.

## Example 1: Convert KPI Card Component

### Before (Without RBAC)
```tsx
// components/dashboard/kpi-card.tsx
export function KPICard({ title, value, metric }: KPICardProps) {
  return (
    <div className="p-4 bg-white rounded border">
      <h3>{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{metric}</p>
    </div>
  );
}
```

### After (With RBAC)
```tsx
// components/dashboard/kpi-card.tsx
'use client';

import { useRole } from '@/hooks/useRole';
import { logAuditEvent } from '@/lib/audit';
import { useAuth } from '@/hooks/useAuth';

export function KPICard({ title, value, metric, resourceId }: KPICardProps) {
  const { role } = useRole();
  const { user, claims } = useAuth();

  // Log when sensitive KPIs are viewed
  const handleCardView = async () => {
    if (resourceId === 'sensitive') {
      await logAuditEvent(
        user?.uid || '',
        user?.email || '',
        role,
        'kpi_view',
        'kpis',
        resourceId
      );
    }
  };

  return (
    <div 
      className="p-4 bg-white rounded border cursor-pointer"
      onClick={handleCardView}
    >
      <h3>{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{metric}</p>
      {role === 'analyst' && (
        <p className="text-xs text-blue-600 mt-2">View Only</p>
      )}
    </div>
  );
}
```

---

## Example 2: Add Permission Guards to Live Incidents

### Before
```tsx
// components/dashboard/live-incidents.tsx
export function LiveIncidents({ incidents }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      {incidents.map(incident => (
        <div key={incident.id} className="p-4 border rounded">
          <h3>{incident.type}</h3>
          <p>Status: {incident.status}</p>
          
          {/* Edit button always visible */}
          <button onClick={() => handleEdit(incident.id)}>
            Edit
          </button>
          
          {/* Delete button always visible */}
          <button onClick={() => handleDelete(incident.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

### After
```tsx
// components/dashboard/live-incidents.tsx
'use client';

import { Permission, PermissionButton, useAvailableActions } from '@/components/auth/Permission';
import { logAuditEvent, SENSITIVE_ACTIONS } from '@/lib/audit';
import { useAuth } from '@/hooks/useAuth';

export function LiveIncidents({ incidents }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const { user, claims } = useAuth();
  const { canUpdate, canDelete } = useAvailableActions('incidents');

  const handleEdit = async (incidentId: string) => {
    // Log edit action
    await logAuditEvent(
      user?.uid || '',
      user?.email || '',
      claims?.role || 'guest',
      'incident_edit',
      'incidents',
      incidentId,
      { status: 'success' }
    );
    // ... perform edit
  };

  const handleDelete = async (incidentId: string) => {
    // Log delete action
    await logAuditEvent(
      user?.uid || '',
      user?.email || '',
      claims?.role || 'guest',
      SENSITIVE_ACTIONS.UNAUTHORIZED_ACCESS_ATTEMPT, // Log if not supposed to delete
      'incidents',
      incidentId,
      { status: canDelete ? 'success' : 'failed' }
    );
    // ... perform delete
  };

  return (
    <div>
      {incidents.map(incident => (
        <div key={incident.id} className="p-4 border rounded">
          <h3>{incident.type}</h3>
          <p>Status: {incident.status}</p>
          
          {/* Edit button - check permission */}
          <PermissionButton 
            action="update" 
            resource="incidents"
            onClick={() => handleEdit(incident.id)}
          >
            Edit
          </PermissionButton>
          
          {/* Delete button - check permission */}
          <PermissionButton 
            action="delete" 
            resource="incidents"
            onClick={() => handleDelete(incident.id)}
          >
            Delete
          </PermissionButton>
        </div>
      ))}
    </div>
  );
}
```

---

## Example 3: Convert Admin Panel to Role-Guarded

### Before
```tsx
// components/dashboard/admin-panel.tsx
export function AdminPanel() {
  return (
    <div>
      <h2>Admin Panel</h2>
      <UserManagement />
      <RoleAssignment />
      <AuditLogs />
    </div>
  );
}
```

### After
```tsx
// components/dashboard/admin-panel.tsx
'use client';

import { RoleGuard, RoleHierarchyGuard } from '@/components/auth/RoleGuard';
import { useRole } from '@/hooks/useRole';

export function AdminPanel() {
  const { role, loading } = useRole();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <RoleGuard 
      allowedRoles={['premier', 'admin', 'national_executive']}
      fallback={
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          ⛔ You don't have access to this panel
        </div>
      }
    >
      <div>
        <h2>Admin Panel</h2>
        
        {/* All admins can see user management */}
        <UserManagement />
        
        {/* Only Premier can assign roles */}
        <RoleHierarchyGuard minimumRole="premier">
          <RoleAssignment />
        </RoleHierarchyGuard>
        
        {/* Only system admin can view audit logs */}
        <RoleGuard allowedRoles={['admin', 'national_executive']}>
          <AuditLogs />
        </RoleGuard>
      </div>
    </RoleGuard>
  );
}
```

---

## Example 4: Department-Specific Dashboards

### Before
```tsx
// components/dashboard/saps-panel.tsx
export function SAPSPanel() {
  return (
    <div>
      <CrimeHotspots />
      <OfficeLocations />
      <ArrestTrends />
    </div>
  );
}
```

### After
```tsx
// components/dashboard/saps-panel.tsx
'use client';

import { DepartmentGuard, RoleGuard } from '@/components/auth/RoleGuard';
import { useRole } from '@/hooks/useRole';

export function SAPSPanel() {
  const { department } = useRole();

  return (
    <DepartmentGuard 
      allowedDepartments={['saps']}
      fallback={
        <div className="p-4 bg-amber-50 border border-amber-200 rounded">
          This panel is for SAPS users only
        </div>
      }
    >
      <div>
        <h2>SAPS Command Centre</h2>
        
        {/* All SAPS users see hotspots */}
        <CrimeHotspots />
        <OfficeLocations />
        
        {/* Commander only sees arrest trends */}
        <RoleGuard allowedRoles={['commander']}>
          <ArrestTrends />
        </RoleGuard>
      </div>
    </DepartmentGuard>
  );
}
```

---

## Example 5: Update Dashboard Main Component

### Before
```tsx
// app/dashboard/page.tsx
export default function Dashboard() {
  return (
    <div className="grid grid-cols-4 gap-6">
      <KPICard title="Response Time" value="4m 32s" />
      <AdminPanel />
      <AuditLogs />
      <RoleManagement />
      <CrimeHotspots />
      <HospitalCapacity />
      <TrafficControl />
    </div>
  );
}
```

### After
```tsx
// app/dashboard/page.tsx
'use client';

import { RoleGuard, SectionGuard, RoleHierarchyGuard } from '@/components/auth/RoleGuard';
import { useRole } from '@/hooks/useRole';

export default function Dashboard() {
  const { loading, visibleSections } = useRole();

  if (loading) {
    return <div className="animate-pulse">Loading dashboard...</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Core metrics - always visible */}
      <SectionGuard sectionName="kpi-dashboard">
        <KPICard title="Response Time" value="4m 32s" />
      </SectionGuard>

      {/* Admin sections - premier/admin only */}
      <RoleGuard allowedRoles={['premier', 'admin', 'national_executive']}>
        <SectionGuard sectionName="role-management">
          <RoleManagement />
        </SectionGuard>
      </RoleGuard>

      {/* Audit logs - admin only */}
      <RoleHierarchyGuard minimumRole="admin">
        <SectionGuard sectionName="audit-logs">
          <AuditLogs />
        </SectionGuard>
      </RoleHierarchyGuard>

      {/* Department-specific sections */}
      <SectionGuard sectionName="crime-hotspots">
        <CrimeHotspots />
      </SectionGuard>

      <SectionGuard sectionName="hospital-capacity">
        <HospitalCapacity />
      </SectionGuard>

      <SectionGuard sectionName="traffic-control">
        <TrafficControl />
      </SectionGuard>

      {/* Visible sections indicator (debug) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="col-span-4 p-4 bg-gray-100 text-xs font-mono">
          <p>Visible: {visibleSections.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
```

---

## Migration Checklist

### Phase 1: Preparation
- [ ] Read RBAC documentation
- [ ] Review existing components
- [ ] Plan component updates
- [ ] Set up test users

### Phase 2: Core Components
- [ ] Update main Dashboard component
- [ ] Add AuthProvider to root layout
- [ ] Update Live Incidents component
- [ ] Update KPI Cards

### Phase 3: Role-Specific Components
- [ ] Update Admin Panel
- [ ] Update SAPS Panel
- [ ] Update EMS Panel
- [ ] Update Transport Panel
- [ ] Update RAL Panel

### Phase 4: Actions & Permissions
- [ ] Add audit logging to edit buttons
- [ ] Add audit logging to delete buttons
- [ ] Add audit logging to export buttons
- [ ] Add audit logging to dispatch actions
- [ ] Add audit logging to emergency overrides

### Phase 5: Testing
- [ ] Test with Premier role
- [ ] Test with Admin role
- [ ] Test with Commander role
- [ ] Test with Analyst role
- [ ] Test with Guest/Citizen role

### Phase 6: Deployment
- [ ] Deploy updated components
- [ ] Monitor audit logs
- [ ] Verify access control working
- [ ] Get user feedback

---

## Common Patterns

### Pattern 1: Show/Hide Based on Role
```tsx
import { useRole } from '@/hooks/useRole';

function MyComponent() {
  const { role } = useRole();
  
  return (
    <>
      {role === 'premier' && <PremierSection />}
      {role === 'analyst' && <AnalystSection />}
    </>
  );
}
```

### Pattern 2: Disable Button Based on Permission
```tsx
import { PermissionButton } from '@/components/auth/Permission';

function MyComponent() {
  return (
    <PermissionButton action="delete" resource="incidents">
      Delete Incident
    </PermissionButton>
  );
}
```

### Pattern 3: Guard Entire Section
```tsx
import { RoleGuard } from '@/components/auth/RoleGuard';

function MyComponent() {
  return (
    <RoleGuard allowedRoles={['premier', 'admin']}>
      <SensitiveSection />
    </RoleGuard>
  );
}
```

### Pattern 4: Log Sensitive Action
```tsx
import { logAuditEvent, SENSITIVE_ACTIONS } from '@/lib/audit';
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, claims } = useAuth();
  
  const handleExport = async () => {
    try {
      await logAuditEvent(
        user!.uid,
        user!.email!,
        claims?.role || 'guest',
        SENSITIVE_ACTIONS.DATA_EXPORT,
        'incidents',
        'all'
      );
    } catch (error) {
      // handle error
    }
  };
}
```

---

## Testing Your Changes

### Test Visibility
```tsx
// Add this to debug
import { useRole } from '@/hooks/useRole';

function DebugPanel() {
  const { role, department, visibleSections } = useRole();
  
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black text-white text-xs">
      Role: {role}
      Dept: {department}
      Sections: {visibleSections.join(', ')}
    </div>
  );
}
```

### Test Permissions
```tsx
import { useRole } from '@/hooks/useRole';

function DebugPermissions() {
  const { canCreate, canRead, canUpdate, canDelete } = useRole();
  
  return (
    <div>
      Can Create: {canCreate('incidents') ? '✅' : '❌'}
      Can Read: {canRead('incidents') ? '✅' : '❌'}
      Can Update: {canUpdate('incidents') ? '✅' : '❌'}
      Can Delete: {canDelete('incidents') ? '✅' : '❌'}
    </div>
  );
}
```

---

## Rolling Back

If you need to revert changes:

```bash
# Keep new RBAC system, revert components to old versions
git checkout HEAD -- src/components/dashboard/
git commit -m "Revert component changes while keeping RBAC"
```

Or gradually migrate components:
1. Migrate critical components first (admin, auth)
2. Test thoroughly
3. Migrate remaining components
4. Gradually add audit logging

---

## Performance Tips

1. **Memoize role checks**
   ```tsx
   const visibleSections = useMemo(() => getVisibleSections(role), [role]);
   ```

2. **Lazy load sensitive components**
   ```tsx
   const AdminPanel = lazy(() => import('@/components/AdminPanel'));
   ```

3. **Cache permission results**
   ```tsx
   const permissions = useMemo(() => 
     ({ canRead, canUpdate, canDelete }), 
     [role]
   );
   ```

---

## Next Steps

1. Start with Phase 1 (Preparation)
2. Follow the phases in order
3. Test thoroughly before phase transitions
4. Deploy incrementally
5. Monitor audit logs for issues

For detailed component examples, see `src/components/auth/RbacExamples.tsx`

---

**Happy migrating! 🚀**
