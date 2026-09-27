import assert from 'node:assert/strict';
import {build} from 'esbuild';
globalThis.window={};
const compiled=await build({entryPoints:['host/wallet-provider.ts'],bundle:true,platform:'node',format:'esm',write:false,packages:'external'});
const {writeFile,unlink}=await import('node:fs/promises');
const file=new URL('./.wallet-test.mjs',import.meta.url);await writeFile(file,compiled.outputFiles[0].text);
try{
 const {createRelayProvider}=await import(file.href);
 let initialized=0,connected=0;const calls=[],events=new Map();
 const remote={request:async a=>{calls.push(a);if(a.method==='eth_accounts')return ['0x123'];if(a.method==='eth_chainId')return '0x1237';if(a.method==='personal_sign')return 'signed';throw new Error('unsupported');},on:(e,h)=>events.set(e,h),removeListener:(e)=>events.delete(e)};
 const relay=createRelayProvider(async options=>{initialized++;assert.equal(options.api.supportedNetworks['0x1237'],'https://rpc.mainnet.chain.robinhood.com');return {getProvider:()=>remote,connect:async opts=>{connected++;assert.deepEqual(opts.chainIds,['0x1237']);return {accounts:['0x123']};}};} );
 assert.deepEqual(await relay.request({method:'eth_accounts'}),[]);assert.equal(initialized,0);
 let changed=false;const listener=()=>changed=true;relay.on('accountsChanged',listener);
 assert.deepEqual(await relay.request({method:'eth_requestAccounts'}),['0x123']);assert.equal(initialized,1);assert.equal(connected,1);
 assert.equal(await relay.request({method:'personal_sign',params:['0xabc','0x123']}),'signed');assert.deepEqual(calls.at(-1),{method:'personal_sign',params:['0xabc','0x123']});
 events.get('accountsChanged')([]);assert(changed);relay.removeListener('accountsChanged',listener);assert(!events.has('accountsChanged'));
 console.log('Relay: lazy connection, Robinhood scope, same provider for ranked signature, account events forwarded.');
}finally{await unlink(file);}
