
import {useEffect,useState} from 'react';
import {publicApi} from './public-api';
import {preciseTime} from './leaderboard-model';
import {terrains} from './terrains';
import {RULES} from './rules-version';
import {controlLabel,type Controls} from './controls';
export function CreatorChallenge({controls='desktop',gen,onChoose}:{controls?:Controls;gen:number;onChoose:(ms:number)=>void}){
 const [ms,setMs]=useState<number|null>(null),[status,setStatus]=useState('Chargement du défi…'),[retry,setRetry]=useState(0);
 useEffect(()=>{let active=true;setMs(null);setStatus('Chargement du défi…');publicApi('creator',{controls}).then(data=>{if(!active)return;if(data.rules!==RULES||data.controls!==controls)throw new Error('Aucun défi disponible pour ces commandes.');setMs(data.ms);setStatus(data.ms===null?`Le créateur prépare son prochain tour ${controlLabel(controls)}.`:'');}).catch(e=>{if(active)setStatus(e.message);});return()=>{active=false;};},[retry,controls]);
 return <section className="creator-card" aria-label="Le défi du créateur"><div className="creator-portrait"><div className="creator-emblem" aria-hidden="true">✦</div><small>LE BÛCHERON · FRIEND #331213</small></div><div><small>LE DÉFI DU CRÉATEUR</small><h3>Mon île. Mon chrono.<br/>À vous de faire mieux.</h3><p>{terrains[2].name} · GEN 3 · à pied · toutes les étoiles.</p>{ms!==null?<strong className="creator-time">{preciseTime(ms)}</strong>:<p role="status">{status}</p>}<p>Une course classée, sans bonus. La référence vient d’un tour accepté avec les commandes actuelles.</p><button disabled={gen!==3||ms===null} onClick={()=>ms!==null&&onChoose(ms)}>{gen===3?'Relever le défi':'Friend GEN 3 requis'}</button><button className="creator-refresh" onClick={()=>setRetry(n=>n+1)}>Actualiser le défi</button><small>Aucun lot promis · juste le plaisir de battre le créateur.</small></div></section>;
}
