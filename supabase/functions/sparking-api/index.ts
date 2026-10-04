
import {createClient} from 'npm:@supabase/supabase-js@2.57.4';
import {createPublicClient,http,parseAbi} from 'npm:viem@2.56.3';
import {validateTrace,RULES} from './validation.js';
import {resolveRaceControls} from '../../../server/control-validation.ts';
const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
const rpc=createPublicClient({transport:http('https://rpc.mainnet.chain.robinhood.com',{timeout:10000,retryCount:1})});
const collection='0x14C49e6118F46525dE9ab41a51cBAA3c6EBF181D';
const abi=parseAbi(['function ownerOf(uint256) view returns(address)','function generation(uint256) view returns(uint8)','function activationManager() view returns(address)','function positions(address,uint256) view returns(uint8 tier,uint256 weight)']);
const origins=new Set(['https://lebucheron.github.io','http://localhost:4174','http://127.0.0.1:4174']);
const sha=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),b=>b.toString(16).padStart(2,'0')).join('');
function fail(message:string):never {throw new Error(message);}
function check(ok:unknown,message='Requête incorrecte.'):asserts ok {if(!ok)fail(message);}
async function result(q:any){const {data,error}=await q;if(error)fail('Action refusée ou service indisponible. Réessaie dans une minute.');return data;}
async function profile(friend:string,wallet:string){
 check(typeof friend==='string'&&/^[1-9][0-9]{0,77}$/.test(friend));
 check(await rpc.getChainId()===4663,'Réseau indisponible.');
 const blockNumber=await rpc.getBlockNumber({cacheTime:0}),args=[BigInt(friend)] as const;
 const [owner,generation,manager]=await Promise.all([
 rpc.readContract({address:collection,abi,functionName:'ownerOf',args,blockNumber}),
 rpc.readContract({address:collection,abi,functionName:'generation',args,blockNumber}),
 rpc.readContract({address:collection,abi,functionName:'activationManager',blockNumber})]);
 check(owner.toLowerCase()===wallet,'Ce wallet ne possède pas ce Friend.');
 const [tier]=await rpc.readContract({address:manager,abi,functionName:'positions',args:[collection,BigInt(friend)],blockNumber});
 check(generation>=1&&generation<=6&&tier<=4,'GEN ou tier non pris en charge.');return {generation,tier};
}
Deno.serve(async(req)=>{
 const origin=req.headers.get('origin')??'';
 const headers={'content-type':'application/json','cache-control':'no-store','vary':'Origin',...(origins.has(origin)?{'access-control-allow-origin':origin,'access-control-allow-headers':'content-type,authorization','access-control-allow-methods':'POST, OPTIONS'}:{})};
 const send=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers});
 if(origin&&!origins.has(origin))return send({error:'Origine refusée.'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return send({error:'POST requis.'},405);
 try{
  // Bound the stream itself: Content-Length is not trusted.
  check(req.body);const reader=req.body.getReader(),chunks:Uint8Array[]=[];let bytes=0;
  for(;;){const {value,done}=await reader.read();if(done)break;bytes+=value.length;if(bytes>2500000){await reader.cancel();fail('Course trop volumineuse.');}chunks.push(value);}
  const buffer=new Uint8Array(bytes);let offset=0;for(const c of chunks){buffer.set(c,offset);offset+=c.length;}
  const b=JSON.parse(new TextDecoder().decode(buffer));check(b&&typeof b==='object'&&!Array.isArray(b));
  if(b.action==='creator'){
   const controls=b.controls??'legacy';check(['legacy','touch','desktop'].includes(controls));
   const rows=await result(db.from('sparking_scores').select('elapsed_ms,finished_at').eq('friend_id','331213').eq('generation',3).eq('equipment','feet').eq('rules_version',RULES).eq('controls',controls).is('withdrawn_at',null).gte('finished_at','2026-09-26T09:29:00Z').order('elapsed_ms').limit(1));
   return send({friendId:'331213',gen:3,equipment:'feet',rules:RULES,controls,ms:rows[0]?.elapsed_ms??null});
  }
  if(b.action==='board'){
   check(Number.isInteger(b.gen)&&b.gen>=1&&b.gen<=6&&['feet','rollers','kart'].includes(b.equipment)&&['day','week','month'].includes(b.period));
   const controls=b.controls??'legacy';check(['legacy','touch','desktop'].includes(controls));
   return send({rules:RULES,controls,rows:await result(db.rpc('sparking_board_controls',{p_gen:b.gen,p_gear:b.equipment,p_rules:RULES,p_period:b.period,p_controls:controls}))});
  }
  if(b.action==='challenge'){
   check(typeof b.wallet==='string'&&/^0x[0-9a-fA-F]{40}$/.test(b.wallet));const wallet=b.wallet.toLowerCase();
   // Only a current eligible owner can allocate a login challenge.
   await profile(b.friendId,wallet);
   const recent=await result(db.from('sparking_challenges').select('id').eq('wallet',wallet).gte('created_at',new Date(Date.now()-300000).toISOString()).limit(6));
   check(recent.length<5,'Trop de demandes. Attends cinq minutes.');
   const id=crypto.randomUUID(),issued=new Date().toISOString(),expires=new Date(Date.now()+300000).toISOString();
   const message=`lebucheron.github.io wants you to sign in with your Ethereum account:\n${wallet}\n\nSparking Stars beta leaderboard login. No transaction, payment or token permission.\n\nURI: https://lebucheron.github.io/sparking-stars/\nVersion: 1\nChain ID: 4663\nNonce: ${id.replaceAll('-','')}\nIssued At: ${issued}\nExpiration Time: ${expires}`;
   await result(db.from('sparking_challenges').insert({id,wallet,message,expires_at:expires}));return send({id,message});
  }
  if(b.action==='login'){
   check(typeof b.id==='string'&&/^[0-9a-f-]{36}$/.test(b.id)&&typeof b.signature==='string'&&/^0x[0-9a-fA-F]{130,8192}$/.test(b.signature));
   const c=await result(db.from('sparking_challenges').select('*').eq('id',b.id).single());
   check(!c.consumed_at&&Date.parse(c.expires_at)>Date.now(),'Signature expirée.');
   check(await rpc.verifyMessage({address:c.wallet,message:c.message,signature:b.signature}),'Signature invalide.');
   const token=Array.from(crypto.getRandomValues(new Uint8Array(32)),v=>v.toString(16).padStart(2,'0')).join('');
   await result(db.rpc('sparking_login',{p_id:b.id,p_hash:await sha(token)}));return send({token,expiresAt:Date.now()+3500000});
  }
  const token=req.headers.get('authorization')?.replace(/^Bearer /,'');check(token&&/^[0-9a-f]{64}$/.test(token),'Active le classement avec ton wallet.');
  const hash=await sha(token),session=await result(db.from('sparking_sessions').select('wallet,expires_at').eq('token_hash',hash).single());
  check(Date.parse(session.expires_at)>Date.now(),'Session expirée : reconnecte le classement.');
  if(b.action==='style'){
   check(['read','buy','equip'].includes(b.operation));
   check(b.item===undefined||typeof b.item==='string'&&b.item.length<30);
   check(b.kind===undefined||['cosmetic','trail'].includes(b.kind));
   await profile(b.friendId,session.wallet);
   return send(await result(db.rpc('sparking_style',{p_friend:b.friendId,p_action:b.operation,p_item:b.item??null,p_kind:b.kind??null})));
  }
  if(b.action==='start'){
   check(b.rules===RULES,'Le circuit a changé : recharge le jeu.');
   check(['feet','rollers','kart'].includes(b.equipment));const p=await profile(b.friendId,session.wallet);
   check(b.equipment==='feet'||p.tier>=(b.equipment==='rollers'?2:4),'Tier insuffisant pour cet équipement.');
   const controls=b.controls??'legacy';check(['legacy','touch','desktop'].includes(controls));
   const [run]=await result(db.rpc(controls==='legacy'?'sparking_start':'sparking_start_controls',{p_hash:hash,p_friend:b.friendId,p_gen:p.generation,p_gear:b.equipment,p_rules:RULES,...(controls==='legacy'?{}:{p_controls:controls})}));
   return send({id:run.id,generation:p.generation,rules:RULES,controls});
  }
  if(b.action==='finish'){
   check(typeof b.id==='string'&&/^[0-9a-f-]{36}$/.test(b.id));
   const run=await result(db.from('sparking_runs').select('*').eq('id',b.id).eq('session_hash',hash).single());
   check(run.rules_version===RULES,'Circuit obsolète.');
   const p=await profile(run.friend_id,session.wallet);check(p.generation===run.generation);
   const ms=validateTrace(run.generation,run.equipment,b.trace);
   const controls=run.controls==='legacy'?'legacy':resolveRaceControls(run.controls,b.controls,b.inputs,ms);
   const accepted=await result(db.rpc(controls==='legacy'?'sparking_finish':'sparking_finish_controls',{p_id:run.id,p_hash:hash,p_ms:ms,...(controls==='legacy'?{}:{p_controls:controls})}));return send({ms:accepted,controls});
  }
  fail('Action inconnue.');
 }catch(e){return send({error:e instanceof Error&&e.message.length<180?e.message:'Service indisponible. Réessaie.'},400);}
});
