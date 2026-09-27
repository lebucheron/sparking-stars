
import type {WorldPoint} from '@rarefriends/friendsdk/world';
export type Ghost={ms:number;points:readonly (readonly [number,number,number])[]};
export function ghostKey(friend:string,gen:number,mode:string,equipment:string,rules:string){return [friend,gen,mode,equipment,rules].join(':');}
export function makeGhost(points:readonly number[][]):Ghost|null{
 if(points.length<2||points.length>40000)return null;
 const end=points.at(-1)!;if(end[0]<1000||end[0]>600000)return null;
 const kept:[number,number,number][]=[];let last=-1;
 for(let i=0;i<points.length;i++){
  const row=points[i];if(row.length!==3||!row.every(Number.isFinite)||row[0]<=last)return null;
  if(i===0&&row[0]!==0)return null;last=row[0];
  if(i===0||i===points.length-1||row[0]-kept.at(-1)![0]>=33)kept.push([row[0],row[1],row[2]]);
 }
 return {ms:Math.round(end[0]),points:kept};
}
export function sampleGhost(ghost:Ghost|null,time:number):{position:WorldPoint;previous:WorldPoint;time:number}|null{
 if(!ghost||!Number.isFinite(time)||time<0||time>ghost.points.at(-1)![0])return null;
 let low=0,high=ghost.points.length-1;
 while(low+1<high){const mid=(low+high)>>1;if(ghost.points[mid][0]<=time)low=mid;else high=mid;}
 const a=ghost.points[low],b=ghost.points[high],t=Math.max(0,Math.min(1,(time-a[0])/(b[0]-a[0])));
 return {position:[a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t],previous:[a[1],a[2]],time};
}
export function betterGhost(previous:Ghost|undefined,next:Ghost|null){return next&&(!previous||next.ms<previous.ms)?next:previous;}
