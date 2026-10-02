import {validateGhost,personalGhostStore} from './ghost-store';
import {completeQuest,emptyQuests,type QuestState} from '../games/sparking-stars/quests';
import {ghostKey,type Ghost} from '../games/sparking-stars/ghost';
type StoragePort=Pick<Storage,'getItem'|'setItem'>;
const session=new Map<string,Record<string,QuestState>>();
// Personal badges only: no public score, inventory, currency or access is granted.
export function questStore(storage:StoragePort,wallet:string,friend:string,rules:string){
 const key=`sparking:quests:v1:${wallet.toLowerCase()}:${friend}:${rules}`;
 const validKey=(k:string)=>{const parts=k.split(':');return parts.length===6&&parts[0]===friend&&parts[4]===rules&&/^[1-6]$/.test(parts[1])&&['training','ranked'].includes(parts[2])&&['feet','rollers','kart'].includes(parts[3])&&['touch','desktop'].includes(parts[5]);};
 const sparse=(g:Ghost):Ghost=>({...g,points:g.points.filter((p,i,a)=>i===0||i===a.length-1||p[0]-a[i-1][0]>=250||Math.floor(p[0]/250)!==Math.floor(a[i-1][0]/250))});
 function read():Record<string,QuestState>{
  if(session.has(key))return session.get(key)!;
  const out:Record<string,QuestState>={};try{const raw=storage.getItem(key);if(!raw||raw.length>2_000_000)return out;const data=JSON.parse(raw);if(data.version!==1)return out;
   for(const [k,value]of Object.entries(data.categories??{}).slice(-72)){const s=value as QuestState;if(!validKey(k)||!s||!Number.isSafeInteger(s.laps)||s.laps<0||!Number.isSafeInteger(s.near)||s.near<0||s.near>2||!Number.isSafeInteger(s.wins)||s.wins<0||typeof s.beaten!=='boolean'||typeof s.last!=='string'||s.last.length>100||!(s.best===null||Number.isFinite(s.best)&&s.best>=1000&&s.best<=600000)||!Array.isArray(s.recent)||s.recent.length>5)continue;
    const recent=s.recent.map(validateGhost),target=s.target===null?null:validateGhost(s.target);if(recent.some(g=>!g)||s.target!==null&&!target)continue;out[k]={...s,recent:recent as Ghost[],target};
   }
  }catch{}return out;
 }
 function complete(gen:unknown,mode:unknown,gear:unknown,controls:unknown,ghost:unknown,id:unknown){
  const k=ghostKey(friend,Number(gen),String(mode),String(gear),rules,String(controls)),g=validateGhost(ghost);if(!validKey(k)||!g||typeof id!=='string'||!id.length||id.length>100)throw Error('Tour de quête incorrect.');
  const categories=read(),initial={...emptyQuests(),best:personalGhostStore(storage,wallet,friend,rules).read()[k]?.ms??null},result=completeQuest(categories[k]??initial,sparse(g),id);delete categories[k];categories[k]=result.state;
  let raw=JSON.stringify({version:1,categories});while(raw.length>2_000_000&&Object.keys(categories).length>1){delete categories[Object.keys(categories)[0]];raw=JSON.stringify({version:1,categories});}
  try{if(raw.length>2_000_000)throw Error('Quota');storage.setItem(key,raw);session.delete(key);return {...result,saved:true};}catch{session.set(key,categories);return {...result,saved:false};}
 }
 return {read,complete};
}
