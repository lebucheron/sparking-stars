import {project,type WorldPoint} from '@rarefriends/friendsdk/world';
export type MovingRuby={home:number[];spots:number[][];rest:number;visit:number};
export function rubyState(r:MovingRuby,elapsed:number){
 const cycle=r.rest+r.visit,index=Math.floor(elapsed/cycle)%r.spots.length,phase=elapsed%cycle;
 const away=phase>=r.rest;
 const p=away?r.spots[index]:r.home;
 return {position:[p[0],p[1]] as WorldPoint,away};
}
/** Same footprint as the former 0.7-scale SDK crystal, plus the Friend's radius. */
export function rubyAllows(r:MovingRuby|undefined,elapsed:number,from:WorldPoint,to:WorldPoint){
 if(!r)return true;
 const {position:[x,y]}=rubyState(r,elapsed),w=26.6,h=15.5;
 const inside=(p:WorldPoint)=>Math.abs(p[0]-x)<w&&Math.abs(p[1]-y)<h;
 if(inside(from))return Math.hypot(to[0]-x,to[1]-y)>Math.hypot(from[0]-x,from[1]-y);
 let enter=0,exit=1;
 for(const [a,b,min,max]of [[from[0],to[0],x-w,x+w],[from[1],to[1],y-h,y+h]]){
  const d=b-a;if(Math.abs(d)<1e-10){if(a<min||a>max)return true;continue;}
  const t1=(min-a)/d,t2=(max-a)/d;enter=Math.max(enter,Math.min(t1,t2));exit=Math.min(exit,Math.max(t1,t2));
 }
 return enter>exit;
}
export function drawMovingRuby(ctx:CanvasRenderingContext2D,r:MovingRuby|undefined,elapsed:number){
 if(!r)return;
 const state=rubyState(r,elapsed),[x,y]=project(...state.position);
 ctx.canvas.dataset.rubyX=String(state.position[0]);ctx.canvas.dataset.rubyY=String(state.position[1]);ctx.canvas.dataset.rubyAway=String(state.away);
 ctx.save();
 ctx.fillStyle='#342c3655';ctx.beginPath();ctx.ellipse(x,y,27,12,0,0,Math.PI*2);ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#3a2935';
 for(const [dx,dy,height,width]of [[-19,-2,36,15],[0,0,65,23],[21,-1,43,14]]){
  ctx.beginPath();ctx.moveTo(x+dx-width/2,y+dy);ctx.lineTo(x+dx-width/2,y+dy-height+14);ctx.lineTo(x+dx,y+dy-height);ctx.lineTo(x+dx+width/2,y+dy-height+14);ctx.lineTo(x+dx+width/2,y+dy);ctx.closePath();ctx.fillStyle='#91727f';ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+dx,y+dy-height);ctx.lineTo(x+dx,y+dy);ctx.lineTo(x+dx+width/2,y+dy-height+14);ctx.stroke();
 }
 ctx.restore();
}
