import { authenticatedFetch } from './tokenAuth';

export type ReportFormat = 'excel' | 'pdf';

export function validateReportDates(fromDate: string, toDate: string) {
  if (!fromDate || !toDate) return 'Both From Date and To Date are required.';
  const isDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value)
    && !Number.isNaN(Date.parse(value))
    && new Date(value).toISOString().slice(0, 10) === value;
  if (!isDate(fromDate) || !isDate(toDate)) return 'Enter valid dates in YYYY-MM-DD format.';
  if (fromDate > toDate) return 'From Date cannot be after To Date.';
  return '';
}

function errorMessage(payload: unknown): string {
  if (typeof payload === 'string') return payload;
  if (Array.isArray(payload)) return payload.map(errorMessage).filter(Boolean).join(' ');
  if (payload && typeof payload === 'object') {
    return Object.entries(payload).map(([key, value]) => {
      const message = errorMessage(value);
      return ['detail', 'error', 'message', 'non_field_errors'].includes(key) ? message : `${key}: ${message}`;
    }).join(' ');
  }
  return '';
}

export async function downloadReport(fromDate: string, toDate: string, format: ReportFormat, signal?: AbortSignal) {
  const validationError = validateReportDates(fromDate, toDate);
  if (validationError) throw new Error(validationError);
  const params = new URLSearchParams({ from_date: fromDate, to_date: toDate });
  const response = await authenticatedFetch(
    `https://api.navapacksolutions.com/api/reports/export/${format}/?${params}`,
    { method: 'GET', signal },
  );
  if (!response.ok) {
    let message = '';
    try { message = errorMessage(JSON.parse(await response.text())); } catch { /* Use a clear fallback for non-JSON errors. */ }
    throw new Error(message || `Could not download the report (${response.status}). Please try again.`);
  }
  const blob = await response.blob();
  if (signal?.aborted) throw new DOMException('Download cancelled', 'AbortError');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  try {
    link.href = url;
    link.download = `Navapack_Report_${fromDate}_to_${toDate}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    // Allow the browser to begin consuming the object URL before releasing it.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
