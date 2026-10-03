import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';
import { downloadReport, validateReportDates } from '../src/services/reportDownload';
import { canEditSalesRecord, localDateString } from '../src/utils/salesRecordAccess';

test('sales edits require own same-day pipeline or activity record', () => {
  const today = '2026-10-03';
  for (const field of ['dateAdded', 'date']) {
    const record = { salesperson: ' Sales Person ', [field]: today };
    assert.equal(canEditSalesRecord(true, record, 'sales person', today), true);
    assert.equal(canEditSalesRecord(true, { ...record, [field]: '2026-10-02' }, 'sales person', today), false);
    assert.equal(canEditSalesRecord(true, { ...record, [field]: '2026-10-04' }, 'sales person', today), false);
    assert.equal(canEditSalesRecord(true, record, 'another person', today), false);
    assert.equal(canEditSalesRecord(true, record, '', today), false);
    assert.equal(canEditSalesRecord(true, record, 'sales person', '2026-10-04'), false);
    assert.equal(canEditSalesRecord(false, { ...record, [field]: '2026-10-02' }, 'another person', today), true);
  }
  assert.equal(canEditSalesRecord(true, undefined, 'sales person', today), false);
  assert.equal(canEditSalesRecord(true, { salesperson: 'sales person' }, 'sales person', today), false);
  assert.equal(localDateString(new Date(2026, 9, 3, 0, 1)), today);
});

test('export validation, binary downloads, errors, authentication and retry', async () => {
  const storage = new Map([['navapack_token', 'existing-login-token']]);
  globalThis.sessionStorage = { getItem: key => storage.get(key) ?? null, removeItem: key => storage.delete(key) } as any;
  let clicks = 0;
  let removed = 0;
  const filenames: string[] = [];
  globalThis.document = { body: { appendChild() {} }, createElement: () => ({ click() { clicks++; filenames.push(this.download); }, remove() { removed++; } }) } as any;
  const originalCreate = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;
  let revoked = 0;
  URL.createObjectURL = blob => { assert.ok(blob instanceof Blob); return 'blob:report'; };
  URL.revokeObjectURL = () => { revoked++; };
  try {
    assert.match(validateReportDates('', ''), /required/);
    assert.match(validateReportDates('2026-09-01', ''), /required/);
    assert.match(validateReportDates('', '2026-09-30'), /required/);
    assert.match(validateReportDates('2026-09-30', '2026-09-01'), /after/);
    assert.equal(validateReportDates('2026-09-01', '2026-09-01'), '');
    assert.match(validateReportDates('2026-02-30', '2026-09-30'), /valid/);
    for (const format of ['excel', 'pdf'] as const) {
      globalThis.fetch = async (url, options) => {
        assert.equal(String(url), `https://api.navapacksolutions.com/api/reports/export/${format}/?from_date=2026-09-01&to_date=2026-09-30`);
        assert.equal(options?.method, 'GET');
        assert.equal(options?.body, undefined);
        assert.equal(new Headers(options?.headers).get('Authorization'), 'Token existing-login-token');
        return new Response(new Blob(['binary-report']));
      };
      await downloadReport('2026-09-01', '2026-09-30', format);
    }
    assert.deepEqual(filenames, ['Navapack_Report_2026-09-01_to_2026-09-30.xlsx', 'Navapack_Report_2026-09-01_to_2026-09-30.pdf']);
    assert.equal(clicks, 2);
    assert.equal(removed, 2);
    for (const status of [400, 403, 500]) {
      globalThis.fetch = async () => new Response(new Blob([JSON.stringify({ detail: 'Export unavailable. Retry.' })]), { status });
      await assert.rejects(downloadReport('2026-09-01', '2026-09-30', 'pdf'), /Export unavailable/);
    }
    globalThis.fetch = async () => { throw new TypeError('Network unavailable'); };
    await assert.rejects(downloadReport('2026-09-01', '2026-09-30', 'pdf'), /Network unavailable/);
    globalThis.fetch = async () => new Response('binary');
    await downloadReport('2026-09-01', '2026-09-30', 'pdf');
    globalThis.fetch = async () => new Response('{}', { status: 401 });
    await assert.rejects(downloadReport('2026-09-01', '2026-09-30', 'pdf'), /session has expired/);
    assert.equal(storage.has('navapack_token'), false);
    await assert.rejects(downloadReport('2026-09-01', '2026-09-30', 'pdf'), /log in again/);
    await new Promise(resolve => setTimeout(resolve, 1100));
    assert.equal(revoked, 3);
  } finally {
    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
  }
});

test('modal loading, duplicate submission, failure retention and successful retry', async () => {
  // Exercise the actual component handlers with a minimal hook harness.
  const states: any[] = [];
  const refs: any[] = [];
  let cursor = 0;
  let refCursor = 0;
  let rejectRequest: (error: Error) => void;
  let resolveRequest: () => void;
  let calls = 0;
  let closes = 0;
  const harness = {
    createElement: (type: any, props: any, ...children: any[]) => ({ type, props: { ...props, children } }),
    useState: (initial: any) => { const index = cursor++; if (!(index in states)) states[index] = initial; return [states[index], (value: any) => { states[index] = value; }]; },
    useRef: (initial: any) => { const index = refCursor++; return refs[index] ??= { current: initial }; },
    useEffect() {},
    validateReportDates,
    downloadReport: () => { calls++; return new Promise<void>((resolve, reject) => { resolveRequest = resolve; rejectRequest = reject; }); },
  };
  (globalThis as any).__reportHarness = harness;
  const bundle = await build({ entryPoints: ['src/components/ReportDownloadModal.tsx'], bundle: true, write: false, format: 'esm', jsx: 'transform', tsconfigRaw: { compilerOptions: { jsx: 'react' } }, plugins: [{ name: 'test-harness', setup(plugin) {
    plugin.onResolve({ filter: /^(react|lucide-react)$|reportDownload$/ }, args => ({ path: args.path, namespace: 'harness' }));
    plugin.onLoad({ filter: /.*/, namespace: 'harness' }, args => ({ contents: args.path === 'react'
      ? 'const h=globalThis.__reportHarness; export default h; export const {useState,useRef,useEffect}=h;'
      : args.path === 'lucide-react' ? 'export const Download="icon", XCircle="icon";'
      : 'export const {downloadReport,validateReportDates}=globalThis.__reportHarness;' }));
  } }] });
  const { ReportDownloadModal } = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
  const render = () => { cursor = 0; refCursor = 0; return ReportDownloadModal({ onClose: () => { closes++; } }); };
  const nodes = (node: any): any[] => !node || typeof node !== 'object' ? [] : [node, ...(node.props?.children || []).flatMap(nodes)];
  const find = (tree: any, predicate: (node: any) => boolean) => nodes(tree).find(predicate);
  let tree = render();
  const submit = () => find(tree, node => node.type === 'form').props.onSubmit({ preventDefault() {} });
  await submit();
  assert.equal(calls, 0);
  tree = render();
  assert.match(find(tree, node => node.props?.role === 'alert').props.children.join(''), /required/);
  find(tree, node => node.props?.id === 'report-from-date').props.onChange({ target: { value: '2026-09-01' } });
  find(tree, node => node.props?.id === 'report-to-date').props.onChange({ target: { value: '2026-09-30' } });
  tree = render();
  const pending = submit();
  tree = render();
  assert.equal(find(tree, node => node.props?.type === 'submit').props.disabled, true);
  assert.equal(find(tree, node => node.props?.role === 'status').props.children[0], 'Downloading…');
  await submit();
  assert.equal(calls, 1);
  rejectRequest!(new Error('Backend export failed'));
  await pending;
  tree = render();
  assert.equal(closes, 0);
  assert.equal(find(tree, node => node.props?.type === 'submit').props.disabled, false);
  assert.match(find(tree, node => node.props?.role === 'alert').props.children.join(''), /Backend export failed/);
  const retry = submit();
  resolveRequest!();
  await retry;
  assert.equal(calls, 2);
  assert.equal(closes, 1);
  delete (globalThis as any).__reportHarness;
});

