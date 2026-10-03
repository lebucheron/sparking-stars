import {useEffect,useRef,useState} from 'react';
import type {WorldPoint} from '@rarefriends/friendsdk/world';
import {project} from '@rarefriends/friendsdk/world';
import {GameWorld} from './circuit-world';
import {hauntedRoute as route,hauntedWorld as world,hauntedPassage,secret,curse,returnPoint} from './halloween';
import {publicApi} from './public-api';
import {preciseTime} from './leaderboard-model';
import {initialControls,classifyControl,controlLabel} from './controls';
import type {Cosmetic,Trail} from './cosmetics';
const fresh=()=>({running:false,done:false,next:1,ms:0,countdown:3000,escaped:false,loops:0});
export function HalloweenRace({friendId,paused,cosmetic,trail,onClose}:{friendId:bigint;paused:boolean;cosmetic:Cosmetic;trail:Trail;onClose:()=>void}){
 const race=useRef(fresh()),relocation=useRef<WorldPoint|null>(null),[hud,setHud]=useState(fresh),[run,setRun]=useState(0),[notice,setNotice]=useState(''),[controls,setControls]=useState(initialControls),[reduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>()=>{void publicApi('focus',{active:false}).catch(()=>{});},[]);
 function start(){race.current={...fresh(),running:true};relocation.current=null;setNotice('');setHud({...race.current});setRun(n=>n+1);void publicApi('focus',{active:true}).catch(()=>{});}
 function leave(){race.current=fresh();relocation.current=null;void publicApi('focus',{active:false}).catch(()=>{});onClose();}
 function step(point:WorldPoint,delta:number){const r=race.current;if(!r.running||paused||delta<=0)return;if(r.countdown){r.countdown=Math.max(0,r.countdown-delta);setHud({...r});return;}r.ms+=delta;
  const passage=hauntedPassage(point,r.next,r.escaped);
  if(passage==='secret'){r.escaped=true;setNotice('La lanterne reconnaît ton passage… la boucle est brisée !');}
  if(passage==='curse'){r.loops++;r.next=2;relocation.current=[...returnPoint];setNotice('Le chemin recommence… une lueur veille à côté de la route.');setHud({...r});return;}
  const target=route[r.next%route.length];if(Math.hypot(point[0]-target[0],point[1]-target[1])<17){r.next++;if(r.next>route.length){r.running=false;r.done=true;r.ms=Math.round(r.ms);setNotice('Tu as échappé à la boucle hantée !');}}setHud({...r});
 }
 function draw(ctx:CanvasRenderingContext2D){const r=race.current;ctx.save();ctx.lineJoin='round';ctx.beginPath();[...route,route[0]].forEach((p,i)=>{const [x,y]=project(...p);if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);});ctx.strokeStyle='#35333d';ctx.lineWidth=40;ctx.stroke();ctx.strokeStyle='#e7e1d6';ctx.lineWidth=34;ctx.stroke();ctx.setLineDash([5,12]);ctx.lineWidth=2;ctx.strokeStyle='#655f70';ctx.stroke();ctx.setLineDash([]);
  for(const [i,p]of route.entries()){const [x,y]=project(...p);ctx.fillStyle=i===0?'#c4713f':r.next>i?'#827885':'#2f2937';ctx.font=`bold ${r.next===i?28:22}px Arial`;ctx.textAlign='center';ctx.fillText(i===0?'⚑':r.next>i?'✓':'★',x,y-8);ctx.font='11px Arial';ctx.fillText(i===0?'DÉPART / ARRIVÉE':String(i),x,y+12);}
  for(const [x,y,w,h]of [[190,185,60,45],[400,240,30,35]]){const [px,py]=project(x+w/2,y+h/2);ctx.fillStyle='#514957';ctx.fillRect(px-18,py-38,36,38);ctx.fillStyle='#b3a3b7';ctx.font='16px Arial';ctx.fillText('✝',px,py-13);}
  const [lx,ly]=project(...secret);ctx.fillStyle=r.escaped?'#e5c182':'#b97d45';ctx.beginPath();ctx.arc(lx,ly-9,6,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#514957';ctx.lineWidth=2;ctx.strokeRect(lx-8,ly-18,16,19);ctx.beginPath();ctx.moveTo(lx,ly+1);ctx.lineTo(lx,ly+11);ctx.stroke();
  const [cx,cy]=project(...curse);ctx.strokeStyle='#95839b';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(cx,cy,18,8,0,0,Math.PI*2);ctx.stroke();ctx.restore();
 }
 return <section className="sparking halloween-race" aria-label="Course Halloween" inert={paused||undefined}>
 <GameWorld key={run} friendId={friendId} world={world} preloadWorld={world} spawn={route[0]} interactions={[]} onInteract={()=>{}} paused={paused||!hud.running} reducedMotion={reduced} cosmetic={cosmetic} trail={trail} onStep={step} drawTrack={draw} movementScale={()=>race.current.countdown?0:1} onControl={kind=>setControls(c=>classifyControl(c,kind))} relocate={()=>{const p=relocation.current;relocation.current=null;return p;}}/>
 <header className="hud"><div><small>COURSE SPÉCIALE · HALLOWEEN</small><h1>La boucle hantée</h1></div><div className="score"><b data-testid="stars">★ {Math.min(route.length,hud.next-1)}/{route.length}</b><strong data-testid="timer">{preciseTime(hud.ms)}</strong></div></header>
 {hud.running?<><button className="race-leave" onClick={leave}>Quitter</button><div className="race-progress"><div style={{width:`${100*Math.min(route.length,hud.next-1)/route.length}%`}}/></div><div className="race-status"><small>{controlLabel(controls)}</small><span>{hud.next===route.length?'Retourne à l’arrivée !':`Étoile ${hud.next} · ${hud.loops} retour${hud.loops!==1?'s':''}`}</span><button onClick={start}>Recommencer</button></div>{notice&&<p className="haunted-notice" role="status">{notice}</p>}{hud.countdown>0&&<div className="countdown"><small>ENTRE DANS LA BOUCLE</small><strong>{Math.ceil(hud.countdown/1000)}</strong></div>}</>:<div className={`race-card ${hud.done?'finished':''}`}><small>HALLOWEEN · EXPLORATION</small><h2>{hud.done?'La malédiction est levée ✦':'La boucle hantée'}</h2><p>{hud.done?`${preciseTime(hud.ms)} · ${hud.loops} retour${hud.loops!==1?'s':''}`:'Six étoiles. Un chemin trompeur. Une sortie à découvrir.'}</p><p>{hud.done?notice:'Si la route recommence, observe ce qui brille à côté du chemin.'}</p><small>Course spéciale pour tous les Friends · à pied · sans classement ni gain RF. Les quêtes et fantômes des GEN restent séparés.</small><button className="race-start" onClick={start}>{hud.done?'Rejouer Halloween':'Entrer dans la boucle'}</button><button className="return-paddock" onClick={leave}>Retour au paddock</button></div>}
 </section>;
}
