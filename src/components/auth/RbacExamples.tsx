'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { RoleGuard, SectionGuard } from '@/components/auth/RoleGuard';
import { Permission } from '@/components/auth/Permission';
import { roleDisplayNames, departmentNames } from '@/lib/rbac';

/**
 * Example: User Profile Card
 * Shows current user's role and department
 */
export function UserProfileCard() {
  const { user, claims } = useAuth();
  const { role, department } = useRole();

  if (!user) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded">
        Not logged in
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">User Profile</h2>
      <dl className="space-y-3">
        <div>
          <dt className="text-sm font-medium text-gray-500">Email</dt>
          <dd className="text-base text-gray-900">{user.email}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Role</dt>
          <dd className="text-base text-gray-900 font-semibold">
            {roleDisplayNames[role as keyof typeof roleDisplayNames] || role}
          </dd>
        </div>
        {department && (
          <div>
            <dt className="text-sm font-medium text-gray-500">Department</dt>
            <dd className="text-base text-gray-900">
              {departmentNames[department as keyof typeof departmentNames] || department}
            </dd>
          </div>
        )}
        {claims?.emergencyOverride && (
          <div>
            <dt className="text-sm font-medium text-red-600">Status</dt>
            <dd className="text-base text-red-900 font-semibold">🚨 EMERGENCY OVERRIDE ACTIVE</dd>
          </div>
        )}
      </dl>
    </div>
  );
}

/**
 * Example: Role-Based Dashboard Sections
 * Different sections visible based on user role
 */
export function RoleBasedDashboard() {
  const { role } = useRole();

  return (
    <div className="space-y-6">
      {/* Always visible */}
      <SectionGuard sectionName="kpi-dashboard">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold text-blue-900">KPI Dashboard</h3>
          <p className="text-sm text-blue-800">Response times, incident metrics</p>
        </div>
      </SectionGuard>

      {/* Premier only */}
      <RoleGuard allowedRoles={['premier', 'national_executive']}>
        <div className="p-4 bg-purple-50 border border-purple-200 rounded">
          <h3 className="font-semibold text-purple-900">Role Management</h3>
          <p className="text-sm text-purple-800">Manage user roles and permissions</p>
        </div>
      </RoleGuard>

      {/* Premier and Admins */}
      <RoleGuard allowedRoles={['premier', 'admin', 'national_executive']}>
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="font-semibold text-red-900">Audit Logs</h3>
          <p className="text-sm text-red-800">View all system actions and changes</p>
        </div>
      </RoleGuard>

      {/* SAPS only */}
      <RoleGuard allowedRoles={['commander']} fallback={null}>
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-semibold text-green-900">Crime Hotspots</h3>
          <p className="text-sm text-green-800">SAPS Intelligence Dashboard</p>
        </div>
      </RoleGuard>

      {/* Department-specific */}
      {role === 'director' && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded">
          <h3 className="font-semibold text-indigo-900">Department Operations</h3>
          <p className="text-sm text-indigo-800">Manage your department's resources</p>
        </div>
      )}
    </div>
  );
}

/**
 * Example: Permission-Gated Actions
 * Buttons and actions based on permissions
 */
export function PermissionGatedActions() {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Available Actions</h3>

      {/* Create incident - most roles can do this */}
      <Permission action="create" resource="incidents">
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Create Incident Report
        </button>
      </Permission>

      {/* Manage roles - admin only */}
      <Permission action="update" resource="roles">
        <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
          Manage User Roles
        </button>
      </Permission>

      {/* Export data - certain roles only */}
      <Permission action="read" resource="audit_logs">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Export Audit Logs
        </button>
      </Permission>

      {/* Delete resource - very restricted */}
      <Permission action="delete" resource="incidents" fallback={
        <button disabled className="px-4 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed">
          Delete Incident (Not Permitted)
        </button>
      }>
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Delete Incident
        </button>
      </Permission>
    </div>
  );
}

/**
 * Example: Role Selector for Admins
 * Interface to change user roles (admin only)
 */
export function RoleSelectorInterface() {
  const [selectedUserId, setSelectedUserId] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState('analyst');

  const handleAssignRole = async () => {
    // This would call the Firebase Cloud Function
    console.log(`Assigning role "${selectedRole}" to user "${selectedUserId}"`);
    // In production: call assignRoleAction(selectedUserId, selectedRole)
  };

  return (
    <RoleGuard allowedRoles={['premier', 'admin', 'national_executive']} fallback={
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-900">
        ⛔ You do not have permission to manage roles
      </div>
    }>
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm space-y-4">
        <h3 className="font-semibold text-lg">Assign User Role</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User ID or Email
          </label>
          <input
            type="text"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            placeholder="user@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="guest">Citizen (Guest)</option>
            <option value="analyst">Analyst (Read-Only)</option>
            <option value="commander">Police Commander</option>
            <option value="director">Department Director</option>
            <option value="minister">Provincial Minister</option>
            <option value="premier">Premier</option>
            <option value="national_executive">National Executive</option>
          </select>
        </div>

        <button
          onClick={handleAssignRole}
          className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
        >
          Assign Role
        </button>
      </div>
    </RoleGuard>
  );
}
