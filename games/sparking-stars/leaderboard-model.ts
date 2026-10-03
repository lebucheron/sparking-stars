import type {Equipment,Bonus} from "./shop-model";
import type {Controls} from "./controls";
export type Lap={controls?:Controls;id:number;friendId:string;gen:number;mode:"training"|"free";equipment:Equipment;tier:number;bonus:Bonus;ms:number;finishedAt:number};
export type Period="day"|"week"|"month"|"session";
export const preciseTime=(ms:number)=>(Math.round(ms)/1000).toFixed(3)+" s";
export function periodStart(period:Period,now:number){
 const d=new Date(now);if(period==="session")return 0;
 d.setUTCHours(0,0,0,0);
 if(period==="week")d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));
 if(period==="month")d.setUTCDate(1);
 return d.getTime();
}
export function rankLaps(laps:Lap[]){
 const best=new Map<string,Lap>();
 for(const lap of laps){const old=best.get(lap.friendId);if(!old||lap.ms<old.ms)best.set(lap.friendId,lap);}
 const sorted=[...best.values()].sort((a,b)=>a.ms-b.ms||a.friendId.localeCompare(b.friendId));
 let rank=0;return sorted.map((lap,i)=>{if(i===0||lap.ms!==sorted[i-1].ms)rank=i+1;return {...lap,rank,gap:lap.ms-sorted[0].ms};});
}
