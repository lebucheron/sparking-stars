
import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {stringToHex} from 'viem';
import {GameHost} from '@rarefriends/friendsdk/runtime';
import {parseChanceGame} from '@rarefriends/friendsdk/game';
import type {FriendWalletProvider} from '@rarefriends/friendsdk/wallet';
import '@rarefriends/friendsdk/frame.css';
import '@rarefriends/friendsdk/runtime.css';
import '../games/sparking-stars/host.css';
import {MobileWalletHelp} from './mobile-wallet-help';
import {DemoRecorder} from './demo-recorder';
import definitionJson from '../games/sparking-stars/game.json';
const definition=parseChanceGame(definitionJson);
const API='https://hkudnvqseodizcplkgvw.supabase.co/functions/v1/sparking-api';
const provider=(window as unknown as {ethereum?:FriendWalletProvider}).ethereum;
let token='',expiry=0,revision=0,friendId='',busy=false;
const clear=()=>{token='';expiry=0;friendId='';revision++;};
async function request(body:unknown,auth=false){
 const response=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json',...(auth?{'Authorization':`Bearer ${token}`}:{})},body:JSON.stringify(body),signal:AbortSignal.timeout(25000)});
 const data=await response.json();if(!response.ok||data.error)throw new Error(data.error||'Serveur indisponible.');return data;
}
async function account(){
 if(!provider)throw new Error('Ouvre le jeu dans ton navigateur avec MetaMask pour le classement.');
 const [accounts,chain]=await Promise.all([provider.request({method:'eth_accounts'}),provider.request({method:'eth_chainId'})]);
 if(chain!=='0x1237'||!Array.isArray(accounts)||typeof accounts[0]!=='string')throw new Error('Connecte ton wallet sur Robinhood dans le jeu.');return accounts[0].toLowerCase();
}
function App(){
 const [cinema,setCinema]=useState(false);
 useEffect(()=>{const changed=()=>setCinema(Boolean(document.fullscreenElement));document.addEventListener('fullscreenchange',changed);return()=>document.removeEventListener('fullscreenchange',changed);},[]);
 async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.querySelector('.paddock-window')?.requestFullscreen();}catch{setNotice('Le plein écran est indisponible dans ce navigateur.');}}
 const [notice,setNotice]=useState('Classement bêta · signature gratuite pour publier tes courses.'),[working,setWorking]=useState(false);
 useEffect(()=>{
  const reset=()=>{clear();setNotice('Session classement fermée. Active-la de nouveau pour publier.');};
  provider?.on?.('accountsChanged',reset);provider?.on?.('chainChanged',reset);provider?.on?.('disconnect',reset);
  const loaded=(e:Event)=>{if(e.target instanceof HTMLIFrameElement)reset();};document.addEventListener('load',loaded,true);
  const listener=async(e:MessageEvent)=>{
   const frame=document.querySelector('iframe');
   if(!frame||e.source!==frame.contentWindow||e.data?.type!=='sparking-public-v1'||e.ports.length!==1)return;
   const port=e.ports[0],r=revision,{action,payload}=e.data;
   try{
    if(!payload||typeof payload!=='object'||!['prepare','board','start','finish','style','creator'].includes(action))throw new Error('Action refusée.');
    if(action==='prepare'){
     if(typeof payload.friendId!=='string'||!/^[1-9][0-9]{0,77}$/.test(payload.friendId))throw new Error('Friend incorrect.');
     if(friendId!==payload.friendId){clear();friendId=payload.friendId;setNotice('Classement bêta · signature gratuite pour publier tes courses.');}port.postMessage({ready:true});return;
    }
    if(action==='creator'){port.postMessage(await request({action:'creator'}));return;}
    if(action==='board'){const data=await request({action,gen:payload.gen,equipment:payload.equipment,period:payload.period});port.postMessage(data);return;}
    if(action==='start'&&typeof payload.friendId==='string'&&/^[1-9][0-9]{0,77}$/.test(payload.friendId))friendId=payload.friendId;
    if(!token||expiry<Date.now())throw new Error('Clique « Activer le classement » au-dessus du jeu, puis relance la course.');
    const exclusive=!(action==='style'&&payload.operation==='read');if(exclusive&&busy)throw new Error('Une demande est déjà en cours.');if(exclusive)busy=true;
    try{
     await account();const body=action==='style'?{action,friendId:payload.friendId,operation:payload.operation,item:payload.item,kind:payload.kind}:action==='start'?{action,friendId:payload.friendId,equipment:payload.equipment,rules:payload.rules}:{action,id:payload.id,trace:payload.trace};
     const data=await request(body,true);if(r!==revision||frame!==document.querySelector('iframe'))throw new Error('Le pilote a changé.');port.postMessage(data);
    }finally{if(exclusive)busy=false;}
   }catch(err){port.postMessage({error:err instanceof Error?err.message:'Classement indisponible.'});}finally{port.close();}
  };
  window.addEventListener('message',listener);return()=>{window.removeEventListener('message',listener);document.removeEventListener('load',loaded,true);provider?.removeListener?.('accountsChanged',reset);provider?.removeListener?.('chainChanged',reset);provider?.removeListener?.('disconnect',reset);clear();};
 },[]);
 async function login(){
  if(working)return;setWorking(true);const r=revision;
  try{
   if(!friendId)throw new Error('Connecte ton wallet et choisis ton Friend dans le jeu.');
   const wallet=await account(),challenge=await request({action:'challenge',wallet,friendId});
   // Never sign an arbitrary string supplied by the sandbox.
   if(typeof challenge.message!=='string'||!challenge.message.startsWith(`lebucheron.github.io wants you to sign in with your Ethereum account:\n${wallet}\n`)||!challenge.message.includes('URI: https://lebucheron.github.io/sparking-stars/')||!challenge.message.includes('Chain ID: 4663'))throw new Error('Demande de connexion incorrecte.');
   setNotice('Confirme la signature de connexion dans ton wallet. Aucun paiement.');
   const signature=await provider!.request({method:'personal_sign',params:[stringToHex(challenge.message),wallet]});
   if(r!==revision||await account()!==wallet)throw new Error('Wallet modifié.');
   const session=await request({action:'login',id:challenge.id,signature});if(r!==revision)throw new Error('Session modifiée.');
   token=session.token;expiry=session.expiresAt;document.querySelector('iframe')?.contentWindow?.postMessage({type:'sparking-session-ready'},'*');setNotice('Classement activé pour une heure · relance ta course classée !');
  }catch(e){setNotice(e instanceof Error?e.message:'Connexion refusée.');}finally{setWorking(false);}
 }
 return <section className="paddock-window" aria-label="Sparking Stars — le paddock">
  <header className="paddock-titlebar"><div className="paddock-brand"><span className="paddock-mark" aria-hidden="true">✦</span><div><strong>SPARKING STARS</strong><small>RARE FRIENDS · RACE CLUB</small></div></div><div className="paddock-window-actions"><DemoRecorder/><span className="season-tag">01 / CONSTELLATIONS</span><button className="cinema-button" onClick={()=>void fullscreen()} aria-pressed={cinema}>{cinema?"Quitter le plein écran":"Mode cinéma ↗"}</button></div></header>
  <MobileWalletHelp/>
  <aside className="paddock-connection" aria-label="Connexion au classement"><span className="connection-note" role="status">{notice}</span><button disabled={working} onClick={login}>Activer le classement</button></aside>
  <div className="paddock-stage"><GameHost definition={definition} frameUrl="./game.html" walletProvider={provider}/></div>
  <footer className="paddock-footer"><span>6 ÎLES / UN CHRONO À BATTRE</span><span className="footer-checks" aria-hidden="true"/><span>BÊTA · 100 % MONOCHROME</span></footer>
 </section>;
}
createRoot(document.getElementById('root')!).render(<App/>);
