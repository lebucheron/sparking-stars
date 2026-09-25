import {PilotPortrait} from "./pilot-portrait";
import {useEffect,useRef} from "react";
import {cosmetics,drawCosmetic,trails,type Trail,type Cosmetic} from "./cosmetics";
function Swatch({id}:{id:Cosmetic}){
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{const c=canvas.current?.getContext("2d");if(!c)return;c.clearRect(0,0,150,100);drawCosmetic(c,id,75,65);if(id==="none"){c.strokeStyle="#000";c.lineWidth=2;c.strokeRect(60,40,30,30);}},[id]);
 return <canvas ref={canvas} width={150} height={100} aria-hidden="true"/>;
}
export function Wardrobe({value,onChange,friendId,trail,onTrail}:{value:Cosmetic;onChange:(id:Cosmetic)=>void;friendId:bigint;trail:Trail;onTrail:(id:Trail)=>void}){
 return <section className="wardrobe" aria-label="Vestiaire"><div className="wardrobe-hero"><PilotPortrait friendId={friendId} cosmetic={value}/><div><small>ÉCURIE SPARKING STARS</small><h3>Ton pilote. Ton style.</h3><strong>{cosmetics.find(c=>c.id===value)?.name}</strong><p>Friend #{String(friendId)} · collection de lancement</p><span className="style-stamp">100 % STYLE · 0 % AVANTAGE</span></div></div><p>Quatre looks offerts pour essayer. Aucun effet sur le chrono ou les capacités. Équipé jusqu’au rechargement.</p><div className="cosmetic-grid">{cosmetics.map(item=><button key={item.id} aria-pressed={value===item.id} onClick={()=>onChange(item.id)}><Swatch id={item.id}/><strong>{item.name}</strong><span>{item.description}</span><small>{value===item.id?"Équipé":"Équiper · offert"}</small></button>)}</div><h3>Choisis ton sillage</h3><div className="trail-grid">{trails.map(t=><button key={t.id} aria-pressed={trail===t.id} onClick={()=>onTrail(t.id)}><b aria-hidden="true">{t.symbol}</b><span>{t.name}</span><small>{trail===t.id?"Équipé":"Équiper · offert"}</small></button>)}</div><p>Le sillage apparaît en mouvement. Il est désactivé si tu préfères réduire les animations.</p></section>;
}
