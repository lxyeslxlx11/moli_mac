/** Build a standalone source-bound game API under local build/, without AppID, deployment or network activity. */
import { fileURLToPath } from 'node:url';
import { resolve,relative,sep } from 'node:path';
import { mkdir,readFile,writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import esbuild from '../build/dependencies/esbuild-0.25.12/node_modules/esbuild/lib/main.js';
const root=fileURLToPath(new URL('../',import.meta.url)),args=process.argv.slice(2);
if(args.length>2||args.length&&(args[0]!=='--outdir'||!args[1]))throw Error('Use --outdir <build subdirectory>.');
const parent=resolve(root,'build'),outdir=resolve(root,args[1]??'build/wechat-game');
const child=relative(parent,outdir);
if(!child||child==='..'||child.startsWith('..'+sep))throw Error('Output must be a child of local build/.');
if(esbuild.version!=='0.25.12')throw Error('Unexpected build-tool version.');
await mkdir(outdir,{recursive:true});
const result=await esbuild.build({absWorkingDir:root,entryPoints:['adapters/wechat/game.mjs'],outfile:resolve(outdir,'game.js'),
  bundle:true,platform:'neutral',format:'cjs',target:'es2020',treeShaking:true,minify:false,legalComments:'linked',metafile:true,logLevel:'silent'});
if(Object.values(result.metafile.outputs).some(v=>v.imports.length))throw Error('Standalone game bundle has external imports.');
const hash=b=>createHash('sha256').update(b).digest('hex'),bytes=await readFile(resolve(outdir,'game.js')),inputs=[];
for(const path of Object.keys(result.metafile.inputs).sort()){const b=await readFile(resolve(root,path));inputs.push({path,bytes:b.length,sha256:hash(b)});}
const report={tool:'esbuild',version:esbuild.version,format:'cjs',target:'es2020',profile:'legacy-se6000-37c4',
  bundle:{path:relative(root,resolve(outdir,'game.js')),bytes:bytes.length,sha256:hash(bytes)},external_imports:0,inputs,native_WeChat_or_official_acceptance:false,game_Page_implemented:false};
await writeFile(resolve(outdir,'build-report.json'),JSON.stringify(report,null,2)+'\n');
await writeFile(resolve(outdir,'metafile.json'),JSON.stringify(result.metafile,null,2)+'\n');
console.log(JSON.stringify({...report,inputs:inputs.length}));
