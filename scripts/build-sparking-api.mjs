import {readFile,writeFile} from 'node:fs/promises';
const source=(await readFile('supabase/functions/sparking-api/index.ts','utf8')).replace(/\r\n/g,'\n');
const helper=(await readFile('server/control-validation.ts','utf8')).trimEnd().replace('export function','function');
const code=source.replace("import {resolveRaceControls} from '../../../server/control-validation.ts';",helper);
let hash=2166136261;for(const ch of code)hash=Math.imul(hash^ch.charCodeAt(0),16777619);
await writeFile('../../outputs/sparking-api-deployed.ts',code);
console.log({characters:code.length,hash:hash>>>0});
