export function resolveRaceControls(start:unknown,claimed:unknown,inputs:unknown,ms:number):'touch'|'desktop'{
 const reject=():never=>{throw new Error('Commandes de course incohérentes.');};
 if(!['touch','desktop'].includes(String(start))||!Array.isArray(inputs)||inputs.length<1||inputs.length>4000)return reject();
 let result=start as 'touch'|'desktop',last=0;
 for(const input of inputs){
  if(!input||!Number.isFinite(input.ms)||input.ms<last||input.ms>ms||!['touch','mouse','pen','keyboard'].includes(input.kind))return reject();
  last=input.ms;if(input.kind!=='touch')result='desktop';
 }
 if(claimed!==result)return reject();return result;
}
