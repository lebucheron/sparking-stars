"use client";
import {TouchStick} from './touch-stick';
import {createDirectClick} from "./direct-click";
import type {sampleGhost} from "./ghost";
import {drawCosmetic,drawTrail,type Trail,type Cosmetic} from "./cosmetics";

import { useEffect, useMemo, useRef, useState } from "react";
import {courseCamera} from './course-camera';
import { loadWorldAssets } from "@rarefriends/friendsdk/assets";
import { project, unproject, type WorldConfig, type WorldPoint } from "@rarefriends/friendsdk/world";
import { createWorldMovement } from "@rarefriends/friendsdk/movement";
import { createFriendReader, spriteFrame } from "@rarefriends/friendsdk/sprites";
import {friendArt} from './friend-art';

export type GameWorldInteraction = Readonly<{
  id: string; label: string; position: WorldPoint; reach?: number;
  /** Vertical label offset in the native 960 × 640 viewport; keep nearby touch targets apart. */
  labelOffset?: number;
}>;
export type GameWorldProps = {
  clickTarget?:{position:WorldPoint;number:number};
  resetRevision?:number;
  relocate?:()=>WorldPoint|null;
  onControl?: (input:'touch'|'mouse'|'pen'|'keyboard')=>void;
  focusRevision?: number;
  preloadWorld?:WorldConfig;
  ghost?:()=>ReturnType<typeof sampleGhost>;
  cosmetic?: Cosmetic;
  trail?: Trail;
  equipment?: "feet" | "rollers" | "kart";
  movementScale?: (position: WorldPoint) => number;
  onStep: (position: WorldPoint, delta: number) => void;
  drawTrack: (context: CanvasRenderingContext2D) => void;
  friendId: bigint; world: WorldConfig; spawn: WorldPoint; interactions: readonly GameWorldInteraction[];
  paused?: boolean; reducedMotion?: boolean; onInteract: (id: string) => void;
};

/** A game viewport, with canonical pixels, terrain, collision and input; adds no frame or identity flow. */
export function GameWorld({ friendId, world, spawn, interactions, paused = false, reducedMotion = false, onInteract, onStep, drawTrack, movementScale, equipment, cosmetic, trail, focusRevision, ghost, preloadWorld, onControl, relocate, resetRevision=0,clickTarget }: GameWorldProps) {
  const resetRequested=useRef<WorldPoint|null>(null);
  const VIEW=useMemo(()=>courseCamera(world),[world]);
  const aspect=VIEW.width/VIEW.height,bufferHeight=Math.round(960/aspect);
  const assetCache=useRef(new Map<WorldConfig,Awaited<ReturnType<typeof loadWorldAssets>>>()),spriteCache=useRef<{id:bigint;value:Awaited<ReturnType<ReturnType<typeof createFriendReader>["read"]>>}|null>(null);
  const root = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null);
  const directClick=useRef<ReturnType<typeof createDirectClick>|null>(null);
  const [clickBlocked,setClickBlocked]=useState(false);
  const mover = useRef<ReturnType<typeof createWorldMovement> | null>(null);
  const heldMouse=useRef<{id:number;started:number;clientX:number;clientY:number;x:number;y:number;dragged:boolean;dirty:boolean;lastAim:number}|null>(null);
  const clearMouseHold=()=>{const held=heldMouse.current;heldMouse.current=null;const node=canvas.current;if(held&&node?.hasPointerCapture(held.id))node.releasePointerCapture(held.id);};
  const aimAt=(destination:WorldPoint)=>{if(!mover.current||!directClick.current)return;const aim=directClick.current(mover.current.state.position,destination);mover.current.stop();mover.current.moveTo(aim.target);setClickBlocked(aim.blocked);};
  const stick=useRef({x:0,y:0});
  const [touchDevice]=useState(()=>navigator.maxTouchPoints>0||matchMedia('(pointer: coarse)').matches);
  const steer=(x:number,y:number)=>{stick.current={x,y};const m=mover.current;if(!m)return;for(const [key,pressed]of [['ArrowLeft',x<0],['ArrowRight',x>0],['ArrowUp',y<0],['ArrowDown',y>0]] as [string,boolean][])m.setKey(key,pressed);};
  const live = useRef({ paused, reducedMotion, interactions, onInteract, onStep, drawTrack, movementScale, equipment, cosmetic, trail, focusRevision, ghost, preloadWorld, relocate });
  live.current = { paused, reducedMotion, interactions, onInteract, onStep, drawTrack, movementScale, equipment, cosmetic, trail, focusRevision, ghost, preloadWorld, relocate };
  const [near, setNear] = useState<string | null>(null), [revision, setRevision] = useState(0);
  const [status, setStatus] = useState("Loading world and Friend artwork…"), [failed, setFailed] = useState(false);
  const [size, setSize] = useState({ width: 960, height: 640 });
  const nearest = (point: WorldPoint) => live.current.interactions.filter(item =>
    Math.hypot(point[0] - item.position[0], point[1] - item.position[1]) <= (item.reach ?? 72))
    .sort((a, b) => Math.hypot(point[0] - a.position[0], point[1] - a.position[1]) - Math.hypot(point[0] - b.position[0], point[1] - b.position[1]))[0]?.id ?? null;

  useEffect(() => {
    if (!root.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.min(entry.contentRect.width, entry.contentRect.height * aspect);
      setSize({ width, height: width / aspect });
    });
    observer.observe(root.current); return () => observer.disconnect();
  }, [aspect]);
  useEffect(() => { if (paused){clearMouseHold();stick.current={x:0,y:0};mover.current?.stop();} }, [paused]);
  // Restart only movement; keep the loaded terrain and canonical artwork alive.
  useEffect(()=>{clearMouseHold();resetRequested.current=spawn;stick.current={x:0,y:0};mover.current?.stop();setClickBlocked(false);},[resetRevision,spawn]);
  // Restore keyboard control after artwork loads, a restart, or a runtime menu.
  useEffect(() => {
    if (!paused && !status) canvas.current?.focus({ preventScroll: true });
  }, [paused, status, focusRevision]);
  useEffect(() => {
    const node = canvas.current, context = node?.getContext("2d");
    if (!node || !context) { setFailed(true); setStatus("This browser cannot render the world."); return; }
    const previousPosition=mover.current?.state.position ?? spawn;
    const abort = new AbortController();let movement = createWorldMovement(world, previousPosition);
    directClick.current=createDirectClick(world);mover.current = movement; setNear(null); setFailed(false);
    const cached=assetCache.current.get(world),cachedSprite=spriteCache.current?.id===friendId?spriteCache.current.value:null;
    if(!cached||!cachedSprite)setStatus("Loading world and Friend artwork…");
    let particles:{x:number;y:number;life:number}[]=[];let lastTrail:WorldPoint=spawn;let priorTrail:Trail="none";
    let frame = 0, previous = 0, lastNear: string | null = null, side: "left" | "right" = "right";
    const stop = () => { clearMouseHold();stick.current={x:0,y:0};movement.stop(); previous = 0; };
    window.addEventListener("blur", stop); document.addEventListener("visibilitychange", stop);
    const begin=([assets,sprites]:[Awaited<ReturnType<typeof loadWorldAssets>>,Awaited<ReturnType<ReturnType<typeof createFriendReader>["read"]>>]) => {
      if (abort.signal.aborted) return;
      setStatus("");
      const render = (now: number) => {
        if(resetRequested.current){movement.stop();movement=createWorldMovement(world,resetRequested.current);mover.current=movement;resetRequested.current=null;previous=0;}
        const delta = !live.current.paused && !document.hidden && previous ? now - previous : 0;
        const held=heldMouse.current;
        if(held?.dirty&&!live.current.paused&&!document.hidden&&now-held.lastAim>=50){const rect=node.getBoundingClientRect();aimAt(unproject(VIEW.x+(held.x-rect.left)*VIEW.width/rect.width,VIEW.y+(held.y-rect.top)*VIEW.height/rect.height));held.dirty=false;held.lastAim=now;}
        let budget=Math.min(100,delta)*(live.current.movementScale?.(movement.state.position) ?? 1);
        if(stick.current.x||stick.current.y)steer(stick.current.x,stick.current.y);
        let state=movement.update(0);
        while(budget>0){const slice=Math.min(40,budget);state=movement.update(slice);budget-=slice;}
        previous = now;
        live.current.onStep(state.position, delta);
        const destination=live.current.relocate?.();if(destination){clearMouseHold();movement.stop();stick.current={x:0,y:0};movement=createWorldMovement(world,destination);mover.current=movement;state=movement.state;}
        context.clearRect(0, 0, VIEW.width, VIEW.height); context.save();
        context.scale(960 / VIEW.width, bufferHeight / VIEW.height); context.translate(-VIEW.x, -VIEW.y); context.imageSmoothingEnabled = false; context.drawImage(assets.terrain, 0, 0);
        live.current.drawTrack(context);
        const [x, y] = project(...state.position);
        const selectedTrail=live.current.trail??"none";
        if(selectedTrail!==priorTrail||live.current.reducedMotion){particles=[];priorTrail=selectedTrail;lastTrail=state.position;}
        if(!live.current.paused&&delta>0){
          particles=particles.map(p=>({...p,life:p.life-delta})).filter(p=>p.life>0);
          if(!live.current.reducedMotion&&selectedTrail!=="none"&&state.walking&&Math.hypot(state.position[0]-lastTrail[0],state.position[1]-lastTrail[1])>=18){particles.push({x,y,life:650});particles=particles.slice(-10);lastTrail=state.position;}
        }
        for(const p of particles)drawTrail(context,selectedTrail,p.x,p.y,2+4*p.life/650);
        const layers = assets.objects.map(object => ({ depth: object.depth, draw: () => context.drawImage(object.image, 0, 0) }));
        const replay=live.current.ghost?.();node.dataset.ghost=replay?"visible":"hidden";
        if(replay){const [gx,gy]=project(...replay.position),[px,py]=project(...replay.previous),dx=gx-px,dy=gy-py;
          node.dataset.ghostX=String(replay.position[0]);node.dataset.ghostY=String(replay.position[1]);node.dataset.ghostTime=String(replay.time);
          const facing=Math.abs(dx)>Math.abs(dy)?dx<0?"left":"right":dy<0?"up":"down";
          layers.push({depth:replay.position[0]+replay.position[1]-.01,draw:()=>{
            const rows=spriteFrame(sprites,facing,Math.hypot(dx,dy)>.01,live.current.reducedMotion?0:Math.floor(replay.time/110)%8,dx<0?"left":"right").frame.rows;
            context.save();context.globalAlpha=.28;context.fillStyle="#fff";
            const pixels=rows.flatMap((row,ry)=>[...row].flatMap((v,rx)=>v==="#"?[[rx,ry]]:[]));
            for(const [rx,ry] of pixels)context.fillRect(gx-40+rx*5-2,gy-75+ry*5-2,9,9);
            context.fillStyle="#000";for(const [rx,ry] of pixels)context.fillRect(gx-40+rx*5,gy-75+ry*5,5,5);
            context.globalAlpha=.5;context.strokeStyle="#000";context.lineWidth=1.5;context.setLineDash([3,4]);context.beginPath();context.ellipse(gx,gy+5,28,9,0,0,Math.PI*2);context.stroke();context.restore();
          }});
        }
        layers.push({ depth: state.position[0] + state.position[1], draw: () => {
          if (state.facing === "left" || state.facing === "right") side = state.facing;
          const rows = spriteFrame(sprites, state.facing, state.walking, live.current.reducedMotion ? 0 : Math.floor(now / 110) % 8, side).frame.rows;
          const pixels = rows.flatMap((row, py) => [...row].flatMap((pixel, px) => pixel === "#" ? [[px, py]] : []));
          const left = Math.round(x) - 40, top = Math.round(y) - 75;
          context.save(); context.beginPath(); context.rect(left, top, 80, 80); context.clip(); context.fillStyle = "#fff";
          for (const [px, py] of pixels) context.fillRect(left + px * 5 - 5, top + py * 5 - 5, 15, 15);
          context.fillStyle = "#000";
          for (const [px, py] of pixels) context.fillRect(left + px * 5, top + py * 5, 5, 5);
          context.restore();
          // Anchor on the current canonical frame's highest occupied row.
          const head=pixels.length?Math.min(...pixels.map(pixel=>pixel[1])):0;
          drawCosmetic(context,live.current.cosmetic??"none",x,top+head*5);
          if(live.current.equipment==="rollers"){
            context.fillStyle="#fff";context.strokeStyle="#000";context.lineWidth=2;
            for(const dx of [-22,-10,12,24]){context.beginPath();context.arc(x+dx,y+3,5,0,Math.PI*2);context.fill();context.stroke();}
          }else if(live.current.equipment==="kart"){
            context.fillStyle="#fff";context.strokeStyle="#000";context.lineWidth=3;context.fillRect(x-46,y-22,92,29);context.strokeRect(x-46,y-22,92,29);
            context.fillStyle="#000";for(const dx of [-32,32]){context.beginPath();context.arc(x+dx,y+8,10,0,Math.PI*2);context.fill();}context.strokeRect(x+25,y-33,13,12);
          }
        } });
        layers.sort((a, b) => a.depth - b.depth).forEach(layer => layer.draw()); context.restore();
        const target = nearest(state.position);
        if (target !== lastNear) { lastNear = target; setNear(target); }
        node.dataset.trail = selectedTrail;node.dataset.particles=String(particles.length);
        node.dataset.cosmetic = live.current.cosmetic??"none";
        node.dataset.x = state.position[0].toFixed(2); node.dataset.y = state.position[1].toFixed(2);
        frame = requestAnimationFrame(render);
      };
      frame = requestAnimationFrame(render);
    };
    if(cached&&cachedSprite)begin([cached,cachedSprite]);
    else void Promise.all([
      loadWorldAssets(world,{signals:false,color:false},abort.signal),
      cachedSprite?Promise.resolve(cachedSprite):friendArt.read(friendId),
      preloadWorld&&preloadWorld!==world?loadWorldAssets(preloadWorld,{signals:false,color:false},abort.signal):Promise.resolve(null),
    ]).then(([assets,sprites,alternate])=>{
      if(abort.signal.aborted)return;assetCache.current.clear();assetCache.current.set(world,assets);if(alternate&&preloadWorld)assetCache.current.set(preloadWorld,alternate);spriteCache.current={id:friendId,value:sprites};begin([assets,sprites]);
    }).catch(()=>{if(!abort.signal.aborted){setFailed(true);setStatus("World or Friend artwork could not load. Check your connection and retry.");}});
    return () => { abort.abort(); cancelAnimationFrame(frame); stop(); window.removeEventListener("blur", stop); document.removeEventListener("visibilitychange", stop); };
  }, [friendId, world, spawn, revision, preloadWorld]);

  const targetScreen=clickTarget?project(...clickTarget.position):null;
  return <div ref={root} className={`rf-world-view${touchDevice&&!paused?" touch-driving":""}`}>
    {touchDevice&&!paused&&!status&&<TouchStick onDirection={steer} onControl={kind=>onControl?.(kind)}/>}
    <div className="rf-world-surface" style={size}>
      <canvas ref={canvas} width={960} height={bufferHeight} data-view-x={VIEW.x} data-view-y={VIEW.y} data-view-width={VIEW.width} data-view-height={VIEW.height} tabIndex={paused || status ? -1 : 0}
        aria-label="Circuit Sparking Stars. Flèches ou ZQSD pour marcher. Cliquez ou touchez une destination."
        onBlur={() => {clearMouseHold();mover.current?.stop();}}
        onKeyDown={event => {
          if (paused || status) return;setClickBlocked(false);
          if (event.key.toLowerCase() === "e" && !event.repeat && mover.current) {
            const target = nearest(mover.current.state.position);
            if (target) { event.preventDefault(); onInteract(target); }
          }
          if (mover.current?.setKey(({z:"w",q:"a"} as Record<string,string>)[event.key.toLowerCase()] ?? event.key, true)) {clearMouseHold();onControl?.('keyboard');event.preventDefault();}
        }}
        onKeyUp={event => { if (mover.current?.setKey(({z:"w",q:"a"} as Record<string,string>)[event.key.toLowerCase()] ?? event.key, false)) event.preventDefault(); }}
        onPointerDown={event => {
          if (paused || status || event.button!==0) return;
          onControl?.(event.pointerType==='touch'?'touch':event.pointerType==='pen'?'pen':'mouse');
          event.currentTarget.focus(); const rect = event.currentTarget.getBoundingClientRect();
          const destination=unproject(VIEW.x + (event.clientX - rect.left) * VIEW.width / rect.width, VIEW.y + (event.clientY - rect.top) * VIEW.height / rect.height);
          aimAt(destination);
          if(event.pointerType==='mouse'){clearMouseHold();stick.current={x:0,y:0};heldMouse.current={id:event.pointerId,started:performance.now(),clientX:event.clientX,clientY:event.clientY,x:event.clientX,y:event.clientY,dragged:false,dirty:false,lastAim:performance.now()};event.currentTarget.setPointerCapture(event.pointerId);}
        }}
        onPointerMove={event=>{const held=heldMouse.current;if(!held||held.id!==event.pointerId||paused||status)return;if(!(event.buttons&1)){clearMouseHold();mover.current?.stop();return;}held.x=event.clientX;held.y=event.clientY;held.dirty=true;if(Math.hypot(held.x-held.clientX,held.y-held.clientY)>3)held.dragged=true;}}
        onPointerUp={event=>{const held=heldMouse.current;if(!held||held.id!==event.pointerId)return;const continuous=held.dragged||performance.now()-held.started>=200;clearMouseHold();if(continuous)mover.current?.stop();}}
        onPointerCancel={()=>{clearMouseHold();mover.current?.stop();}}
        onLostPointerCapture={event=>{if(heldMouse.current?.id===event.pointerId){clearMouseHold();mover.current?.stop();}}} />
      {!status&&!paused&&clickTarget&&targetScreen&&<button type="button" className="star-aim" data-testid="covered-star-target" aria-label={`Viser l’étoile ${clickTarget.number}`}
        style={{left:`${100*(targetScreen[0]-VIEW.x)/VIEW.width}%`,top:`${100*(targetScreen[1]-VIEW.y)/VIEW.height}%`}}
        onPointerDown={event=>onControl?.(event.pointerType==='touch'?'touch':event.pointerType==='pen'?'pen':'mouse')}
        onClick={event=>{if(event.detail===0)onControl?.('keyboard');if(!mover.current||!directClick.current)return;const aim=directClick.current(mover.current.state.position,clickTarget.position);mover.current.stop();mover.current.moveTo(aim.target);setClickBlocked(aim.blocked);canvas.current?.focus({preventScroll:true});}}>★ {clickTarget.number}</button>}
      {!status&&clickBlocked&&!paused&&<p className="click-feedback" role="status">Obstacle : vise un point à côté pour le contourner.</p>}
      {!status && interactions.map(item => { const [x, y] = project(...item.position); return <button type="button" className="rf-world-prompt" key={item.id}
        style={{ left: `${100*(x - VIEW.x) / VIEW.width}%`, top: `${100*(y - VIEW.y + (item.labelOffset ?? 34)) / VIEW.height}%` }} disabled={paused || near !== item.id}
        onClick={() => onInteract(item.id)}>{item.label}<small>{near === item.id ? "E / tap to interact" : "Walk closer"}</small></button>; })}
    </div>
    {status && <div className="rf-world-loading" role={failed ? "alert" : "status"}><p>{status}</p>{failed && <button type="button" onClick={() => setRevision(value => value + 1)}>Retry artwork</button>}</div>}
  </div>;
}
