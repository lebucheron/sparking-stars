type StoragePort=Pick<Storage,'getItem'|'setItem'>;
export type HalloweenProgress={wins:number;unlocked:boolean;equipped:boolean;saved?:boolean};
type Record={version:1;wins:number;equipped:boolean;ids:string[]};
const session=new Map<string,Record>();
/** A local cosmetic souvenir, scoped to the current wallet and Friend. */
export function halloweenStore(storage:StoragePort,wallet:string,friend:string){
 const key=`sparking:halloween:v1:${wallet.toLowerCase()}:${friend}`;
 const empty=():Record=>({version:1,wins:0,equipped:false,ids:[]});
 function read():Record{
  if(session.has(key))return structuredClone(session.get(key)!);
  try{const raw=storage.getItem(key);if(!raw||raw.length>10000)return empty();const d=JSON.parse(raw);
   if(d.version!==1||!Number.isSafeInteger(d.wins)||d.wins<0||d.wins>3||typeof d.equipped!=='boolean'||!Array.isArray(d.ids)||d.ids.length>16||d.ids.some((id:unknown)=>typeof id!=='string'||!id.length||id.length>100))return empty();
   return {...d,equipped:d.wins===3&&d.equipped};
  }catch{return empty();}
 }
 const progress=(d:Record):HalloweenProgress=>({wins:d.wins,unlocked:d.wins===3,equipped:d.wins===3&&d.equipped});
 function save(d:Record){try{storage.setItem(key,JSON.stringify(d));session.delete(key);return true;}catch{session.set(key,structuredClone(d));return false;}}
 return {
  read:()=>({...progress(read()),saved:!session.has(key)}),
  complete(id:unknown,ms:unknown){
   if(typeof id!=='string'||!id.length||id.length>100||typeof ms!=='number'||!Number.isFinite(ms)||ms<1000)throw Error('Arrivée Halloween incorrecte.');
   const d=read();if(d.ids.includes(id))return {...progress(d),earned:false,saved:!session.has(key)};
   const earned=d.wins===2;d.wins=Math.min(3,d.wins+1);if(earned)d.equipped=true;d.ids=[...d.ids,id].slice(-16);
   return {...progress(d),earned,saved:save(d)};
  },
  equip(value:unknown){const d=read();if(typeof value!=='boolean'||d.wins!==3)throw Error('Termine trois courses Halloween pour porter ce chapeau.');d.equipped=value;return {...progress(d),saved:save(d)};}
 };
}
