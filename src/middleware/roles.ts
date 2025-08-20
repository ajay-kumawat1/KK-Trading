import type { Response, NextFunction, Request } from "express";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin"
}

// Type for the user object
interface User {
  id: string;
  roles: UserRole[];
  username?: string;
}

// Type guard to check if an object is a User
function isUser(user: any): user is User {
  return user &&
    typeof user.id === 'string' &&
    Array.isArray(user.roles) &&
    user.roles.every((role: any) => Object.values(UserRole).includes(role));
}

// Middleware to check if user has required role
export const requireRole = (requiredRole: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!isUser(user)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Authentication required"
      });
    }

    if (!user.roles.includes(requiredRole)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Insufficient permissions"
      });
    }

    next();
  };
};

// Middleware to check if user has any of the required roles
export const requireAnyRole = (requiredRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!isUser(user)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Authentication required"
      });
    }

    const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role));

    if (!hasRequiredRole) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Insufficient permissions"
      });
    }

    next();
  };
};
