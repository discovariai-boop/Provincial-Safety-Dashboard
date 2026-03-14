/**
 * Role-Based Access Control (RBAC) Types & Constants
 * For LPISTH Provincial Safety Dashboard
 */

export type UserRole = 
  | 'national_executive'
  | 'premier'
  | 'minister'
  | 'director'
  | 'commander'
  | 'chief'
  | 'admin'
  | 'analyst'
  | 'guest';

export type Department = 
  | 'saps'
  | 'ems'
  | 'health'
  | 'transport'
  | 'ral'
  | 'system';

export type Sector = 
  | 'safety'
  | 'health'
  | 'transport'
  | 'infrastructure'
  | 'government';

export interface CustomClaims {
  role: UserRole;
  department?: Department | null;
  sector?: Sector | null;
  province: 'limpopo' | 'all';
  emergencyOverride?: boolean;
}

export interface RolePermission {
  role: UserRole;
  canCreate: string[];
  canRead: string[];
  canUpdate: string[];
  canDelete: string[];
  canExport: boolean;
  canManageRoles: boolean;
  canViewAuditLogs: boolean;
  canOverrideAuthority: boolean;
}

export const rolePermissions: Record<UserRole, RolePermission> = {
  national_executive: {
    role: 'national_executive',
    canCreate: ['incidents', 'reports', 'roles'],
    canRead: ['*'], // Everything
    canUpdate: ['*'],
    canDelete: ['*'],
    canExport: true,
    canManageRoles: true,
    canViewAuditLogs: true,
    canOverrideAuthority: true,
  },
  premier: {
    role: 'premier',
    canCreate: ['incidents', 'reports', 'roles', 'alerts'],
    canRead: ['incidents', 'responders', 'kpis', 'predictions', 'videos', 'users'],
    canUpdate: ['incidents', 'responders', 'roles', 'alerts', 'users'],
    canDelete: ['incidents'],
    canExport: true,
    canManageRoles: true,
    canViewAuditLogs: true,
    canOverrideAuthority: true,
  },
  minister: {
    role: 'minister',
    canCreate: ['incidents', 'alerts', 'reports'],
    canRead: ['incidents', 'responders', 'kpis', 'predictions', 'alerts'],
    canUpdate: ['incidents', 'alerts'],
    canDelete: [],
    canExport: true,
    canManageRoles: false,
    canViewAuditLogs: false,
    canOverrideAuthority: false,
  },
  director: {
    role: 'director',
    canCreate: ['incidents', 'responders'],
    canRead: ['incidents', 'responders', 'alerts', 'department_kpis'],
    canUpdate: ['incidents', 'responders', 'responder_status'],
    canDelete: [],
    canExport: false,
    canManageRoles: false,
    canViewAuditLogs: false,
    canOverrideAuthority: false,
  },
  commander: {
    role: 'commander',
    canCreate: ['incidents'],
    canRead: ['incidents', 'responders', 'alerts', 'department_kpis'],
    canUpdate: ['incidents', 'responder_status'],
    canDelete: [],
    canExport: false,
    canManageRoles: false,
    canViewAuditLogs: false,
    canOverrideAuthority: false,
  },
  chief: {
    role: 'chief',
    canCreate: ['incidents', 'alerts'],
    canRead: ['incidents', 'responders', 'department_kpis'],
    canUpdate: ['incidents', 'responder_status', 'traffic_lights'],
    canDelete: [],
    canExport: false,
    canManageRoles: false,
    canViewAuditLogs: false,
    canOverrideAuthority: false,
  },
  admin: {
    role: 'admin',
    canCreate: ['users', 'roles', 'audit_logs'],
    canRead: ['*'],
    canUpdate: ['users', 'roles', 'system_settings'],
    canDelete: ['users'],
    canExport: true,
    canManageRoles: true,
    canViewAuditLogs: true,
    canOverrideAuthority: false,
  },
  analyst: {
    role: 'analyst',
    canCreate: [],
    canRead: ['incidents', 'responders', 'kpis', 'predictions', 'reports'],
    canUpdate: [],
    canDelete: [],
    canExport: true,
    canManageRoles: false,
    canViewAuditLogs: false,
    canOverrideAuthority: false,
  },
  guest: {
    role: 'guest',
    canCreate: ['incidents'], // Citizens can report incidents
    canRead: ['public_data'],
    canUpdate: [],
    canDelete: [],
    canExport: false,
    canManageRoles: false,
    canViewAuditLogs: false,
    canOverrideAuthority: false,
  },
};

export const roleHierarchy: Record<UserRole, number> = {
  national_executive: 100,
  premier: 90,
  minister: 80,
  director: 70,
  commander: 65,
  chief: 60,
  admin: 55,
  analyst: 30,
  guest: 0,
};

export const departmentNames: Record<Department, string> = {
  saps: 'South African Police Service',
  ems: 'Emergency Medical Services',
  health: 'Health Department',
  transport: 'Transport Department',
  ral: 'Roads Agency Limpopo',
  system: 'System Administrator',
};

export const roleDisplayNames: Record<UserRole, string> = {
  national_executive: 'National Executive',
  premier: 'Premier',
  minister: 'Provincial Minister',
  director: 'Department Director',
  commander: 'Police Commander',
  chief: 'Traffic Chief',
  admin: 'System Administrator',
  analyst: 'Read-Only Analyst',
  guest: 'Citizen',
};

/**
 * Check if a user has permission to perform an action
 */
export function hasPermission(
  role: UserRole,
  action: 'create' | 'read' | 'update' | 'delete',
  resource: string
): boolean {
  const permissions = rolePermissions[role];
  
  if (!permissions) return false;

  const resourceList = permissions[`can${action.charAt(0).toUpperCase()}${action.slice(1)}`] as string[];
  
  // Check for wildcard permission
  if (resourceList.includes('*')) return true;
  
  // Check for specific resource
  return resourceList.includes(resource);
}

/**
 * Check if a role can be assigned by another role
 */
export function canAssignRole(
  assignerRole: UserRole,
  targetRole: UserRole
): boolean {
  if (!rolePermissions[assignerRole]?.canManageRoles) {
    return false;
  }

  // A role can only assign roles lower in the hierarchy
  return roleHierarchy[assignerRole] > roleHierarchy[targetRole];
}

/**
 * Get visible sections for a role
 */
export function getVisibleSections(
  role: UserRole,
  department?: Department
): string[] {
  const sections: string[] = [];

  // All authenticated users see basic sections
  if (role !== 'guest') {
    sections.push('kpi-dashboard', 'live-incidents');
  }

  switch (role) {
    case 'national_executive':
      sections.push(
        'national-risk-index',
        'cross-province-view',
        'predictive-alerts',
        'public-communication'
      );
      break;

    case 'premier':
      sections.push(
        'kpi-dashboard',
        'live-incidents',
        'predictive-alerts',
        'public-communication',
        'worker-accountability',
        'smart-map',
        'departmental-integration',
        'role-management',
        'audit-logs'
      );
      break;

    case 'minister':
      sections.push(
        'departmental-integration',
        'predictive-alerts',
        'public-communication'
      );
      break;

    case 'director':
    case 'commander':
    case 'chief':
      sections.push(
        'live-incidents',
        'predictive-alerts',
        'smart-map'
      );
      if (department === 'saps') {
        sections.push('crime-hotspots');
      } else if (department === 'ems') {
        sections.push('hospital-capacity', 'eta-tracking');
      } else if (department === 'transport') {
        sections.push('smart-traffic-controller', 'congestion-map');
      } else if (department === 'ral') {
        sections.push('infrastructure-map', 'pothole-tracker');
      }
      break;

    case 'admin':
      sections.push(
        'role-management',
        'audit-logs',
        'system-settings',
        'user-management'
      );
      break;

    case 'analyst':
      sections.push(
        'predictive-alerts',
        'reports',
        'export-data'
      );
      break;

    case 'guest':
      sections.push('report-incident', 'sos-button');
      break;
  }

  return [...new Set(sections)]; // Remove duplicates
}

/**
 * Filter data based on role and department
 */
export function shouldShowData(
  role: UserRole,
  department: Department | undefined,
  resourceDepartment: Department | undefined,
  province: 'limpopo' | 'all' = 'limpopo'
): boolean {
  // National executive sees everything
  if (role === 'national_executive') return true;

  // Must be in Limpopo province
  if (province !== 'limpopo' && province !== 'all') return false;

  // Premiere sees all departments
  if (role === 'premier') return true;

  // Department-specific roles only see their department
  if (department && resourceDepartment) {
    return department === resourceDepartment;
  }

  // Analysts and guests see limited data
  if (role === 'analyst' || role === 'guest') return true;

  // Admins see everything
  if (role === 'admin') return true;

  return false;
}
