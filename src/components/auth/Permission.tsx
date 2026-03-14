'use client';

import { useRole } from '@/hooks/useRole';
import type { UserRole } from '@/lib/rbac';
import { hasPermission } from '@/lib/rbac';

interface PermissionProps {
  action: 'create' | 'read' | 'update' | 'delete';
  resource: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Component wrapper for permission-based rendering
 */
export function Permission({ 
  action, 
  resource, 
  fallback = null, 
  children 
}: PermissionProps) {
  const { role, loading } = useRole();

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  const hasAccess = hasPermission(role, action, resource);

  return hasAccess ? <>{children}</> : fallback;
}

interface PermissionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  action: 'create' | 'read' | 'update' | 'delete';
  resource: string;
  children: React.ReactNode;
}

/**
 * Button that is disabled if user doesn't have permission
 */
export function PermissionButton({
  action,
  resource,
  children,
  ...props
}: PermissionButtonProps) {
  const { role, loading } = useRole();

  if (loading) {
    return (
      <button disabled className="opacity-50 cursor-not-allowed" {...props}>
        {children}
      </button>
    );
  }

  const hasAccess = hasPermission(role, action, resource);

  return (
    <button 
      disabled={!hasAccess} 
      className={`${!hasAccess ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={!hasAccess ? `Permission denied: ${action} ${resource}` : ''}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Hook to check if user has permission for an action on a resource
 */
export function usePermission(
  action: 'create' | 'read' | 'update' | 'delete',
  resource: string
): boolean {
  const { role } = useRole();
  return hasPermission(role, action, resource);
}

/**
 * Hook to get all available actions for a resource
 */
export function useAvailableActions(resource: string) {
  const { role } = useRole();
  
  return {
    canCreate: hasPermission(role, 'create', resource),
    canRead: hasPermission(role, 'read', resource),
    canUpdate: hasPermission(role, 'update', resource),
    canDelete: hasPermission(role, 'delete', resource),
  };
}
