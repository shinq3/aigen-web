import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { AdminUser } from '@shared/schema';

const SALT_ROUNDS = 12;

export class AuthService {
  /**
   * Hash a plain text password
   */
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Verify a plain text password against a hashed password
   */
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Generate a cryptographically secure session token
   */
  static generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Validate username format
   */
  static isValidUsername(username: string): boolean {
    // Allow alphanumeric, underscore, hyphen, 3-30 characters
    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    return usernameRegex.test(username);
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static isValidPassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    
    if (!/\d/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    
    return { valid: true };
  }

  /**
   * Sanitize admin user data for client response
   */
  static sanitizeAdminUser(user: AdminUser): Omit<AdminUser, 'passwordHash'> {
    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

// Type augmentation for Express Request and Session
declare global {
  namespace Express {
    interface Request {
      currentAdmin?: AdminUser;
    }
    interface Session {
      adminUserId?: string;
    }
  }
}

import { Request, Response, NextFunction } from 'express';
import { AdminRole, AdminPermission, DepartmentAccess } from '@shared/schema';
import { storage } from '../storage';

// Basic authentication check
export const isAdminAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = req.session as any;
    if (!session?.adminUserId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const admin = await storage.getAdminUser(session.adminUserId);
    if (!admin || !admin.isActive) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: 'Admin account not found or inactive' });
    }

    req.currentAdmin = admin;
    (req as any).user = admin; // Also set req.user for consistency
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Role-based access control
export const requireRole = (allowedRoles: AdminRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.currentAdmin;
      if (!admin) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      if (!allowedRoles.includes(admin.role as AdminRole)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
};

// Permission-based access control
export const requirePermission = (requiredPermissions: AdminPermission[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.currentAdmin;
      if (!admin) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const adminPermissions = (admin.permissions as AdminPermission[]) || [];
      const hasPermission = requiredPermissions.every(permission => 
        adminPermissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
};

// Department access control
export const requireDepartmentAccess = (requiredDepartments: DepartmentAccess[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.currentAdmin;
      if (!admin) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const departmentAccess = (admin.departmentAccess as DepartmentAccess[]) || [];
      const hasAccess = requiredDepartments.every(department => 
        departmentAccess.includes(department)
      );

      if (!hasAccess) {
        return res.status(403).json({ error: 'Access denied to this department' });
      }

      next();
    } catch (error) {
      console.error('Department access check error:', error);
      res.status(500).json({ error: 'Department access check failed' });
    }
  };
};

// Superadmin only access
export const requireSuperadmin = requireRole(['superadmin']);

// Self or superadmin access (for profile management)
export const allowSelfOrSuperadmin = (req: Request, res: Response, next: NextFunction) => {
  const admin = req.currentAdmin;
  const targetId = req.params.id;
  
  if (!admin) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (admin.role === 'superadmin' || admin.id === targetId) {
    next();
  } else {
    res.status(403).json({ error: 'Can only modify own profile or need superadmin access' });
  }
};

// Prevent last superadmin deletion/demotion
export const protectLastSuperadmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetId = req.params.id;
    const targetAdmin = await storage.getAdminUser(targetId);
    
    if (!targetAdmin || targetAdmin.role !== 'superadmin') {
      return next();
    }

    const superadminCount = await storage.countAdminsByRole('superadmin');
    if (superadminCount <= 1) {
      return res.status(403).json({ 
        error: 'Cannot delete or demote the last superadmin' 
      });
    }

    next();
  } catch (error) {
    console.error('Last superadmin protection error:', error);
    res.status(500).json({ error: 'Protection check failed' });
  }
};