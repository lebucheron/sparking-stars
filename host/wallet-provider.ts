import {createEVMClient} from '@metamask/connect-evm';
import type {FriendWalletProvider} from '@rarefriends/friendsdk/wallet';
// Keep injected wallets unchanged. The relay starts only on SDK Connect wallet.
export function createRelayProvider(factory=createEVMClient):FriendWalletProvider{
 let remote:FriendWalletProvider|undefined;
 let initializing:Promise<Awaited<ReturnType<typeof createEVMClient>>>|undefined;
 const listeners=new Map<"accountsChanged"|"chainChanged"|"connect"|"disconnect",Set<(...args:any[])=>void>>();
 async function client(){
  if(!initializing)initializing=factory({dapp:{name:'Sparking Stars',url:'https://lebucheron.github.io/sparking-stars/'},api:{supportedNetworks:{'0x1237':'https://rpc.mainnet.chain.robinhood.com'}},skipAutoAnnounce:true}).then(c=>{remote=c.getProvider() as unknown as FriendWalletProvider;for(const [event,handlers] of listeners)for(const handler of handlers)remote.on?.(event,handler);return c;}).catch(e=>{initializing=undefined;throw e;});
  return initializing;
 }
 return {
  async request(args){
   if(args.method==='eth_requestAccounts'){const c=await client();const result=await c.connect({chainIds:['0x1237']});return result.accounts;}
   if(!remote){if(args.method==='eth_accounts')return [];if(args.method==='eth_chainId')return '0x1237';throw new Error('Connecte MetaMask avec le bouton Connect wallet.');}
   return remote.request(args);
  },
  on(event,handler){if(!listeners.has(event))listeners.set(event,new Set());listeners.get(event)!.add(handler);remote?.on?.(event,handler);},
  removeListener(event,handler){listeners.get(event)?.delete(handler);remote?.removeListener?.(event,handler);}
 };
}
export const injected=(window as unknown as {ethereum?:FriendWalletProvider}).ethereum;
export const walletProvider=injected??createRelayProvider();
