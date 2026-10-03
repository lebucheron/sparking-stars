import {getWorldPreset,validateWorld,type WorldPoint} from '@rarefriends/friendsdk/world';
export const hauntedRoute:WorldPoint[]=[[100,280],[100,100],[240,100],[380,100],[480,200],[380,280]];
export const secret:WorldPoint=[310,145],curse:WorldPoint=[310,100],returnPoint:WorldPoint=[240,100];
export const hauntedWorld=validateWorld({...getWorldPreset('01-garden-oval-complete'),id:'sparking-halloween-v1',name:'La boucle hantée',actors:[],signals:[],missingChunks:[],geometry:{polygons:[[[60,60],[520,60],[520,325],[60,325]]],holes:[],depth:24},paths:[{points:[...hauntedRoute,hauntedRoute[0]],width:34}],patches:[],props:[],collision:{blocked:[{x:190,y:185,w:60,h:45},{x:400,y:240,w:30,h:35}]}});
export function hauntedPassage(point:WorldPoint,next:number,escaped:boolean){
 if(next!==3||escaped)return 'none';
 if(Math.hypot(point[0]-secret[0],point[1]-secret[1])<19)return 'secret';
 if(Math.hypot(point[0]-curse[0],point[1]-curse[1])<20)return 'curse';
 return 'none';
}
