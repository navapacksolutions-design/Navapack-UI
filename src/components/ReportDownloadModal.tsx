import React, { useEffect, useRef, useState } from 'react';
import { Download, XCircle } from 'lucide-react';
import { downloadReport, ReportFormat, validateReportDates } from '../services/reportDownload';

export function ReportDownloadModal({ onClose }: { onClose: () => void }) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [format, setFormat] = useState<ReportFormat>('excel');
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const request = useRef<AbortController | null>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement;
    dialog.current?.showModal();
    return () => {
      request.current?.abort();
      dialog.current?.close();
      previousFocus?.focus();
    };
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (request.current) return;
    const validationError = validateReportDates(fromDate, toDate);
    setError(validationError);
    if (validationError) return;
    const controller = new AbortController();
    request.current = controller;
    setDownloading(true);
    try {
      await downloadReport(fromDate, toDate, format, controller.signal);
      onClose();
    } catch (err) {
      if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Could not download the report. Please try again.');
    } finally {
      request.current = null;
      if (!controller.signal.aborted) setDownloading(false);
    }
  };

  const fieldClass = 'w-full min-w-0 border border-slate-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-60';
  return (
    <dialog ref={dialog} onCancel={(event) => { event.preventDefault(); onClose(); }}
      aria-labelledby="report-download-title" aria-describedby={error ? 'report-download-error' : undefined}
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm">
      <div className="p-4 bg-sky-800 text-white flex justify-between items-center gap-4">
        <h3 id="report-download-title" className="font-bold text-base">Download Report</h3>
        <button type="button" onClick={onClose} aria-label="Close download report" className="hover:bg-sky-700 p-1 rounded focus-visible:outline-2"><XCircle className="w-5 h-5" /></button>
      </div>
      <form onSubmit={submit} noValidate className="p-6 space-y-4 text-sm" aria-busy={downloading}>
        {error && <p id="report-download-error" role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label htmlFor="report-from-date" className="block font-semibold text-slate-700 mb-1">From Date *</label>
            <input autoFocus id="report-from-date" type="date" required value={fromDate} disabled={downloading} onChange={event => setFromDate(event.target.value)} className={fieldClass} /></div>
          <div><label htmlFor="report-to-date" className="block font-semibold text-slate-700 mb-1">To Date *</label>
            <input id="report-to-date" type="date" required value={toDate} disabled={downloading} onChange={event => setToDate(event.target.value)} className={fieldClass} /></div>
        </div>
        <div><label htmlFor="report-format" className="block font-semibold text-slate-700 mb-1">Format</label>
          <select id="report-format" value={format} disabled={downloading} onChange={event => setFormat(event.target.value as ReportFormat)} className={fieldClass}>
            <option value="excel">Excel (.xlsx)</option><option value="pdf">PDF (.pdf)</option>
          </select></div>
        <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-slate-200">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50">Cancel</button>
          <button type="submit" disabled={downloading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-700 text-white font-semibold hover:bg-sky-800 disabled:opacity-60 disabled:cursor-wait">
            <Download className="w-4 h-4" aria-hidden="true" /><span role="status">{downloading ? 'Downloading…' : 'Download'}</span>
          </button>
        </div>
      </form>
    </dialog>
  );
}
