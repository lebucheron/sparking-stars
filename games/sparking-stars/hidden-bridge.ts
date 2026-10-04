import {project} from '@rarefriends/friendsdk/world';
export type HiddenBridge={star:number;period:number;visible:number;basin:number[]};
export const bridgeVisible=(bridge:HiddenBridge|undefined,elapsed:number)=>!bridge||elapsed%bridge.period<bridge.visible;
/** Visual mask only: the physical bridge and its collectible never change. */
export function drawHiddenBridge(ctx:CanvasRenderingContext2D,bridge:HiddenBridge|undefined,elapsed:number){
 if(!bridge)return;
 const visible=bridgeVisible(bridge,elapsed);ctx.canvas.dataset.bridgeVisible=String(visible);ctx.canvas.dataset.bridgeStarVisible=String(visible);
 if(visible)return;
 const [x,y,w,h]=bridge.basin;ctx.save();ctx.beginPath();[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].forEach((p,i)=>{const [px,py]=project(p[0],p[1]);if(i)ctx.lineTo(px,py);else ctx.moveTo(px,py);});ctx.closePath();ctx.fillStyle='#000';ctx.fill();ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.stroke();ctx.restore();
}
