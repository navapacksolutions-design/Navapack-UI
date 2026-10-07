import type { ScreenId } from '../types';

export function normalizeDepartment(department?: string, role?: string): string {
  return (department?.trim() || role?.trim() || '').toLowerCase();
}

export function isSalesDepartment(department?: string): boolean {
  const value = normalizeDepartment(department);
  return value.includes('sales') && !value.includes('marketing');
}

export function dashboardForDepartment(department?: string, role?: string): ScreenId {
  const value = normalizeDepartment(department, role);
  if (value.includes('sales') || value.includes('marketing')) return 'marketing-dashboard';
  if (value === 'hr' || value.includes('human resources')) return 'hr-dashboard';
  return 'dashboard';
}
