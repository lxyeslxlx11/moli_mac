/** Build the explicit WeChat session entry; all generated files remain under local build/. */
import { fileURLToPath } from 'node:url';
import { resolve, relative, sep } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import esbuild from '../build/dependencies/esbuild-0.25.12/node_modules/esbuild/lib/main.js';

const root = fileURLToPath(new URL('../', import.meta.url)), args = process.argv.slice(2);
if (args.length > 2 || args.length && (args[0] !== '--outdir' || !args[1])) throw new Error('Use --outdir <build subdirectory>.');
const outdir = resolve(root, args[1] ?? 'build/wechat-launcher'), parent = resolve(root, 'build');
if (!relative(parent, outdir) || relative(parent, outdir).startsWith('..' + sep) || relative(parent, outdir) === '..') throw new Error('Output must be a child of local build/.');
if (esbuild.version !== '0.25.12') throw new Error('Unexpected build-tool version.');
await mkdir(outdir, { recursive: true });
const result = await esbuild.build({ absWorkingDir: root, entryPoints: ['adapters/wechat/launcher.mjs'],
  outfile: resolve(outdir, 'launcher.js'), bundle: true, platform: 'neutral', format: 'cjs', target: 'es2020',
  treeShaking: true, minify: false, legalComments: 'linked', metafile: true, logLevel: 'silent' });
if (Object.values(result.metafile.outputs).some(value => value.imports.length)) throw new Error('Standalone bundle has external imports.');
const bytes = await readFile(resolve(outdir, 'launcher.js'));
const inputs = [];
for (const path of Object.keys(result.metafile.inputs).sort()) {
  const value = await readFile(resolve(root, path));
  inputs.push({ path, bytes: value.length, sha256: createHash('sha256').update(value).digest('hex') });
}
const report = { tool: 'esbuild', version: esbuild.version, format: 'cjs', target: 'es2020',
  bundle: { path: relative(root, resolve(outdir, 'launcher.js')), bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex') },
  external_imports: 0, inputs, native_WeChat_or_official_acceptance: false };
await writeFile(resolve(outdir, 'build-report.json'), JSON.stringify(report, null, 2) + '\n');
await writeFile(resolve(outdir, 'metafile.json'), JSON.stringify(result.metafile, null, 2) + '\n');
console.log(JSON.stringify({ ...report, inputs: inputs.length }));
