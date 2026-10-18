import { localDateString } from './salesRecordAccess';
export function followupStatus(record: { followUpStatus?: string; salesStage?: string; nextFollowUpDate?: string }, today = localDateString()) {
  if (record.followUpStatus?.trim().toUpperCase() === 'COMPLETED') return 'Completed';
  if (!record.nextFollowUpDate) return 'No Date Set';
  if (record.nextFollowUpDate < today) return 'Overdue';
  if (record.nextFollowUpDate === today) return 'Due Today';
  return 'Pending';
}

export function isActiveFollowup(record: { followUpStatus?: string }) {
  return record.followUpStatus?.trim().toUpperCase() !== 'COMPLETED';
}
