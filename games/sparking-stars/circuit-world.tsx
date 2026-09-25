"use client";
import {drawCosmetic,drawTrail,type Trail,type Cosmetic} from "./cosmetics";

import { useEffect, useRef, useState } from "react";
import { loadWorldAssets } from "@rarefriends/friendsdk/assets";
import { project, unproject, type WorldConfig, type WorldPoint } from "@rarefriends/friendsdk/world";
import { createWorldMovement } from "@rarefriends/friendsdk/movement";
import { createFriendReader, spriteFrame } from "@rarefriends/friendsdk/sprites";

export type GameWorldInteraction = Readonly<{
  id: string; label: string; position: WorldPoint; reach?: number;
  /** Vertical label offset in the native 960 × 640 viewport; keep nearby touch targets apart. */
  labelOffset?: number;
}>;
export type GameWorldProps = {
  focusRevision?: number;
  cosmetic?: Cosmetic;
  trail?: Trail;
  equipment?: "feet" | "rollers" | "kart";
  movementScale?: (position: WorldPoint) => number;
  onStep: (position: WorldPoint, delta: number) => void;
  drawTrack: (context: CanvasRenderingContext2D) => void;
  friendId: bigint; world: WorldConfig; spawn: WorldPoint; interactions: readonly GameWorldInteraction[];
  paused?: boolean; reducedMotion?: boolean; onInteract: (id: string) => void;
};
const VIEW = { x: 220, y: 265, width: 1160, height: 1160 / 1.5 };

/** A game viewport, with canonical pixels, terrain, collision and input; adds no frame or identity flow. */
export function GameWorld({ friendId, world, spawn, interactions, paused = false, reducedMotion = false, onInteract, onStep, drawTrack, movementScale, equipment, cosmetic, trail, focusRevision }: GameWorldProps) {
  const root = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null);
  const mover = useRef<ReturnType<typeof createWorldMovement> | null>(null);
  const live = useRef({ paused, reducedMotion, interactions, onInteract, onStep, drawTrack, movementScale, equipment, cosmetic, trail, focusRevision });
  live.current = { paused, reducedMotion, interactions, onInteract, onStep, drawTrack, movementScale, equipment, cosmetic, trail, focusRevision };
  const [near, setNear] = useState<string | null>(null), [revision, setRevision] = useState(0);
  const [status, setStatus] = useState("Loading world and Friend artwork…"), [failed, setFailed] = useState(false);
  const [size, setSize] = useState({ width: 960, height: 640 });
  const nearest = (point: WorldPoint) => live.current.interactions.filter(item =>
    Math.hypot(point[0] - item.position[0], point[1] - item.position[1]) <= (item.reach ?? 72))
    .sort((a, b) => Math.hypot(point[0] - a.position[0], point[1] - a.position[1]) - Math.hypot(point[0] - b.position[0], point[1] - b.position[1]))[0]?.id ?? null;

  useEffect(() => {
    if (!root.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.min(entry.contentRect.width, entry.contentRect.height * 1.5);
      setSize({ width, height: width / 1.5 });
    });
    observer.observe(root.current); return () => observer.disconnect();
  }, []);
  useEffect(() => { if (paused) mover.current?.stop(); }, [paused]);
  // Restore keyboard control after artwork loads, a restart, or a runtime menu.
  useEffect(() => {
    if (!paused && !status) canvas.current?.focus({ preventScroll: true });
  }, [paused, status, focusRevision]);
  useEffect(() => {
    const node = canvas.current, context = node?.getContext("2d");
    if (!node || !context) { setFailed(true); setStatus("This browser cannot render the world."); return; }
    const previousPosition=mover.current?.state.position ?? spawn;
    const abort = new AbortController(), movement = createWorldMovement(world, previousPosition);
    mover.current = movement; setNear(null); setFailed(false); setStatus("Loading world and Friend artwork…");
    let particles:{x:number;y:number;life:number}[]=[];let lastTrail:WorldPoint=spawn;let priorTrail:Trail="none";
    let frame = 0, previous = 0, lastNear: string | null = null, side: "left" | "right" = "right";
    const stop = () => { movement.stop(); previous = 0; };
    window.addEventListener("blur", stop); document.addEventListener("visibilitychange", stop);
    void Promise.all([loadWorldAssets(world, { signals: false, color: false }, abort.signal), createFriendReader().read(friendId)]).then(([assets, sprites]) => {
      if (abort.signal.aborted) return;
      setStatus("");
      const render = (now: number) => {
        const delta = !live.current.paused && !document.hidden && previous ? now - previous : 0;
        let budget=Math.min(100,delta)*(live.current.movementScale?.(movement.state.position) ?? 1);
        let state=movement.update(0);
        while(budget>0){const slice=Math.min(40,budget);state=movement.update(slice);budget-=slice;}
        previous = now;
        live.current.onStep(state.position, delta);
        context.clearRect(0, 0, VIEW.width, VIEW.height); context.save();
        context.scale(960 / VIEW.width, 640 / VIEW.height); context.translate(-VIEW.x, -VIEW.y); context.imageSmoothingEnabled = false; context.drawImage(assets.terrain, 0, 0);
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
    }).catch(() => { if (!abort.signal.aborted) { setFailed(true); setStatus("World or Friend artwork could not load. Check your connection and retry."); } });
    return () => { abort.abort(); cancelAnimationFrame(frame); stop(); window.removeEventListener("blur", stop); document.removeEventListener("visibilitychange", stop); };
  }, [friendId, world, spawn, revision]);

  return <div ref={root} className="rf-world-view">
    <div className="rf-world-surface" style={size}>
      <canvas ref={canvas} width={960} height={640} tabIndex={paused || status ? -1 : 0}
        aria-label="Circuit Sparking Stars. Flèches ou ZQSD pour marcher. Cliquez ou touchez une destination."
        onBlur={() => mover.current?.stop()}
        onKeyDown={event => {
          if (paused || status) return;
          if (event.key.toLowerCase() === "e" && !event.repeat && mover.current) {
            const target = nearest(mover.current.state.position);
            if (target) { event.preventDefault(); onInteract(target); }
          }
          if (mover.current?.setKey(({z:"w",q:"a"} as Record<string,string>)[event.key.toLowerCase()] ?? event.key, true)) event.preventDefault();
        }}
        onKeyUp={event => { if (mover.current?.setKey(({z:"w",q:"a"} as Record<string,string>)[event.key.toLowerCase()] ?? event.key, false)) event.preventDefault(); }}
        onPointerDown={event => {
          if (paused || status) return;
          event.currentTarget.focus(); const rect = event.currentTarget.getBoundingClientRect();
          mover.current?.moveTo(unproject(VIEW.x + (event.clientX - rect.left) * VIEW.width / rect.width, VIEW.y + (event.clientY - rect.top) * VIEW.height / rect.height));
        }} />
      {!status && interactions.map(item => { const [x, y] = project(...item.position); return <button type="button" className="rf-world-prompt" key={item.id}
        style={{ left: `${(x - VIEW.x) / 9.6}%`, top: `${(y - VIEW.y + (item.labelOffset ?? 34)) / 6.4}%` }} disabled={paused || near !== item.id}
        onClick={() => onInteract(item.id)}>{item.label}<small>{near === item.id ? "E / tap to interact" : "Walk closer"}</small></button>; })}
    </div>
    {status && <div className="rf-world-loading" role={failed ? "alert" : "status"}><p>{status}</p>{failed && <button type="button" onClick={() => setRevision(value => value + 1)}>Retry artwork</button>}</div>}
  </div>;
}
