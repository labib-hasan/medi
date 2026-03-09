/**
 * Admin Authentication Utility
 * Handles authentication and authorization checks for admin pages
 */

import { useRouter } from 'next/router';

/**
 * Get stored admin user data
 * @returns {Object|null} Admin user object or null
 */
export const getStoredAdminUser = () => {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('adminUser');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing admin user:', error);
    return null;
  }
};

/**
 * Get stored admin token
 * @returns {string|null} Token string or null
 */
export const getStoredAdminToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('adminToken');
};

/**
 * Check if admin is logged in
 * @returns {boolean}
 */
export const isAdminLoggedIn = () => {
  const token = getStoredAdminToken();
  const user = getStoredAdminUser();
  return !!token && !!user;
};

/**
 * Check if admin has valid role (superadmin or admin)
 * @returns {boolean}
 */
export const hasValidAdminRole = () => {
  const user = getStoredAdminUser();
  if (!user) return false;
  return user.role === 'superadmin' || user.role === 'admin';
};

/**
 * Check if admin is superadmin
 * @returns {boolean}
 */
export const isSuperadmin = () => {
  const user = getStoredAdminUser();
  return user?.role === 'superadmin';
};

/**
 * Check if admin is regular admin (not superadmin)
 * @returns {boolean}
 */
export const isAdmin = () => {
  const user = getStoredAdminUser();
  return user?.role === 'admin';
};

/**
 * Redirect to login if not authenticated
 * Should be called in useEffect
 * @param {Object} router - Next.js router instance
 * @returns {boolean} True if authenticated, false if redirected
 */
export const requireAdminAuth = (router) => {
  if (!isAdminLoggedIn()) {
    router.push('/admin/login');
    return false;
  }
  return true;
};

/**
 * Redirect to login if not authenticated or doesn't have valid role
 * Should be called in useEffect
 * @param {Object} router - Next.js router instance
 * @returns {boolean} True if authorized, false if redirected
 */
export const requireAdminRole = (router) => {
  if (!isAdminLoggedIn()) {
    router.push('/admin/login');
    return false;
  }
  
  if (!hasValidAdminRole()) {
    // User is logged in but doesn't have valid role
    // Redirect to home page
    router.push('/');
    return false;
  }
  
  return true;
};

/**
 * Redirect to dashboard if already logged in (for login page)
 * Should be called in useEffect
 * @param {Object} router - Next.js router instance
 * @returns {boolean} True if not logged in, false if redirected
 */
export const redirectIfLoggedIn = (router) => {
  if (isAdminLoggedIn() && hasValidAdminRole()) {
    router.push('/admin/dashboard');
    return false;
  }
  return true;
};

/**
 * Logout admin - clear all admin related data
 */
export const adminLogout = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};

