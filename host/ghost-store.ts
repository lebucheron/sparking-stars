import {makeGhost,betterGhost,ghostKey,type Ghost} from '../games/sparking-stars/ghost';

type StoragePort=Pick<Storage,'getItem'|'setItem'>;
const MAX_BYTES=2_000_000;
const category=(gen:unknown,mode:unknown,equipment:unknown)=>Number.isInteger(gen)&&Number(gen)>=1&&Number(gen)<=6&&['training','ranked'].includes(String(mode))&&['feet','rollers','kart'].includes(String(equipment));
function validate(value:unknown):Ghost|null {
 if(!value||typeof value!=='object')return null;
 const g=value as Ghost;
 if(!Array.isArray(g.points)||g.points.length>40000||g.points.some(p=>!Array.isArray(p)||p.length!==3||!p.every(Number.isFinite)||p[1]<0||p[1]>576||p[2]<0||p[2]>384))return null;
 const copy=makeGhost(g.points.map(p=>[...p]));
 return copy&&copy.ms===g.ms?copy:null;
}
/** Local visual replays only. These records never authorize play or enter public rankings. */
export function personalGhostStore(storage:StoragePort,wallet:string,friend:string,rules:string){
 const storageKey=`sparking:personal-ghost:v1:${wallet.toLowerCase()}:${friend}:${rules}`;
 function read():Record<string,Ghost>{
  const result:Record<string,Ghost>={};
  try{
   const raw=storage.getItem(storageKey);if(!raw||raw.length>MAX_BYTES)return result;
   const saved=JSON.parse(raw);if(!saved||saved.version!==1||!saved.ghosts||typeof saved.ghosts!=='object')return result;
   for(const [key,value]of Object.entries(saved.ghosts).slice(-72)){
    if(key.split(':').length!==6)continue;
    const [id,gen,mode,gear,version,controls]=key.split(':');
    if(id!==friend||version!==rules||!category(Number(gen),mode,gear)||!['touch','desktop'].includes(controls))continue;
    const ghost=validate(value);if(ghost)result[key]=ghost;
   }
  }catch{/* Missing, blocked or damaged browser storage never blocks a race. */}
  return result;
 }
 function save(gen:unknown,mode:unknown,equipment:unknown,value:unknown,controls:unknown){
  if(!['touch','desktop'].includes(String(controls)))throw new Error('Commandes incorrectes.');
  if(!category(gen,mode,equipment))throw new Error('Catégorie de fantôme incorrecte.');
  const ghost=validate(value);if(!ghost)throw new Error('Parcours de fantôme incorrect.');
  const records=read(),key=ghostKey(friend,Number(gen),String(mode),String(equipment),rules,String(controls));
  const best=betterGhost(records[key],ghost)!;
  delete records[key];records[key]=best;
  let raw=JSON.stringify({version:1,ghosts:records});
  while(raw.length>MAX_BYTES&&Object.keys(records).length>1){delete records[Object.keys(records)[0]];raw=JSON.stringify({version:1,ghosts:records});}
  try{storage.setItem(storageKey,raw);return {saved:true,ghost:best};}catch{return {saved:false,ghost:best};}
 }
 return {read,save};
}
