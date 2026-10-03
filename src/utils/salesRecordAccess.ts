export function localDateString(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function canEditSalesRecord(isSalesUser: boolean, record: { salesperson?: string; dateAdded?: string; date?: string } | undefined, userName: string, today = localDateString()) {
  if (!isSalesUser) return true;
  if (!record || !userName.trim()) return false;
  return record.salesperson?.trim().toLowerCase() === userName.trim().toLowerCase()
    && (record.dateAdded ?? record.date) === today;
}
