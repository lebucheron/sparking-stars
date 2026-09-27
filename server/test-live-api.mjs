
import assert from 'node:assert/strict';
const url='https://hkudnvqseodizcplkgvw.supabase.co/functions/v1/sparking-api';
async function post(body,extra={}){const r=await fetch(url,{method:'POST',headers:{'content-type':'application/json',origin:'https://lebucheron.github.io',...extra},body:JSON.stringify(body)});return {status:r.status,body:await r.json()};}
const board=await post({action:'board',gen:3,equipment:'feet',period:'week'});assert.equal(board.status,200);assert(Array.isArray(board.body.rows));
const noAuth=await post({action:'start',friendId:'331213',equipment:'feet',rules:board.body.rules});assert.equal(noAuth.status,400);assert.match(noAuth.body.error,/wallet/);
const origin=await post({action:'board',gen:3,equipment:'feet',period:'week'},{origin:'https://example.invalid'});assert.equal(origin.status,403);
const forged=await post({action:'finish',id:'11111111-1111-4111-8111-111111111111',trace:[[0,1,1]]},{authorization:'Bearer '+'a'.repeat(64)});assert.equal(forged.status,400);
const fakeSignature=await post({action:'login',id:'11111111-1111-4111-8111-111111111111',signature:'0x'+'a'.repeat(130)});assert.equal(fakeSignature.status,400);
console.log('Live API: board available; unauthenticated start, forged session/signature and foreign browser origin refused. No scores inserted.');

const style=await post({action:'style',operation:'buy',friendId:'331213',item:'eclipse'});assert.equal(style.status,400);assert.match(style.body.error,/wallet/);console.log('Unauthenticated cosmetic purchase refused.');
