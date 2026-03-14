'use client';

import { ReactNode } from 'react';
import { useRole } from './useRole';
import type { UserRole } from '@/lib/rbac';
import { roleHierarchy } from '@/lib/rbac';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

/**
 * Component that renders children only if user's role is in allowedRoles
 */
export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback = null 
}: RoleGuardProps) {
  const { role, loading } = useRole();

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!allowedRoles.includes(role)) {
    return fallback;
  }

  return <>{children}</>;
}

interface DepartmentGuardProps {
  children: ReactNode;
  allowedDepartments: string[];
  fallback?: ReactNode;
}

/**
 * Component that renders children only if user's department is in allowedDepartments
 */
export function DepartmentGuard({ 
  children, 
  allowedDepartments, 
  fallback = null 
}: DepartmentGuardProps) {
  const { department, loading } = useRole();

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!department || !allowedDepartments.includes(department)) {
    return fallback;
  }

  return <>{children}</>;
}

interface SectionGuardProps {
  children: ReactNode;
  sectionName: string;
  fallback?: ReactNode;
}

/**
 * Component that renders children only if section is visible for user's role
 */
export function SectionGuard({ 
  children, 
  sectionName, 
  fallback = null 
}: SectionGuardProps) {
  const { visibleSections, loading } = useRole();

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!visibleSections.includes(sectionName)) {
    return fallback;
  }

  return <>{children}</>;
}

interface RoleHierarchyGuardProps {
  children: ReactNode;
  minimumRole: UserRole;
  fallback?: ReactNode;
}

/**
 * Component that renders children only if user's role is equal or higher in hierarchy
 */
export function RoleHierarchyGuard({ 
  children, 
  minimumRole, 
  fallback = null 
}: RoleHierarchyGuardProps) {
  const { role, loading } = useRole();

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  const userHierarchy = roleHierarchy[role] || 0;
  const minimumHierarchy = roleHierarchy[minimumRole] || 100;

  if (userHierarchy < minimumHierarchy) {
    return fallback;
  }

  return <>{children}</>;
}
