import React,{useEffect,useState} from 'react';
const GAME='https://lebucheron.github.io/sparking-stars/';
// Official MetaMask dapp universal-link format. Fixed destination, no query data.
export function MobileWalletHelp(){
 const [wallet,setWallet]=useState(Boolean((window as any).ethereum));
 const [copied,setCopied]=useState('');
 useEffect(()=>{const found=()=>setWallet(true);window.addEventListener('ethereum#initialized',found);window.addEventListener('eip6963:announceProvider',found);window.dispatchEvent(new Event('eip6963:requestProvider'));return()=>{window.removeEventListener('ethereum#initialized',found);window.removeEventListener('eip6963:announceProvider',found);};},[]);
 if(wallet)return null;
 return <aside className="mobile-wallet-help" aria-label="Jouer sur téléphone"><strong>Ton Friend sur téléphone</strong><p>Ouvre le jeu dans le navigateur de MetaMask, puis sélectionne Robinhood et le compte qui possède ton Friend.</p><a className="mobile-wallet-open" href="https://metamask.app.link/dapp/lebucheron.github.io/sparking-stars/">Ouvrir dans MetaMask</a><details><summary>L’application ne s’ouvre pas ?</summary><p>Dans MetaMask, ouvre son navigateur et colle ce lien :</p><a className="mobile-game-url" href={GAME}>{GAME}</a><button onClick={async()=>{try{await navigator.clipboard.writeText(GAME);setCopied('Lien copié.');}catch{setCopied('Sélectionne le lien ci-dessus pour le copier.');}}}>Copier le lien du jeu</button><span role="status">{copied}</span></details></aside>;
}
