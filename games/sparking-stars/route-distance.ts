import type {WorldPoint} from '@rarefriends/friendsdk/world';
// Routes are immutable: prepare their segments once, rather than allocate an array
// and recompute vectors each time the renderer checks the road boundary.
const segmentCache=new WeakMap<readonly WorldPoint[],{x:number;y:number;dx:number;dy:number;length2:number}[]>();
export function distanceToRoute(point:WorldPoint,route:readonly WorldPoint[]){
 let segments=segmentCache.get(route);
 if(!segments){segments=route.map((a,i)=>{const b=route[(i+1)%route.length],dx=b[0]-a[0],dy=b[1]-a[1];return {x:a[0],y:a[1],dx,dy,length2:dx*dx+dy*dy};});segmentCache.set(route,segments);}
 let best=Infinity;
 for(const {x,y,dx,dy,length2}of segments){const t=Math.max(0,Math.min(1,((point[0]-x)*dx+(point[1]-y)*dy)/length2));best=Math.min(best,Math.hypot(point[0]-x-t*dx,point[1]-y-t*dy));}
 return best;
}
