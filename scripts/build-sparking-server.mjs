
import {build} from 'esbuild';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const inputs=await Promise.all(['games/sparking-stars/terrains.json','server/validation.ts','dist/movement.js','dist/friend-world.js','dist/friend-navigation.js'].map(p=>readFile(p)));
const version='race-'+createHash('sha256').update(Buffer.concat(inputs)).digest('hex').slice(0,16);
await writeFile('games/sparking-stars/rules-version.ts',`// Generated from geometry, validation and SDK physics.\nexport const RULES=${JSON.stringify(version)};\n`);
await build({entryPoints:['server/validation.ts'],bundle:true,platform:'neutral',format:'esm',target:'es2022',outfile:'supabase/functions/sparking-api/validation.js'});
console.log('Rules:',version);
