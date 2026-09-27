
// A narrow application bridge. Wallet and credentials stay in the trusted host.
export async function publicApi(action:'context'|'prepare'|'start'|'finish'|'board'|'style'|'creator',payload:Record<string,unknown>={}){
 return new Promise<any>((resolve,reject)=>{
  const channel=new MessageChannel(),timer=setTimeout(()=>{channel.port1.close();reject(new Error('Classement indisponible. L’entraînement reste accessible.'));},30000);
  channel.port1.onmessage=e=>{clearTimeout(timer);channel.port1.close();e.data?.error?reject(new Error(e.data.error)):resolve(e.data);};
  window.parent.postMessage({type:'sparking-public-v1',action,payload},'*',[channel.port2]);
 });
}
