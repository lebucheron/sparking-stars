import {useEffect,useRef,useState} from "react";
import {spriteFrame} from "@rarefriends/friendsdk/sprites";
import {friendArt} from './friend-art';
import {drawCosmetic,type Cosmetic} from "./cosmetics";
export function PilotPortrait({friendId,cosmetic}:{friendId:bigint;cosmetic:Cosmetic}){
 const canvas=useRef<HTMLCanvasElement>(null),[rows,setRows]=useState<readonly string[]|null>(null),[failed,setFailed]=useState(false),[retry,setRetry]=useState(0);
 useEffect(()=>{let active=true;setRows(null);setFailed(false);friendArt.read(friendId).then(s=>{if(active)setRows(spriteFrame(s,"right",false,0,"right").frame.rows);}).catch(()=>{if(active)setFailed(true);});return()=>{active=false;};},[friendId,retry]);
 useEffect(()=>{const c=canvas.current?.getContext("2d");if(!c)return;c.clearRect(0,0,240,180);if(!rows)return;
 c.fillStyle="#fff";c.fillRect(0,0,240,180);c.strokeStyle="#000";c.lineWidth=2;c.beginPath();c.ellipse(120,154,55,10,0,0,Math.PI*2);c.stroke();
 const pixels=rows.flatMap((row,py)=>[...row].flatMap((v,px)=>v==="#"?[[px,py]]:[]));
 c.fillStyle="#000";for(const [x,y] of pixels)c.fillRect(80+x*5,72+y*5,5,5);
 drawCosmetic(c,cosmetic,120,72+(pixels.length?Math.min(...pixels.map(p=>p[1])):0)*5);
 },[rows,cosmetic]);
 return <div className="pilot-portrait">{rows?<canvas ref={canvas} width={240} height={180} data-cosmetic={cosmetic} aria-label="Aperçu de ton Friend avec son accessoire"/>:<><canvas ref={canvas} width={240} height={180} hidden/>{failed?<button onClick={()=>setRetry(n=>n+1)}>Réessayer l’aperçu</button>:<span>Ton pilote arrive…</span>}</>}</div>;
}
