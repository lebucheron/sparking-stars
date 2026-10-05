"use client";
import {TRACK_PREVIEW,PREVIEW_GENERATION} from './track-preview';
import {bushAllows,drawMovingBush} from './moving-bush';
import {rubyAllows,rubyState,drawMovingRuby} from './moving-ruby';
import {drawRoadNetwork} from './road-network';
import {bridgeVisible,drawHiddenBridge} from './hidden-bridge';
import {isStair,stairPress,drawStaircase} from './staircase';
import {gateAllows,drawTimedGate} from './timed-gate';
import {emptyHalloween} from './halloween-reward';
import { useEffect, useRef, useState, useMemo } from "react";
import type { GameComponentProps } from "@rarefriends/friendsdk/runtime";
import { getWorldPreset, validateWorld, project, type WorldPoint } from "@rarefriends/friendsdk/world";
import {ghostKey,makeGhost,sampleGhost,betterGhost,type Ghost} from "./ghost";
import {initialControls,classifyControl,controlLabel,type Controls} from './controls';
import { GameWorld } from "./circuit-world";
import "@rarefriends/friendsdk/world-view.css";
import "./style.css";

import { terrains,startingObstacle,distanceToTrack } from "./terrains";
import {readFriendProfile} from "./friend-profile";
import type {Cosmetic,Trail} from "./cosmetics";
import {CreatorChallenge} from "./creator-challenge";
import {PublicBoard} from "./public-board";
import {publicApi} from "./public-api";
import {RULES} from "./rules-version";
import {HalloweenRace} from './halloween-race';
import {QuestPanel} from './quest-panel';
import {completeQuest,type QuestState,emptyQuests} from './quests';
import {Leaderboard} from "./leaderboard";
import {preciseTime,type Lap} from "./leaderboard-model";
import {Shop} from "./shop";
import {initialWallet,transact,raceReward,medalTargets,circuitDistance,labels,type Action,type Equipment,type Bonus} from "./shop-model";
const noInteractions=[] as const;
type Mode="training"|"free"|"ranked";
type Race={countdown:number;next:number;elapsed:number;running:boolean;done:boolean};
const fresh=():Race=>({countdown:0,next:1,elapsed:0,running:false,done:false});
const time=preciseTime;
export default function SparkingStars({friendId,client,paused}:GameComponentProps){
  const [boardOpen,setBoardOpen]=useState(false),[laps,setLaps]=useState<Lap[]>([]);
  const lapId=useRef(0);
  const [creatorTarget,setCreatorTarget]=useState<number|null>(null);const runCreator=useRef<number|null>(null);
  const ghosts=useRef<Record<string,Ghost>>({}),runGhost=useRef<Ghost|null>(null);
  const [halloweenOpen,setHalloweenOpen]=useState(false);const [halloweenProgress,setHalloweenProgress]=useState(emptyHalloween);
  async function equipHalloween(equipped:boolean){const current=epoch.current;try{const progress=await publicApi('halloween',{friendId:String(friendId),operation:'equip',equipped});if(current===epoch.current)setHalloweenProgress(progress);}catch(e){if(current===epoch.current)setShopMessage(e instanceof Error?e.message:'Souvenir indisponible.');}}
  function closeHalloween(){setHalloweenOpen(false);const current=epoch.current;void publicApi('halloween',{friendId:String(friendId),operation:'read'}).then(progress=>{if(current===epoch.current)setHalloweenProgress(progress);}).catch(()=>{});}
  const [pickup,setPickup]=useState(''),[pulse,setPulse]=useState(0);
  useEffect(()=>{if(!pickup)return;const timer=setTimeout(()=>setPickup(''),1400);return()=>clearTimeout(timer);},[pickup,pulse]);
  function returnPaddock(){epoch.current++;ticket.current=null;race.current=fresh();setHud(fresh());setRun(n=>n+1);setServerStatus('');setPickup('');setPrize(null);setQuestNotice('');closePanels();void publicApi('focus',{active:false}).catch(()=>{});}
  const [progressOpen,setProgressOpen]=useState(false);
  const closePanels=()=>{setProgressOpen(false);setQuestsOpen(false);setModesOpen(false);setShopping(false);setChoosing(false);setBoardOpen(false);setPublicOpen(false);};
  const [questsOpen,setQuestsOpen]=useState(false),[challengeGhost,setChallengeGhost]=useState(false),[questNotice,setQuestNotice]=useState('');
  const quests=useRef<Record<string,QuestState>>({}),questId=useRef('');
  const [questRevision,setQuestRevision]=useState(0);
  const [ghostEnabled,setGhostEnabled]=useState(true);
  const [controls,setControls]=useState<Controls>(initialControls),[ghostStorage,setGhostStorage]=useState('');
  const runControls=useRef<Controls>(controls),inputLog=useRef<{ms:number;kind:string}[]>([]);
  const ghostId=(m:string,e:string,input:Controls=controls)=>ghostKey(String(friendId),terrain.gen,m,e,RULES,input);
  function recordControl(kind:'touch'|'mouse'|'pen'|'keyboard'){
    if(!race.current.running||paused)return;
    if(inputLog.current.length<4000&&inputLog.current.at(-1)?.kind!==kind)inputLog.current.push({ms:race.current.elapsed,kind});
    const next=classifyControl(runControls.current,kind);
    if(next!==runControls.current){runControls.current=next;setControls(next);runCreator.current=null;setCreatorTarget(null);runGhost.current=(challengeGhost?quests.current[ghostId(config.current.mode,config.current.equipment,next)]?.target:null)??ghosts.current[ghostId(config.current.mode,config.current.equipment,next)]??null;setServerStatus('Souris ou clavier détecté · chrono classé côté clavier / souris.');}
  }
  function saveGhost(){const c=config.current;
    const g=makeGhost(trace.current);if(c.mode!=='free'&&g){const key=ghostId(c.mode,c.equipment,runControls.current),current=epoch.current;void publicApi('quests',{operation:'complete',friendId:String(friendId),rules:RULES,gen:terrain.gen,mode:c.mode,equipment:c.equipment,controls:runControls.current,ghost:g,id:questId.current}).then(result=>{if(current!==epoch.current)return;quests.current[key]=result.state;setQuestRevision(n=>n+1);setQuestNotice(result.earned.length?`✦ ${result.earned.join(' · ')}${result.saved?'':' · session uniquement'}`:result.saved?'Progression des quêtes sauvegardée.':'Quêtes disponibles pour cette session.');}).catch(()=>{if(current!==epoch.current)return;const result=completeQuest(quests.current[key]??emptyQuests(),g,questId.current);quests.current[key]=result.state;setQuestRevision(n=>n+1);setQuestNotice(result.earned.length?`✦ ${result.earned.join(' · ')} · session uniquement`:'Quêtes disponibles pour cette session.');});}
    if(c.mode==='free')return;const key=ghostId(c.mode,c.equipment,runControls.current),next=makeGhost(trace.current),best=betterGhost(ghosts.current[key],next);if(best){ghosts.current[key]=best;const current=epoch.current;void publicApi('ghost',{operation:'write',friendId:String(friendId),rules:RULES,gen:terrain.gen,mode:c.mode,equipment:c.equipment,controls:runControls.current,ghost:best}).then(result=>{if(current===epoch.current)setGhostStorage(result.saved?'Fantôme sauvegardé sur cet appareil.':'Fantôme disponible pour cette session ; sauvegarde locale indisponible.');}).catch(()=>{if(current===epoch.current)setGhostStorage('Fantôme disponible pour cette session ; sauvegarde locale indisponible.');});}}

  const [publicOpen,setPublicOpen]=useState(false),[serverStatus,setServerStatus]=useState(""),[starting,setStarting]=useState(false);
  const [retrySend,setRetrySend]=useState(false);
  const ticket=useRef<string|null>(null),trace=useRef<number[][]>([]),epoch=useRef(0);
  useEffect(()=>()=>{epoch.current++;},[]);
  const [trail,setTrail]=useState<Trail>("none");
  const [personalBest,setPersonalBest]=useState<string|null>(null);
  const [cosmetic,setCosmetic]=useState<Cosmetic>("none");
  useEffect(()=>{let active=true;const restore=async(e:MessageEvent)=>{if(e.source!==window.parent||e.data?.type!=="sparking-session-ready")return;try{const saved=await publicApi("style",{friendId:String(friendId),operation:"read"});if(active){setCosmetic(saved.cosmetic);setTrail(saved.trail);}}catch{/* The wardrobe offers an explicit retry. */}};window.addEventListener("message",restore);return()=>{active=false;window.removeEventListener("message",restore);};},[friendId]);
  const [mode,setMode]=useState<Mode>("training"),[modesOpen,setModesOpen]=useState(false);
  useEffect(()=>{const connected=(e:MessageEvent)=>{if(e.source===window.parent&&e.data?.type==='sparking-session-ready'&&mode==='ranked')setServerStatus('Classement activé · clique sur « C’est parti ! » pour lancer le décompte.');};window.addEventListener('message',connected);return()=>window.removeEventListener('message',connected);},[mode]);
  useEffect(()=>{const focus=(e:MessageEvent)=>{if(e.source===window.parent&&e.data?.type==='sparking-focus')document.documentElement.classList.toggle('race-focus',e.data.active===true);};window.addEventListener('message',focus);return()=>{window.removeEventListener('message',focus);document.documentElement.classList.remove('race-focus');};},[]);

  const [trainingEquipment,setTrainingEquipment]=useState<Equipment>("feet");
  const [profile,setProfile]=useState<{generation:number;tier:number}|null>(null);
  const [selected,setSelected]=useState(0),[choosing,setChoosing]=useState(false);
  const terrain=terrains[selected], route=terrain.route, spawn=route[0];
  const [wallet,setWallet]=useState(initialWallet), walletRef=useRef(initialWallet());
  const [shopping,setShopping]=useState(false),[shopMessage,setShopMessage]=useState("");
  useEffect(()=>{void publicApi("context",{needed:mode==="ranked"||shopping}).catch(()=>{});},[mode,shopping]);
  const [broken,setBroken]=useState(false),[nearWall,setNearWall]=useState(false),[used,setUsed]=useState(false);
  const [prize,setPrize]=useState<{medal:string;coins:number}|null>(null);
  const config=useRef({mode:"training" as Mode,equipment:"feet" as Equipment,bonus:"none" as Bonus,tier:0,id:0,used:false,boost:0,gifted:false});
  const position=useRef<WorldPoint>(spawn);
  const [records,setRecords]=useState<Record<string,number>>({});

  const wall=useMemo(()=>startingObstacle(terrain),[route]);
  const world=useMemo(()=>broken?terrain.world:validateWorld({...terrain.world,props:[...terrain.world.props,{type:"crate",x:wall[0],y:wall[1],scale:1,footprint:{x:-12,y:-12,w:24,h:24}}]}),[terrain,wall,broken]);
  function act(a:Action){const result=transact(walletRef.current,a);if(result.ok){walletRef.current=result.wallet;setWallet(result.wallet);}setShopMessage(result.message);return result.ok;}
  function useBonus(){const c=config.current;if(paused||shopping||choosing||modesOpen||boardOpen||publicOpen||!race.current.running||race.current.countdown>0||c.used||c.bonus==="none")return;
    if(c.bonus==="breaker"&&Math.hypot(position.current[0]-wall[0],position.current[1]-wall[1])>85){setShopMessage("Rapproche-toi de la barricade.");return;}
    if(act({type:"use",bonus:c.bonus})){c.used=true;setUsed(true);if(c.bonus==="boost")c.boost=3000;else setBroken(true);}
  }
  const bonusHandler=useRef(useBonus);bonusHandler.current=useBonus;const controlHandler=useRef(recordControl);controlHandler.current=recordControl;
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.code==="Space"&&!e.repeat&&!(e.target instanceof HTMLButtonElement)&&race.current.running){e.preventDefault();controlHandler.current('keyboard');bonusHandler.current();}};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key);},[]);
  const stairArmed=useRef(0);
  const race=useRef<Race>(fresh());
  const [hud,setHud]=useState(fresh),[run,setRun]=useState(0);
  const comparison=(hud.running||hud.done)?config.current:{mode,equipment:mode!=="free"?trainingEquipment:wallet.equipped,tier:mode!=="free"?0:wallet.tier,bonus:mode==="free"&&wallet.bonus!=="none"&&wallet.stock[wallet.bonus]>0?wallet.bonus:"none"};
  const targets=medalTargets(terrain.level,circuitDistance(route),comparison.equipment);
  const offroad=distanceToTrack(position.current,terrain)>terrain.width/2;
  const best=records[`${selected}-${comparison.mode}-${comparison.equipment}-${comparison.tier}-${comparison.bonus}-${controls}`]??ghosts.current[ghostId(comparison.mode,comparison.equipment)]?.ms??null;
  const [ready,setReady]=useState(false),[error,setError]=useState(""),[retry,setRetry]=useState(0);
  const [reduced,setReduced]=useState(false);
  useEffect(()=>{let active=true;setReady(false);setError("");race.current=fresh();setHud(fresh());setRecords({});walletRef.current=initialWallet();setWallet(walletRef.current);setShopping(false);setPrize(null);setBroken(false);
    setHalloweenOpen(false);setHalloweenProgress(emptyHalloween);setProgressOpen(false);setQuestsOpen(false);setChallengeGhost(false);setQuestNotice('');quests.current={};setQuestRevision(n=>n+1);setCreatorTarget(null);runCreator.current=null;ghosts.current={};runGhost.current=null;setGhostStorage('');epoch.current++;ticket.current=null;setRetrySend(false);setServerStatus("");setPublicOpen(false);setProfile(null);setBoardOpen(false);setLaps([]);lapId.current=0;setCosmetic("none");setTrail("none");setPersonalBest(null);setMode("training");setModesOpen(false);setTrainingEquipment("feet");
    Promise.all([client.read(),readFriendProfile(friendId)]).then(([snapshot,official])=>{
      if(!active)return;if(snapshot.friendId!==friendId)throw new Error("Le Friend a changé.");
      setProfile(official);setSelected((TRACK_PREVIEW?PREVIEW_GENERATION:official.generation)-1);walletRef.current=initialWallet(official.tier);setWallet(walletRef.current);setReady(true);
      void publicApi('prepare',{friendId:String(friendId)}).then(()=>{void publicApi('halloween',{operation:'read',friendId:String(friendId)}).then(result=>{if(active)setHalloweenProgress(result);}).catch(()=>{});void publicApi('quests',{operation:'read',friendId:String(friendId),rules:RULES}).then(result=>{if(active){quests.current=result.categories??{};setQuestRevision(n=>n+1);}}).catch(()=>{});return publicApi('ghost',{operation:'read',friendId:String(friendId),rules:RULES});}).then(result=>{if(active){for(const [key,ghost]of Object.entries(result.ghosts??{}) as [string,Ghost][]){const best=betterGhost(ghosts.current[key],ghost);if(best)ghosts.current[key]=best;}if(race.current.running&&config.current.mode!=='free'){const c=config.current;runGhost.current=ghosts.current[ghostKey(String(friendId),official.generation,c.mode,c.equipment,RULES,runControls.current)]??null;}setGhostStorage(Object.keys(ghosts.current).length?'Fantômes retrouvés sur cet appareil.':'');}}).catch(()=>{});
    }).catch(()=>{if(active)setError("Impossible de lire la GEN et le tier officiels. Vérifie ta connexion puis réessaie.");});
    return()=>{active=false;};},[client,friendId,retry]);
  useEffect(()=>{const media=matchMedia("(prefers-reduced-motion: reduce)");const update=()=>{setReduced(media.matches);if(media.matches)setGhostEnabled(false);};update();media.addEventListener("change",update);return()=>media.removeEventListener("change",update);},[]);
  const start=async()=>{if(paused||!ready||starting)return;
    if(TRACK_PREVIEW&&mode!=='training'){setServerStatus('Cette piste en essai se joue en entraînement.');return;}
    const current=++epoch.current;ticket.current=null;questId.current=crypto.randomUUID();setQuestNotice('');setRetrySend(false);setServerStatus("");runControls.current=controls;inputLog.current=[];
    stairArmed.current=0;race.current=fresh();setHud(fresh());
    if(mode==="ranked"){
      setStarting(true);setServerStatus("Préparation du départ côté serveur…");
      try{const run=await publicApi('start',{friendId:String(friendId),equipment:trainingEquipment,rules:RULES,controls});if(current!==epoch.current)return;if(run.generation!==terrain.gen||run.rules!==RULES||run.controls!==controls)throw new Error("Le classement séparé n’est pas encore disponible : réessaie après la mise à jour.");ticket.current=run.id;setServerStatus(`Départ enregistré · ${controlLabel(controls)} · toutes les étoiles, sans bonus.`);}
      catch(e){if(current===epoch.current)setServerStatus(e instanceof Error?e.message:"Serveur indisponible. L’entraînement reste accessible.");return;}
      finally{setStarting(false);}
    }
    runCreator.current=mode==="ranked"&&trainingEquipment==="feet"?creatorTarget:null;runGhost.current=mode==="free"?null:(challengeGhost?quests.current[ghostId(mode,trainingEquipment)]?.target:null)??ghosts.current[ghostId(mode,trainingEquipment)]??null;trace.current=[[0,spawn[0],spawn[1]]];if(mode==="free"&&!act({type:"start"})){setShopping(true);return;}
    const w=walletRef.current;config.current={mode,equipment:mode!=="free"?trainingEquipment:w.equipped,bonus:mode==="free"&&w.bonus!=="none"&&w.stock[w.bonus]>0?w.bonus:"none",tier:mode!=="free"?0:w.tier,id:config.current.id+1,used:false,boost:0,gifted:false};
    setModesOpen(false);setShopping(false);setChoosing(false);setBroken(false);setUsed(false);setPrize(null);setPersonalBest(null);setNearWall(false);setShopMessage("");race.current={...fresh(),running:true,countdown:3000};setPickup('');void publicApi('focus',{active:true}).catch(()=>{});setHud({...race.current});setRun(n=>n+1);};
  function step(point:WorldPoint,delta:number){
    position.current=point;const r=race.current;if(!r.running||paused||shopping||choosing||modesOpen||boardOpen||publicOpen||delta===0)return;
    if(r.countdown>0){r.countdown=Math.max(0,r.countdown-delta);setHud({...r});return;}
    config.current.boost=Math.max(0,config.current.boost-delta);setNearWall(!broken&&Math.hypot(point[0]-wall[0],point[1]-wall[1])<=85);
    r.elapsed+=delta;if(config.current.mode!=="free"&&trace.current.length<=40000)trace.current.push([r.elapsed,point[0],point[1]]);const target=route[r.next%route.length];
    if(Math.hypot(point[0]-target[0],point[1]-target[1])<(isStair(terrain.staircase,r.next)?terrain.staircase!.reach:terrain.reach)&&(!isStair(terrain.staircase,r.next)||stairArmed.current===r.next)){
      r.next++;setPulse(n=>n+1);setPickup(r.next>route.length?'Tour terminé ✦':r.next===route.length?'Dernière étoile · direction l’arrivée':'★ Étoile attrapée');
      if(config.current.tier>=1&&!config.current.gifted&&r.next===Math.floor(route.length/2)){r.next++;config.current.gifted=true;}
      if(r.next>route.length){r.elapsed=Math.round(r.elapsed);r.running=false;r.done=true;const c=config.current;const key=`${selected}-${c.mode}-${c.equipment}-${c.tier}-${c.bonus}-${runControls.current}`;const finishedId=++lapId.current;if(c.mode!=="ranked")setLaps(old=>[...old,{id:finishedId,friendId:String(friendId),gen:terrain.gen,mode:c.mode==="free"?"free":"training",equipment:c.equipment,tier:c.tier,bonus:c.bonus,controls:runControls.current,ms:r.elapsed,finishedAt:Date.now()}]);const previousBest=records[key]??ghosts.current[ghostId(c.mode,c.equipment,runControls.current)]?.ms;setPersonalBest(previousBest===undefined?"Premier record personnel !":r.elapsed<previousBest?`Nouveau record · −${time(previousBest-r.elapsed)}`:null);setRecords(old=>({...old,[key]:Math.min(old[key]??previousBest??Infinity,r.elapsed)}));const reward=raceReward(r.elapsed,terrain.level,circuitDistance(route),c.equipment);setPrize({...reward,coins:c.mode!=="free"?0:reward.coins});if(c.mode==="free")act({type:"reward",run:c.id,coins:reward.coins});
      if(c.mode==="training")saveGhost();if(c.mode==="ranked"&&ticket.current)void publish();}

    }
    setHud({...r});
  }
  async function publish(){
    if(!ticket.current)return;const completed=epoch.current;setStarting(true);setRetrySend(false);setServerStatus("Vérification et publication du chrono…");
    try{const result=await publicApi('finish',{id:ticket.current,trace:trace.current,controls:runControls.current,inputs:inputLog.current});if(epoch.current===completed){saveGhost();setServerStatus(runCreator.current!==null?(result.ms<runCreator.current?`Défi relevé ! ${time(runCreator.current-result.ms)} de mieux que le créateur.`:result.ms===runCreator.current?"Égalité avec le créateur ! Encore un petit effort pour le dépasser.":`Chrono publié · encore ${time(result.ms-runCreator.current)} à gagner pour battre le créateur.`):`Chrono publié : ${time(result.ms)} · retrouve-le dans le classement public !`);}}
    catch(e){if(epoch.current===completed){setRetrySend(true);setServerStatus(`Chrono non publié : ${e instanceof Error?e.message:"Service indisponible"}`);}}
    finally{if(epoch.current===completed)setStarting(false);}
  }
  function draw(ctx:CanvasRenderingContext2D){
    const r=race.current;ctx.save();ctx.lineJoin="round";
    if(terrain.sidePaths)drawRoadNetwork(ctx,terrain);else{
    ctx.beginPath();
    [...route,route[0]].forEach((p,i)=>{const [x,y]=project(...p);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
    ctx.strokeStyle="#000000";ctx.lineWidth=terrain.width+6;ctx.stroke();ctx.strokeStyle="#ffffff";ctx.lineWidth=terrain.width;ctx.stroke();
    ctx.setLineDash([7,10]);ctx.lineWidth=2;ctx.strokeStyle="#000000";ctx.stroke();ctx.setLineDash([]);
    }
    drawStaircase(ctx,terrain.staircase,route,r.next);
    ctx.canvas.dataset.stairNext=String(isStair(terrain.staircase,r.next)?r.next:0);
    const showBridge=bridgeVisible(terrain.hiddenBridge,r.elapsed);drawHiddenBridge(ctx,terrain.hiddenBridge,r.elapsed);
    const [fx,fy]=project(...spawn);
    for(let row=0;row<2;row++)for(let col=0;col<6;col++){ctx.fillStyle=(row+col)%2?"#fff":"#000000";ctx.fillRect(fx-24+col*8,fy-8+row*8,8,8);}
    ctx.font="bold 13px monospace";ctx.textAlign="center";ctx.fillStyle="#000000";ctx.fillText("DÉPART / ARRIVÉE",fx,fy+30);
    route.forEach((p,i)=>{if(i===0||(!showBridge&&i===terrain.hiddenBridge?.star))return;const [x,y]=project(...p);const collected=r.next>i,active=r.next===i;
      ctx.beginPath();ctx.ellipse(x,y,active?22:16,active?10:7,0,0,Math.PI*2);ctx.fillStyle=collected?"#ffffff":active?"#ffffff":"#ffffff";ctx.fill();ctx.strokeStyle="#000000";ctx.lineWidth=2;ctx.stroke();
      ctx.font=active?"bold 29px monospace":"23px monospace";ctx.fillStyle=collected?"#000000":"#000000";ctx.fillText(collected?"✓":"★",x,y-10);
      ctx.font="bold 11px monospace";ctx.fillText(String(i),x,y+4);
    });
    if(r.next===route.length){ctx.fillStyle="#ffffff";ctx.beginPath();ctx.arc(fx,fy-24,15,0,Math.PI*2);ctx.fill();ctx.fillStyle="#000000";ctx.font="bold 24px monospace";ctx.fillText("★",fx,fy-17);}
    if(r.running&&(showBridge||r.next!==terrain.hiddenBridge?.star)){
      const target=route[r.next%route.length], [tx,ty]=project(...target), [px,py]=project(...position.current);
      ctx.setLineDash([3,8]);ctx.strokeStyle="#000";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(tx,ty);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle="#000";ctx.beginPath();ctx.moveTo(tx,ty-45);ctx.lineTo(tx-8,ty-58);ctx.lineTo(tx+8,ty-58);ctx.closePath();ctx.fill();
    }
    drawMovingBush(ctx,terrain.movingBush,r.elapsed);drawTimedGate(ctx,terrain.timedGate,r.elapsed);ctx.restore();
  }
  if(!ready)return <div className="loading" role={error?"alert":"status"}>{error||"Préparation de ton île…"}{error&&<button onClick={()=>setRetry(n=>n+1)}>Réessayer</button>}</div>;
  if(halloweenOpen)return <HalloweenRace friendId={friendId} paused={paused} cosmetic={halloweenProgress.equipped?'witchhat':cosmetic} trail={trail} onProgress={setHalloweenProgress} onClose={closeHalloween}/>;
  const stars=Math.min(route.length,hud.next-1);
  return <section className="sparking" aria-label="Sparking Stars" inert={paused||undefined}>
    <GameWorld onDestinationPress={destination=>{const r=race.current;if(r.running&&r.countdown===0&&stairPress(terrain.staircase,route,r.next,destination))stairArmed.current=r.next;}} dynamicObjects={()=>terrain.movingRuby?[{position:rubyState(terrain.movingRuby,race.current.elapsed).position,draw:ctx=>drawMovingRuby(ctx,terrain.movingRuby,race.current.elapsed)}]:[]} canTraverse={(from,to)=>bushAllows(terrain.movingBush,race.current.elapsed,from,to)&&rubyAllows(terrain.movingRuby,race.current.elapsed,from,to)&&gateAllows(terrain.timedGate,race.current.elapsed,from,to)} clickTarget={terrain.gen===6&&hud.running&&hud.countdown===0&&hud.next===10?{position:route[10],number:10}:undefined} onControl={recordControl} preloadWorld={terrain.world} ghost={()=>ghostEnabled&&race.current.running&&race.current.countdown===0?sampleGhost(runGhost.current,race.current.elapsed):null} trail={trail} cosmetic={halloweenProgress.equipped?'witchhat':cosmetic} key={`${friendId}-${selected}`} resetRevision={run} friendId={friendId} world={world} spawn={spawn} interactions={noInteractions} onInteract={()=>{}} focusRevision={used?1:0} paused={paused||progressOpen||questsOpen||shopping||choosing||modesOpen||boardOpen||publicOpen||!hud.running} equipment={comparison.equipment} movementScale={point=>race.current.countdown>0?0:(distanceToTrack(point,terrain)>terrain.width/2 ? Math.max(.38,.8-(terrain.level-1)*.08):1)*(config.current.equipment==="kart"?1.45:config.current.equipment==="rollers"?1.2:1)*(config.current.boost>0?1.6:1)} reducedMotion={reduced} onStep={step} drawTrack={draw}/>
    {!hud.running&&<nav className="paddock-nav" aria-label="Le paddock"><button disabled={paused||starting} aria-pressed={modesOpen} onClick={()=>{closePanels();setModesOpen(true);}}>Courir</button><button disabled={paused||starting} aria-pressed={progressOpen||questsOpen||boardOpen||publicOpen} onClick={()=>{closePanels();setProgressOpen(true);}}>Progresser</button><button disabled={paused||starting} aria-pressed={shopping} onClick={()=>{closePanels();setShopMessage("");setShopping(true);}}>Garage</button></nav>}
    {hud.running&&<button className="race-leave" aria-label="Quitter la course" disabled={paused||starting} onClick={returnPaddock}>Quitter</button>}
    {pickup&&<div key={pulse} className="star-feedback" data-testid="star-feedback" role="status">{pickup}</div>}
    <header className="hud"><div><small>{TRACK_PREVIEW?"PISTE EN ESSAI · ":""}GEN {terrain.gen} · TIER {profile?.tier} · {terrain.name.toUpperCase()}</small><h1>Sparking Stars <span>✦</span></h1></div><div className="score"><b data-testid="stars">★ {stars}/{route.length}</b><strong data-testid="timer">{time(hud.elapsed)}</strong><small>Record {comparison.mode==="ranked"?"compétition":comparison.mode==="training"?"entraînement":"libre"} {best===null?"—":time(best)}</small></div></header>
    {!progressOpen&&!questsOpen&&!shopping&&!choosing&&!modesOpen&&!boardOpen&&!publicOpen&&!hud.running&&<div className={`race-card ${hud.done?"finished":""}`} role="status"><small>{hud.done?"TOUR TERMINÉ !":mode==="ranked"?"COMPÉTITION · BÊTA":mode==="training"?"ENTRAÎNEMENT · ILLIMITÉ":"COURSE LIBRE"}</small><h2>{hud.done?"Bien joué, petite étoile ✦":"À tes marques !"}</h2><p>{hud.done?`${route.length} étoiles · ${time(hud.elapsed)}`:terrain.subtitle}</p>{prize&&<>{personalBest&&<div className="record-ribbon">{personalBest}</div>}<div className="medal-emblem" aria-hidden="true">{prize.medal==="Or"?"✦":prize.medal==="Argent"?"◇":"○"}</div><p className="prize" data-testid="prize">{prize.medal} · {comparison.mode==="ranked"?"Course classée · sans gain RF":comparison.mode==="training"?"Entraînement sans récompense":`+${prize.coins} pièces de test`}</p><p className="finish-tip">{prize.medal==="Or"?"Objectif Or atteint ! À toi de battre ton record.":`Encore ${time(Math.max(0,hud.elapsed-(prize.medal==="Argent"?targets.gold:targets.silver)*1000))} à gagner pour ${prize.medal==="Argent"?"l’Or":"l’Argent"}.`}</p></>}<p className="server-status" role="status">{serverStatus}</p>{hud.done&&<><p role="status" data-testid="quest-notice">{questNotice}</p><button onClick={()=>setQuestsOpen(true)}>Voir mes quêtes</button></>}{retrySend&&<button disabled={starting} onClick={()=>void publish()}>Réessayer l’envoi</button>}<details className="race-details"><summary>Détails du tour</summary><small>{labels[comparison.equipment]} · {comparison.tier>=1?"1 étoile offerte":"Toutes les étoiles"}</small><div className="medal-targets"><span>✦ Or ≤ {time(targets.gold*1000)}</span><span>◇ Argent ≤ {time(targets.silver*1000)}</span></div>{mode!=="free"&&<small className="ghost-reference">{!ghostEnabled?"Fantôme masqué · réglage dans Progresser":challengeGhost&&quests.current[ghostId(mode,trainingEquipment)]?.target?`Fantôme du défi · ${time(quests.current[ghostId(mode,trainingEquipment)].target!.ms)}`:ghosts.current[ghostId(mode,trainingEquipment)]?`Fantôme personnel · ${time(ghosts.current[ghostId(mode,trainingEquipment)].ms)}`:"Ton premier tour terminé créera ton fantôme."}</small>}<small className="ghost-reference">{controlLabel(controls)} · <span data-testid="ghost-storage">{ghostStorage}</span></small></details><button className="race-start" disabled={paused||starting} onClick={start}>{hud.done?"Rejouer":"C’est parti !"}</button>{hud.done&&<button className="return-paddock" disabled={starting} onClick={returnPaddock}>Retour au paddock</button>}</div>}
    {!progressOpen&&!questsOpen&&!shopping&&!choosing&&!modesOpen&&!boardOpen&&!publicOpen&&hud.running&&<div className="race-status"><small data-testid="race-controls">{controlLabel(controls)}</small><span aria-live="polite">{hud.next===route.length?"Dernière étoile : retourne à l’arrivée !":`Direction l’étoile ${hud.next} →`}</span><p className="server-status" role="status">{serverStatus}</p>{retrySend&&<button disabled={starting} onClick={()=>void publish()}>Réessayer l’envoi</button>}<button disabled={paused||starting} onClick={start}>Recommencer</button></div>}
    {!progressOpen&&!questsOpen&&!shopping&&!choosing&&!modesOpen&&!boardOpen&&!publicOpen&&hud.running&&<><div className="race-progress" aria-label="Progression du circuit"><div style={{width:`${100*stars/route.length}%`}}/></div><div className="pace-label">{hud.countdown>0?"Prépare-toi…":hud.next===route.length?"Dernière étoile · retourne à l’arrivée":offroad?"HORS-PISTE · tu ralentis":hud.elapsed<=targets.gold*1000?`Objectif Or · ${time(Math.max(0,targets.gold*1000-hud.elapsed))}`:hud.elapsed<=targets.silver*1000?`Objectif Argent · ${time(Math.max(0,targets.silver*1000-hud.elapsed))}`:"Finis le tour pour décrocher le Bronze"}</div></>}
    {!progressOpen&&!questsOpen&&!shopping&&!choosing&&!modesOpen&&!boardOpen&&!publicOpen&&hud.running&&hud.countdown>0&&<div className="countdown" role="status" aria-live="polite"><small>À TES MARQUES</small><strong>{Math.ceil(hud.countdown/1000)}</strong><span>{labels[config.current.equipment]} · GEN {terrain.gen}</span></div>}
    {boardOpen&&<Leaderboard onPublic={()=>{setBoardOpen(false);setPublicOpen(true);}} controls={controls} ghosts={ghosts.current} friend={String(friendId)} laps={laps} gen={terrain.gen} equipment={comparison.equipment} mode={comparison.mode} tier={comparison.tier} bonus={comparison.bonus as Bonus} onClose={()=>setBoardOpen(false)}/>}
    {publicOpen&&<PublicBoard controls={controls} gen={terrain.gen} equipment={comparison.equipment} onClose={()=>setPublicOpen(false)}/>}
    {progressOpen&&<div className="mode-panel progress-panel" role="dialog" aria-label="Ta progression"><div className="picker-heading"><div><small>TON PARCOURS</small><h2>Chaque tour compte</h2></div><button onClick={()=>setProgressOpen(false)}>Retour à la piste</button></div><div className="progress-links"><button aria-label="Quêtes" onClick={()=>{closePanels();setQuestsOpen(true);}}><strong>Quêtes</strong><span>Petites victoires et défi renouvelable</span></button><button aria-label="Chronos" onClick={()=>{closePanels();setBoardOpen(true);}}><strong>Chronos</strong><span>Records personnels et classement public</span></button></div><section className="ghost-settings"><h3>Ton fantôme</h3><p className="shop-note" role="status">{ghostStorage}</p><label className="ghost-option"><input type="checkbox" checked={ghostEnabled} onChange={e=>setGhostEnabled(e.target.checked)}/> Afficher le fantôme de mon meilleur tour</label><p className="shop-note">En entraînement et compétition, par GEN et équipement. Fantôme sauvegardé sur cet appareil, sans collision. Tactile et clavier / souris ont chacun leur fantôme. En compétition, seuls les tours acceptés sont enregistrés. Masqué par défaut avec la réduction des animations.</p></section>      <CreatorChallenge controls={controls} gen={terrain.gen} onChoose={ms=>{setCreatorTarget(ms);setMode("ranked");setTrainingEquipment("feet");race.current=fresh();setHud(fresh());setPrize(null);setPersonalBest(null);setServerStatus(`Défi du créateur · bats ${time(ms)} à pied.`);closePanels();}}/></div>}
    {questsOpen&&<QuestPanel category={`GEN ${terrain.gen} · ${mode==="training"?"Entraînement":mode==="ranked"?"Compétition":"Course libre"} · ${labels[trainingEquipment]} · ${controlLabel(controls)}`} key={questRevision} state={quests.current[ghostId(mode,trainingEquipment)]} challenging={challengeGhost} onChallenge={()=>{setChallengeGhost(v=>!v);setGhostEnabled(true);setQuestsOpen(false);}} onClose={()=>setQuestsOpen(false)}/>}
    {modesOpen&&<div className="mode-panel" role="dialog" aria-label="Modes de course"><div className="picker-heading"><div><small>LE PADDOCK</small><h2>Choisis ta course</h2></div><button onClick={()=>setModesOpen(false)}>Fermer</button></div>
      <button className="halloween-entry" onClick={()=>{returnPaddock();setHalloweenOpen(true);}}>Halloween · La boucle hantée</button>
      <button className="terrain-link" onClick={()=>{closePanels();setChoosing(true);}}>Les 6 terrains</button>

      <div className="mode-grid">
        <button aria-pressed={mode==="training"} onClick={()=>{setCreatorTarget(null);setMode("training");race.current=fresh();setHud(fresh());setPrize(null);setPersonalBest(null);}}><strong>Entraînement</strong><span>Départs illimités · aucune énergie dépensée</span><span>Toutes les étoiles, sans consommable ni gain de pièces. Record personnel par équipement.</span></button>
        <button disabled={TRACK_PREVIEW} aria-pressed={mode==="free"} onClick={()=>{setCreatorTarget(null);setMode("free");race.current=fresh();setHud(fresh());setPrize(null);setPersonalBest(null);}}><strong>Course libre</strong><span>Pièces de test selon ton chrono</span><span>Avantages du tier et bonus équipés. Rollers et kart : 3 départs par session chacun.</span></button>
        <button disabled={TRACK_PREVIEW} aria-pressed={mode==="ranked"} onClick={()=>{setCreatorTarget(null);setMode("ranked");race.current=fresh();setHud(fresh());setPrize(null);setPersonalBest(null);setServerStatus("");}}><strong>Compétition · bêta</strong><span>Classement public quotidien, hebdomadaire et mensuel</span><span>Toutes les étoiles, aucun bonus ni étoile offerte. Signature gratuite au premier départ. Aucun gain RF.</span></button>
      </div>
      {mode!=="free"&&<><h3>Ton équipement d’entraînement</h3><div className="loadout">{(["feet","rollers","kart"] as Equipment[]).map(e=><button key={e} disabled={mode==="ranked"?(e==="rollers"?wallet.tier<2:e==="kart"?wallet.tier<4:false):!wallet.owned.includes(e)} aria-pressed={trainingEquipment===e} onClick={()=>{setTrainingEquipment(e);race.current=fresh();setHud(fresh());setPrize(null);setPersonalBest(null);}}>{labels[e]}{mode==="ranked"?(e==="feet"?"":e==="rollers"?" · tier 2+":" · tier 4"):wallet.owned.includes(e)?" · illimité":" · à acheter"}</button>)}</div><p>Les équipements de ton garage restent utilisables ici, même sans énergie.</p></>}
      <label className="ghost-option">Commandes <select aria-label="Commandes de course" value={controls} onChange={e=>{setControls(e.target.value as Controls);setCreatorTarget(null);}}><option value="touch">Tactile</option><option value="desktop">Clavier / souris</option></select></label><p className="shop-note">Une souris, un stylet ou une touche de déplacement classe automatiquement le tour côté clavier / souris, même sur téléphone.</p>
      <p className="shop-note">Les courses classées acceptées sont enregistrées en ligne. Entraînement et course libre restent propres à cette session.</p><button onClick={()=>setModesOpen(false)}>Retour à la piste</button>
    </div>}
    {shopping&&<Shop onRestoreCosmetic={setCosmetic} halloween={halloweenProgress} onHalloweenEquip={value=>{if(!paused)void equipHalloween(value);}} friendId={friendId} trail={trail} onTrail={id=>{if(!paused)setTrail(id);}} cosmetic={cosmetic} onCosmetic={id=>{if(!paused){setCosmetic(id);if(halloweenProgress.equipped)void equipHalloween(false);}}} wallet={wallet} message={shopMessage} act={a=>{if(!paused)act(a);}} onClose={()=>setShopping(false)}/>}
    {!progressOpen&&!questsOpen&&!shopping&&!choosing&&!modesOpen&&!boardOpen&&!publicOpen&&hud.running&&<div className="bonus-bar"><span>{labels[config.current.equipment]}{config.current.boost>0?" · BOOST !":""}</span><button disabled={paused||hud.countdown>0||used||config.current.bonus==="none"||(config.current.bonus==="breaker"&&!nearWall)} onClick={useBonus}>{used?"Bonus utilisé":config.current.bonus==="none"?"Aucun bonus":`${labels[config.current.bonus]} · Espace`}</button></div>}
    {choosing&&<div className="terrain-picker" role="dialog" aria-label="Choisir un terrain"><div className="picker-heading"><div><small>SPARKING STARS · EXPLORATION</small><h2>Six îles. Six défis.</h2></div><button onClick={()=>setChoosing(false)}>Fermer</button></div><p>{TRACK_PREVIEW?`La GEN ${PREVIEW_GENERATION} est ouverte en entraînement avec ton Friend. Tu peux aussi retrouver sa GEN officielle.`:"Ton terrain correspond à la GEN officielle de ton Friend. Les autres îles restent visibles en aperçu."}</p><div className="terrain-grid">{terrains.map((t,i)=><button key={t.gen} disabled={t.gen!==profile?.generation&&!(TRACK_PREVIEW&&t.gen===PREVIEW_GENERATION)} aria-pressed={selected===i} onClick={()=>{if(paused||(t.gen!==profile?.generation&&!(TRACK_PREVIEW&&t.gen===PREVIEW_GENERATION)))return;setSelected(i);race.current=fresh();setHud(fresh());setRun(n=>n+1);setChoosing(false);}}><small>GEN {t.gen} · {t.difficulty}</small><svg viewBox="0 0 576 384" aria-hidden="true"><polygon points={t.shape.map(p=>p.join(",")).join(" ")} fill="white" stroke="black" strokeWidth="8"/><polyline points={[...t.route,t.route[0]].map(p=>p.join(",")).join(" ")} fill="none" stroke="black" strokeWidth="10"/>{t.holes.map((h,j)=><rect key={j} x={h[0]} y={h[1]} width={h[2]} height={h[3]} fill="black"/>)}</svg><strong>{t.name}</strong><span>{t.route.length} étoiles · {TRACK_PREVIEW&&t.gen===PREVIEW_GENERATION?"Essai avec ton Friend":t.gen!==profile?.generation?`Friend GEN ${t.gen} requis`:Object.keys(records).some(k=>k.startsWith(`${i}-`))?"Record enregistré":"À découvrir"}</span></button>)}</div></div>}
    <footer className="hint">Flèches / ZQSD / WASD · Clic maintenu pour suivre le curseur · Touche le sol pour marcher<small>Hors-piste = ralenti · {mode==="ranked"?"Compétition bêta · sans gain RF":mode==="training"?"Entraînement sans récompense":"Course libre · pièces de test"} · Collection Constellations sauvegardée</small></footer>
  </section>;
}
