'use client';

import { useAuth } from './useAuth';
import { UserRole, Department, Sector, hasPermission, getVisibleSections } from '@/lib/rbac';

export interface UseRoleReturn {
  role: UserRole;
  department: Department | null;
  sector: Sector | null;
  province: 'limpopo' | 'all';
  emergencyOverride: boolean;
  loading: boolean;
  canCreate: (resource: string) => boolean;
  canRead: (resource: string) => boolean;
  canUpdate: (resource: string) => boolean;
  canDelete: (resource: string) => boolean;
  visibleSections: string[];
}

export function useRole(): UseRoleReturn {
  const { claims, loading } = useAuth();

  const role = claims?.role || 'guest';
  const department = (claims?.department as Department) || null;
  const sector = (claims?.sector as Sector) || null;
  const province = claims?.province || 'limpopo';
  const emergencyOverride = claims?.emergencyOverride || false;

  return {
    role,
    department,
    sector,
    province,
    emergencyOverride,
    loading,
    canCreate: (resource: string) => hasPermission(role, 'create', resource),
    canRead: (resource: string) => hasPermission(role, 'read', resource),
    canUpdate: (resource: string) => hasPermission(role, 'update', resource),
    canDelete: (resource: string) => hasPermission(role, 'delete', resource),
    visibleSections: getVisibleSections(role, department),
  };
}
