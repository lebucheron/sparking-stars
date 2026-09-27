
import {createWorldNavigator} from '@rarefriends/friendsdk/navigation';
import type {WorldConfig,WorldPoint} from '@rarefriends/friendsdk/world';
// Clicks aim along a ray; they never ask the navigator to choose a detour.
export function createDirectClick(world:WorldConfig){
 const navigation=createWorldNavigator(world,7);
 return (from:WorldPoint,to:WorldPoint):{target:WorldPoint;blocked:boolean}=>{
  if(![...from,...to].every(Number.isFinite))return {target:from,blocked:true};
  const length=Math.hypot(to[0]-from[0],to[1]-from[1]);
  if(length>2000)return {target:from,blocked:true};
  if(navigation.segmentClear(from,to))return {target:to,blocked:false};
  const steps=Math.max(1,Math.ceil(length));let previous=from;
  for(let i=1;i<=steps;i++){
   const t=i/steps,point:WorldPoint=[from[0]+(to[0]-from[0])*t,from[1]+(to[1]-from[1])*t];
   if(!navigation.segmentClear(previous,point))break;
   previous=point;
  }
  if(!navigation.segmentClear(from,previous))return {target:from,blocked:true};
  return {target:previous,blocked:true};
 };
}
