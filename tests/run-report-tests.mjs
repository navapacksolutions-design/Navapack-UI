import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { unlinkSync } from 'node:fs';

const outfile = 'tests/.reportDownload.test.mjs';
try {
  await build({ entryPoints: ['tests/reportDownload.test.ts'], bundle: true, platform: 'node', format: 'esm', external: ['esbuild'], outfile });
  const result = spawnSync(process.execPath, ['--test', outfile], { stdio: 'inherit' });
  process.exitCode = result.status ?? 1;
} finally {
  unlinkSync(outfile);
}
