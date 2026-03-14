/**
 * Firebase Cloud Functions for RBAC Management
 * Deploy with: firebase deploy --only functions
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// ============================================
// Role Management
// ============================================

/**
 * Set custom claims for a user (assign role)
 * Requires: caller has 'admin' role
 */
export const setUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const callerRole = context.auth.token.role;
  if (!['premier', 'admin', 'national_executive'].includes(callerRole)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can assign roles'
    );
  }

  const { targetUserId, role, department, sector } = data;

  if (!targetUserId || !role) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'targetUserId and role are required'
    );
  }

  try {
    // Verify target user exists
    await admin.auth().getUser(targetUserId);

    // Set custom claims
    await admin.auth().setCustomUserClaims(targetUserId, {
      role,
      department: department || null,
      sector: sector || null,
      province: 'limpopo',
    });

    // Log the action
    await admin.firestore().collection('auditLogs').add({
      userId: context.auth.uid,
      targetUserId,
      action: 'role_assignment',
      role,
      department: department || null,
      status: 'success',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      message: `Role "${role}" assigned to user ${targetUserId}`,
    };
  } catch (error: any) {
    console.error('Error setting user role:', error);

    // Log failed attempt
    await admin.firestore().collection('auditLogs').add({
      userId: context.auth.uid,
      targetUserId,
      action: 'role_assignment',
      status: 'failed',
      errorMessage: error.message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    throw new functions.https.HttpsError(
      'internal',
      'Failed to set user role: ' + error.message
    );
  }
});

/**
 * Revoke all custom claims from a user
 * Requires: caller has 'admin' role
 */
export const revokeUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const callerRole = context.auth.token.role;
  if (!['premier', 'admin', 'national_executive'].includes(callerRole)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can revoke roles'
    );
  }

  const { targetUserId } = data;

  if (!targetUserId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'targetUserId is required'
    );
  }

  try {
    await admin.auth().setCustomUserClaims(targetUserId, null);

    await admin.firestore().collection('auditLogs').add({
      userId: context.auth.uid,
      targetUserId,
      action: 'role_revocation',
      status: 'success',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      message: `Role revoked for user ${targetUserId}`,
    };
  } catch (error: any) {
    console.error('Error revoking user role:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Emergency override - temporarily elevate user permissions
 * Requires: caller is Premier or higher
 */
export const emergencyOverride = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const callerRole = context.auth.token.role;
  if (!['premier', 'national_executive'].includes(callerRole)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only Premier or National Executive can issue emergency overrides'
    );
  }

  const { targetUserId, durationMinutes = 30, reason } = data;

  if (!targetUserId || !reason) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'targetUserId and reason are required'
    );
  }

  try {
    const currentClaims = (await admin.auth().getUser(targetUserId)).customClaims || {};

    // Add emergency override flag
    const newClaims = {
      ...currentClaims,
      emergencyOverride: true,
      emergencyOverrideExpiry: new Date(Date.now() + durationMinutes * 60000).toISOString(),
    };

    await admin.auth().setCustomUserClaims(targetUserId, newClaims);

    // Log the emergency action
    await admin.firestore().collection('auditLogs').add({
      userId: context.auth.uid,
      targetUserId,
      action: 'emergency_override',
      duration: durationMinutes,
      reason,
      status: 'success',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      message: `Emergency override granted for ${durationMinutes} minutes`,
    };
  } catch (error: any) {
    console.error('Error granting emergency override:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Revoke emergency override
 */
export const revokeEmergencyOverride = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Must be logged in'
      );
    }

    const callerRole = context.auth.token.role;
    if (!['premier', 'national_executive', 'admin'].includes(callerRole)) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Insufficient permissions'
      );
    }

    const { targetUserId } = data;

    try {
      const currentClaims = (
        await admin.auth().getUser(targetUserId)
      ).customClaims || {};
      const newClaims = { ...currentClaims };

      delete (newClaims as any).emergencyOverride;
      delete (newClaims as any).emergencyOverrideExpiry;

      await admin.auth().setCustomUserClaims(targetUserId, newClaims);

      await admin.firestore().collection('auditLogs').add({
        userId: context.auth.uid,
        targetUserId,
        action: 'emergency_override_revoke',
        status: 'success',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { success: true };
    } catch (error: any) {
      throw new functions.https.HttpsError('internal', error.message);
    }
  }
);

// ============================================
// Scheduled Tasks
// ============================================

/**
 * Cleanup expired emergency overrides (runs every 5 minutes)
 */
export const cleanupExpiredOverrides = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    const auth = admin.auth();
    const db = admin.firestore();

    try {
      // This is a simplified approach - Firebase Admin SDK doesn't directly
      // query users by claims, so you'd typically track overrides in Firestore
      // and clean them up that way

      const expiryDate = new Date();
      const snapshot = await db
        .collection('emergencyOverrides')
        .where('expiryDate', '<', expiryDate)
        .get();

      for (const doc of snapshot.docs) {
        const override = doc.data();
        const currentClaims = (
          await auth.getUser(override.userId)
        ).customClaims || {};
        const newClaims = { ...currentClaims };

        delete (newClaims as any).emergencyOverride;
        delete (newClaims as any).emergencyOverrideExpiry;

        await auth.setCustomUserClaims(override.userId, newClaims);
        await doc.ref.delete();
      }

      console.log(`Cleaned up ${snapshot.docs.length} expired overrides`);
    } catch (error) {
      console.error('Error cleaning up expired overrides:', error);
    }
  });

// ============================================
// Audit Log Helpers
// ============================================

/**
 * Export audit logs (admin only)
 */
export const exportAuditLogs = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const callerRole = context.auth.token.role;
  if (!['premier', 'admin', 'national_executive'].includes(callerRole)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can export audit logs'
    );
  }

  try {
    const snapshot = await admin
      .firestore()
      .collection('auditLogs')
      .orderBy('timestamp', 'desc')
      .limit(10000)
      .get();

    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Log the export action itself
    await admin.firestore().collection('auditLogs').add({
      userId: context.auth.uid,
      action: 'audit_logs_export',
      recordCount: logs.length,
      status: 'success',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, logs };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
