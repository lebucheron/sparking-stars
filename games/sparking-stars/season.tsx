
import {useEffect,useRef,useState} from 'react';
import {publicApi} from './public-api';
import {seasonItems,type StyleState} from './season-catalog';
import {drawCosmetic,drawTrail,type Cosmetic,type Trail} from './cosmetics';
function Preview({item}:{item:typeof seasonItems[number]}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{const c=ref.current?.getContext('2d');if(!c)return;c.clearRect(0,0,150,90);if(item.kind==='cosmetic')drawCosmetic(c,item.id as Cosmetic,75,58);else for(let i=0;i<4;i++)drawTrail(c,item.id as Trail,35+i*25,55-i*7,5+i);},[item]);
 return <canvas ref={ref} width={150} height={90} aria-hidden="true"/>;
}
export function Season({friendId,onCosmetic,onTrail}:{friendId:bigint;onCosmetic:(id:Cosmetic)=>void;onTrail:(id:Trail)=>void}){
 const [state,setState]=useState<StyleState|null>(null),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 const version=useRef(0);
 async function update(operation='read',item?:string,kind?:string){
  if(busy)return;const v=version.current;setBusy(true);setMessage('');
  try{const data:StyleState=await publicApi('style',{friendId:String(friendId),operation,item,kind});if(v!==version.current)return;setState(data);onCosmetic(data.cosmetic as Cosmetic);onTrail(data.trail as Trail);setMessage(operation==='buy'?'Accessoire ajouté à ta collection !':operation==='equip'?'Style équipé et sauvegardé.':'Collection synchronisée.');}
  catch(e){if(v===version.current)setMessage(e instanceof Error?e.message:'Collection indisponible.');}
  finally{if(v===version.current)setBusy(false);}
 }
 useEffect(()=>{version.current++;setState(null);void update();return()=>{version.current++;};},[friendId]);
 return <section className="season" aria-label="Saison Constellations"><header><small>MINI-SAISON 01 · PASS GRATUIT</small><h3>CONSTELLATIONS ✦</h3><p>Du 26 septembre au 23 octobre 2026 inclus (UTC).</p></header>
 <p>Les étoiles de la piste mesurent ta course. Les <strong>étoiles de style</strong> habillent ton Friend : 10 pour chacune des 3 premières courses classées acceptées du jour.</p>
 <div className="season-balance"><strong>{state?`${state.balance} ✦ étoiles de style`:'Ta collection sauvegardée'}</strong><button disabled={busy} onClick={()=>void update()}>Actualiser la collection</button></div>
 <p role="status">{busy?'Synchronisation…':message}</p>
 {state&&<><p>{state.active?`${state.daily}/3 courses récompensées aujourd’hui · ${state.laps} courses pour le pass`:'Saison terminée · ta collection et tes étoiles restent disponibles.'}</p><h4>Les défis du pass · offerts</h4><div className="season-grid">{seasonItems.filter(i=>i.laps).map(item=>{const owned=state.owned.includes(item.id),equipped=state[item.kind]===item.id;return <article key={item.id}><Preview item={item}/><h4>{item.name}</h4><p>{item.description}</p><progress value={Math.min(state.laps,item.laps)} max={item.laps}/><small>{Math.min(state.laps,item.laps)}/{item.laps} courses classées terminées</small><button disabled={busy||!owned||equipped} onClick={()=>void update('equip',item.id,item.kind)}>{equipped?'Équipé':owned?'Équiper':'À débloquer'}</button></article>;})}</div>
 <h4>La boutique des constellations</h4><div className="season-grid">{seasonItems.filter(i=>i.cost).map(item=>{const owned=state.owned.includes(item.id),equipped=state[item.kind]===item.id;return <article key={item.id}><Preview item={item}/><h4>{item.name}</h4><p>{item.description}</p><button disabled={busy||equipped||!owned&&state.balance<item.cost} onClick={()=>void update(owned?'equip':'buy',item.id,item.kind)}>{equipped?'Équipé':owned?'Équiper':`Obtenir · ${item.cost} ✦`}</button></article>;})}</div><div className="loadout"><button disabled={busy} onClick={()=>void update('equip','none','cosmetic')}>Retirer l’accessoire</button><button disabled={busy} onClick={()=>void update('equip','none','trail')}>Retirer le sillage</button></div></>}
 <p className="shop-note">Tout est gratuit et purement esthétique : aucun gain de vitesse. Solde et collection liés au Friend, conservés après rechargement. Aucun RF réel, achat en argent ou valeur de retrait. La boutique restera accessible après cette mini-saison ; les accessoires pourront revenir dans de futures sélections.</p>
 </section>;
}
