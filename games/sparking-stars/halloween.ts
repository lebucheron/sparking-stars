import {getWorldPreset,validateWorld,type WorldPoint} from '@rarefriends/friendsdk/world';
export const hauntedRoute:WorldPoint[]=[[100,280],[100,100],[240,100],[380,100],[480,200],[380,280]];
export const hauntedRoad:WorldPoint[]=[...hauntedRoute,[330,280],[315,310],[220,310],[205,280],hauntedRoute[0]];
export const hauntedGraves=[[190,185,60,45],[400,240,30,35]] as const;
export const secret:WorldPoint=[285,145],curse:WorldPoint=[285,100],returnPoint:WorldPoint=[...hauntedRoute[0]];
export const hauntedWorld=validateWorld({...getWorldPreset('01-garden-oval-complete'),id:'sparking-halloween-v1',name:'La boucle hantée',actors:[],signals:[],missingChunks:[],geometry:{polygons:[[[60,60],[500,60],[520,80],[520,305],[500,325],[80,325],[60,305]]],holes:[[[245,255],[300,255],[300,290],[245,290]]],depth:24},paths:[{points:hauntedRoad,width:34}],patches:[],props:[],collision:{blocked:hauntedGraves.map(([x,y,w,h])=>({x,y,w,h}))}});
export function hauntedPassage(point:WorldPoint,next:number,escaped:boolean,previous:WorldPoint=point){
 if(next!==3||escaped)return 'none';
 const crossed=(target:WorldPoint,radius:number)=>{const dx=point[0]-previous[0],dy=point[1]-previous[1],length=dx*dx+dy*dy;const at=length?Math.max(0,Math.min(1,((target[0]-previous[0])*dx+(target[1]-previous[1])*dy)/length)):0;return Math.hypot(previous[0]+at*dx-target[0],previous[1]+at*dy-target[1])<radius;};
 if(crossed(secret,19))return 'secret';
 // Swept detection catches low-FPS crossings; reaching the next star cannot bypass the secret.
 if(crossed(curse,24)||Math.hypot(point[0]-hauntedRoute[3][0],point[1]-hauntedRoute[3][1])<22)return 'curse';
 return 'none';
}
