export type Cosmetic="none"|"helmet"|"cap"|"antenna"|"crown"|"halo"|"cometcap"|"eclipse";
export const cosmetics=[{id:"none",name:"Au naturel",description:"Ton Friend original."},{id:"helmet",name:"Casque damier",description:"Prêt pour la pole position."},{id:"cap",name:"Casquette du paddock",description:"La visière des jours de course."},{id:"antenna",name:"Antenne étoile",description:"Un peu sérieux, un peu cosmique."}] as const;
// Pure drawing: no changes to movement, collision, rewards or the NFT sprite.
export function drawCosmetic(c:CanvasRenderingContext2D,id:Cosmetic,x:number,y:number){
 if(id==="none")return;
 c.save();c.fillStyle="#fff";c.strokeStyle="#000";c.lineWidth=3;c.lineJoin="round";
 if(id==="crown"){
  c.beginPath();c.moveTo(x-27,y+4);c.lineTo(x-30,y-24);c.lineTo(x-14,y-12);c.lineTo(x,y-34);c.lineTo(x+14,y-12);c.lineTo(x+30,y-24);c.lineTo(x+27,y+4);c.closePath();c.fill();c.stroke();c.fillStyle="#000";c.fillRect(x-25,y-3,50,6);
 }else if(id==="halo"){
  c.beginPath();c.ellipse(x,y-26,30,9,-.15,0,Math.PI*2);c.stroke();c.beginPath();c.ellipse(x,y-26,23,5,-.15,0,Math.PI*2);c.stroke();c.fillStyle="#000";c.fillRect(x+24,y-37,6,6);
 }else if(id==="cometcap"){
  c.beginPath();c.arc(x,y,28,Math.PI,0);c.lineTo(x+35,y+4);c.lineTo(x-30,y+4);c.closePath();c.fill();c.stroke();c.beginPath();c.moveTo(x-20,y-18);c.lineTo(x+7,y-8);c.moveTo(x-22,y-11);c.lineTo(x+7,y-8);c.stroke();c.fillStyle="#000";c.font="bold 23px monospace";c.fillText("✦",x+3,y-4);
 }else if(id==="eclipse"){
  for(const dx of [-22,22]){c.beginPath();c.arc(x+dx,y-15,15,0,Math.PI*2);c.fill();c.stroke();c.fillStyle="#000";c.beginPath();c.arc(x+dx+5,y-18,10,0,Math.PI*2);c.fill();c.fillStyle="#fff";}c.beginPath();c.moveTo(x-28,y+6);c.quadraticCurveTo(x,y-12,x+28,y+6);c.stroke();
 }else if(id==="helmet"){
  c.beginPath();c.moveTo(x-31,y+9);c.lineTo(x-31,y-5);c.quadraticCurveTo(x-28,y-32,x,y-32);c.quadraticCurveTo(x+28,y-32,x+31,y-5);c.lineTo(x+31,y+9);c.closePath();c.fill();c.stroke();
  c.fillStyle="#000";for(let i=-2;i<=2;i++)for(let j=0;j<2;j++)if((i+j)%2===0)c.fillRect(x+i*8-4,y-16+j*8,8,8);
  c.fillRect(x-35,y+3,70,6);
 }else if(id==="cap"){
  c.beginPath();c.moveTo(x-27,y+5);c.lineTo(x-27,y-8);c.quadraticCurveTo(x,y-34,x+27,y-8);c.lineTo(x+27,y+5);c.closePath();c.fill();c.stroke();
  c.fillStyle="#000";c.fillRect(x-30,y+3,76,7);c.fillRect(x-4,y-14,8,10);
 }else{
  c.beginPath();c.moveTo(x-24,y+6);c.quadraticCurveTo(x,y-12,x+24,y+6);c.stroke();
  c.beginPath();c.moveTo(x,y);c.lineTo(x,y-25);c.stroke();
  c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?6:14;const px=x+Math.cos(a)*r,py=y-37+Math.sin(a)*r;i?c.lineTo(px,py):c.moveTo(px,py);}c.closePath();c.fill();c.stroke();
 }
 c.restore();
}

export type Trail="none"|"stars"|"checks"|"comets"|"orbits";
export const trails=[{id:"none",name:"Sans sillage",symbol:"○"},{id:"stars",name:"Poussière d’étoiles",symbol:"✦"},{id:"checks",name:"Confettis damier",symbol:"▦"}] as const;
export function drawTrail(c:CanvasRenderingContext2D,id:Trail,x:number,y:number,size:number){
 c.save();c.translate(x,y);c.fillStyle="#fff";c.strokeStyle="#000";c.lineWidth=1.5;
 if(id==="orbits"){c.beginPath();c.ellipse(0,0,size,size*.55,-.4,0,Math.PI*2);c.stroke();c.fillStyle="#000";c.fillRect(size-2,-3,4,4);}
 else if(id==="comets"){c.beginPath();c.moveTo(-size*2,-size);c.lineTo(0,0);c.moveTo(-size*2,0);c.lineTo(0,0);c.stroke();c.beginPath();c.arc(0,0,size*.5,0,Math.PI*2);c.fill();c.stroke();}
 else if(id==="stars"){c.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,r=i%2?size*.28:size;const px=Math.cos(a)*r,py=Math.sin(a)*r;i?c.lineTo(px,py):c.moveTo(px,py);}c.closePath();c.fill();c.stroke();}
 else if(id==="checks"){c.fillRect(-size,-size,size*2,size*2);c.strokeRect(-size,-size,size*2,size*2);c.fillStyle="#000";c.fillRect(-size,-size,size,size);c.fillRect(0,0,size,size);}
 c.restore();
}
