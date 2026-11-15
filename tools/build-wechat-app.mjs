/** Generate only the explicit local WeChat host project under build/. No upload or IDE settings. */
import { fileURLToPath } from 'node:url';
import { resolve, relative, sep } from 'node:path';
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import esbuild from '../build/dependencies/esbuild-0.25.12/node_modules/esbuild/lib/main.js';
import { snapshotWeChatLauncherHostConfig } from '../adapters/wechat/launcher-host.mjs';
import { snapshotWeChatGameConfig } from '../adapters/wechat/legacy-game-materials.mjs';

const root = fileURLToPath(new URL('../', import.meta.url)), args = process.argv.slice(2);
let configPath = resolve(root, 'wechat/runtime-config.json'), gameConfigPath = null, outdir = resolve(root, 'build/wechat-app');
for (let at = 0; at < args.length; at += 2) {
  if (!args[at + 1] || !['--config','--game-config','--outdir'].includes(args[at])) throw new Error('Use --config <JSON>, --game-config <JSON>, and --outdir <build subdirectory>.');
  if (args[at] === '--config') configPath = resolve(args[at + 1]);
  else if (args[at] === '--game-config') gameConfigPath = resolve(args[at + 1]);
  else outdir = resolve(args[at + 1]);
}
const within = relative(resolve(root, 'build'), outdir);
if (!within || within === '..' || within.startsWith('..' + sep)) throw new Error('Output must be under local build/.');
if (esbuild.version !== '0.25.12') throw new Error('Unexpected local build tool.');
const config = JSON.parse(await readFile(configPath, 'utf8'));
snapshotWeChatLauncherHostConfig(config); // Validates exact fields; credentials and unknown settings are rejected.
const gameConfigBytes = gameConfigPath===null ? null : await readFile(gameConfigPath);
const gameConfig = snapshotWeChatGameConfig(gameConfigBytes===null ? null : JSON.parse(gameConfigBytes.toString('utf8')));
const files = ['app.js','app.json','lifecycle.js','project.config.json','pages/launcher/index.js',
  'pages/launcher/index.json','pages/launcher/index.wxml','pages/launcher/index.wxss',
  'game/pages/play/index.js','game/pages/play/index.json','game/pages/play/index.wxml','game/pages/play/index.wxss',
  'game/pages/play/craft.wxml','game/pages/play/inventory.wxml','game/pages/play/shop.wxml','game/pages/play/services.wxml',
  'game/pages/play/bank.wxml','game/pages/play/trade.wxml','game/pages/play/family.wxml',
  'game/pages/play/family-pet.wxml','game/pages/play/board.wxml'];
for (const name of files) { await mkdir(resolve(outdir, name, '..'), { recursive: true }); await copyFile(resolve(root, 'wechat', name), resolve(outdir, name)); }
await mkdir(resolve(outdir, 'lib'), { recursive: true });
const common = { absWorkingDir: root, bundle: true, format: 'cjs', platform: 'neutral', target: 'es2020',
  treeShaking: true, legalComments: 'linked', metafile: true, logLevel: 'silent' };
const [launcher, game] = await Promise.all([
  esbuild.build({ ...common, entryPoints: ['adapters/wechat/launcher-host.mjs'], outfile: resolve(outdir, 'lib/launcher.js') }),
  esbuild.build({ ...common, entryPoints: ['adapters/wechat/legacy-game-host.mjs'], outfile: resolve(outdir, 'game/lib/play.js'), minify: true }),
]);
const metafile = {inputs:{...launcher.metafile.inputs,...game.metafile.inputs},outputs:{...launcher.metafile.outputs,...game.metafile.outputs}};
if (Object.values(metafile.outputs).some(value => value.imports.length)) throw new Error('Unexpected external import.');
await writeFile(resolve(outdir, 'runtime-config.js'), 'module.exports = ' + JSON.stringify(config) + '\n');
await writeFile(resolve(outdir, 'game/runtime-config.js'), 'module.exports = ' + JSON.stringify(gameConfig) + '\n');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const outputPaths = [...files, 'runtime-config.js','game/runtime-config.js', ...Object.keys(metafile.outputs).map(name => relative(outdir, resolve(root, name)))];
const outputs = [];
for (const name of outputPaths) { const bytes = await readFile(resolve(outdir, name)); outputs.push({ path: name, bytes: bytes.length, sha256: sha(bytes) }); }
const inputs = [];
for (const name of [...files.map(name => 'wechat/' + name), ...Object.keys(metafile.inputs)].sort()) {
  const bytes = await readFile(resolve(root, name)); inputs.push({ path: name, bytes: bytes.length, sha256: sha(bytes) });
}
const configBytes = await readFile(configPath);
const packageBytes = {main:0,game:0};
for (const file of outputs) packageBytes[file.path.startsWith('game/')?'game':'main'] += file.bytes;
const report = { schema: 'moli.wechat-host-build.v1', tool: 'esbuild0.25.12', output: relative(root, outdir),
  config: { path: relative(root, configPath), bytes: configBytes.length, sha256: sha(configBytes), configured: config !== null },
  gameConfig: gameConfigBytes===null ? {configured:false} : {path:relative(root,gameConfigPath),bytes:gameConfigBytes.length,sha256:sha(gameConfigBytes),configured:gameConfig!==null},
  packageBytes, game_Page_implemented: true,
  inputs, outputs, external_imports: 0, native_WeChat_or_official_acceptance: false };
await writeFile(resolve(outdir, 'build-report.json'), JSON.stringify(report, null, 2) + '\n');
await writeFile(resolve(outdir, 'metafile.json'), JSON.stringify(metafile, null, 2) + '\n');
console.log(JSON.stringify({ output: report.output, inputs: inputs.length, outputs: outputs.length,
  packageBytes, configured: config !== null, gameConfigured: gameConfig!==null, external_imports: 0 }));
