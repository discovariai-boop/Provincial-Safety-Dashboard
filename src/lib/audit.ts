/**
 * Audit Logging Utilities
 * Logs all sensitive operations to Firestore for compliance and security
 */

import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  Timestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';

export interface AuditLog {
  id?: string;
  userId: string;
  userEmail: string;
  userRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes?: Record<string, any>;
  previousValues?: Record<string, any>;
  newValues?: Record<string, any>;
  status: 'success' | 'failed';
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Timestamp;
  department?: string;
}

/**
 * Log an audit event
 */
export async function logAuditEvent(
  userId: string,
  userEmail: string,
  userRole: string,
  action: string,
  resourceType: string,
  resourceId: string,
  options?: {
    changes?: Record<string, any>;
    previousValues?: Record<string, any>;
    newValues?: Record<string, any>;
    status?: 'success' | 'failed';
    errorMessage?: string;
    department?: string;
  }
): Promise<string> {
  try {
    const auditLog: AuditLog = {
      userId,
      userEmail,
      userRole,
      action,
      resourceType,
      resourceId,
      changes: options?.changes,
      previousValues: options?.previousValues,
      newValues: options?.newValues,
      status: options?.status || 'success',
      errorMessage: options?.errorMessage,
      ipAddress: getClientIp(),
      userAgent: getUserAgent(),
      timestamp: Timestamp.now(),
      department: options?.department,
    };

    const docRef = await addDoc(collection(db, 'auditLogs'), auditLog);
    return docRef.id;
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // Don't throw - audit logging failure shouldn't break application
    return '';
  }
}

/**
 * Get audit logs for a user
 */
export async function getUserAuditLogs(
  userId: string,
  maxResults: number = 100
) {
  try {
    const q = query(
      collection(db, 'auditLogs'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(maxResults)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AuditLog[];
  } catch (error) {
    console.error('Failed to retrieve audit logs:', error);
    return [];
  }
}

/**
 * Get audit logs for a resource
 */
export async function getResourceAuditLogs(
  resourceType: string,
  resourceId: string,
  maxResults: number = 100
) {
  try {
    const q = query(
      collection(db, 'auditLogs'),
      where('resourceType', '==', resourceType),
      where('resourceId', '==', resourceId),
      orderBy('timestamp', 'desc'),
      limit(maxResults)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AuditLog[];
  } catch (error) {
    console.error('Failed to retrieve audit logs:', error);
    return [];
  }
}

/**
 * Get audit logs for a department
 */
export async function getDepartmentAuditLogs(
  department: string,
  maxResults: number = 100
) {
  try {
    const q = query(
      collection(db, 'auditLogs'),
      where('department', '==', department),
      orderBy('timestamp', 'desc'),
      limit(maxResults)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AuditLog[];
  } catch (error) {
    console.error('Failed to retrieve audit logs:', error);
    return [];
  }
}

/**
 * Sensitive action types that should always be audited
 */
export const SENSITIVE_ACTIONS = {
  ROLE_ASSIGNMENT: 'role_assignment',
  ROLE_REVOCATION: 'role_revocation',
  EMERGENCY_OVERRIDE: 'emergency_override',
  DATA_EXPORT: 'data_export',
  DISPATCH_OVERRIDE: 'dispatch_override',
  SENSOR_OVERRIDE: 'sensor_override',
  USER_DELETION: 'user_deletion',
  USER_CREATION: 'user_creation',
  SYSTEM_SETTINGS_CHANGE: 'system_settings_change',
  ALERT_CREATION: 'alert_creation',
  ALERT_ESCALATION: 'alert_escalation',
  TRAFFIC_LIGHT_OVERRIDE: 'traffic_light_override',
  VIDEO_ACCESS: 'video_access',
  REPORT_GENERATION: 'report_generation',
  UNAUTHORIZED_ACCESS_ATTEMPT: 'unauthorized_access_attempt',
};

/**
 * Helper to get client IP (for server-side logging)
 */
function getClientIp(): string {
  if (typeof window === 'undefined') {
    return 'N/A';
  }
  return 'Client-Side';
}

/**
 * Helper to get user agent
 */
function getUserAgent(): string {
  if (typeof window === 'undefined') {
    return 'N/A';
  }
  return navigator.userAgent;
}
