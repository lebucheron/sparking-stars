
import {build} from 'esbuild';
import {buildGame} from '@rarefriends/friendsdk/build';
await import('./build-sparking-server.mjs');
const outdir=process.argv[2]||'build-public';
await buildGame('games/sparking-stars',{outdir});
await build({entryPoints:['host/leaderboard-host.tsx'],bundle:true,format:'iife',platform:'browser',target:'es2022',jsx:'automatic',minify:true,define:{'process.env.NODE_ENV':'"production"'},loader:{'.png':'file','.svg':'file','.webp':'file'},assetNames:'assets/[name]-[hash]',outfile:outdir+'/runtime.js'});
console.log('Public beta built:',outdir);
