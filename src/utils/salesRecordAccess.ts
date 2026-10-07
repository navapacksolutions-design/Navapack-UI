export function localDateString(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function ownsSalesRecord(record: { salesperson?: string | number; salespersonId?: string | number; salespersonEmail?: string }, user: { name?: string; email?: string }, salespersons: { id?: string | number; name?: string; email?: string }[] = []) {
  const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase();
  const currentPerson = salespersons.find(person =>
    (normalize(user.email) && normalize(person.email) === normalize(user.email))
    || (normalize(user.name) && normalize(person.name) === normalize(user.name)));
  const recordId = record.salespersonId ?? (typeof record.salesperson === 'number' ? record.salesperson : undefined);
  if (recordId != null && /^\d+$/.test(String(recordId)) && currentPerson?.id != null) return String(recordId) === String(currentPerson.id);
  if (record.salespersonEmail && user.email) return normalize(record.salespersonEmail) === normalize(user.email);
  const name = currentPerson?.name || user.name;
  return Boolean(normalize(name)) && normalize(record.salesperson) === normalize(name);
}

export function canEditSalesRecord(isSalesUser: boolean, record: { salesperson?: string; dateAdded?: string; date?: string } | undefined, userName: string, today = localDateString()) {
  if (!isSalesUser) return true;
  if (!record || !userName.trim()) return false;
  return record.salesperson?.trim().toLowerCase() === userName.trim().toLowerCase()
    && (record.dateAdded ?? record.date) === today;
}
