import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {transform} from 'esbuild';
const {code}=await transform(await readFile(new URL('./shop-model.ts',import.meta.url),'utf8'),{loader:'ts',format:'esm'});
const {initialWallet,transact,priceFor,raceReward,medalTargets,circuitDistance}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
let w=initialWallet();
function apply(a){const r=transact(w,a);assert.equal(r.ok,true,r.message);w=r.wallet;return r;}
assert.equal(transact(w,{type:'buy',id:'kart'}).ok,false);
assert.equal(transact(w,{type:'equip',equipment:'rollers'}).ok,false);
assert.equal(transact(w,{type:'use',bonus:'boost'}).ok,false);
apply({type:'reward',run:1,coins:5000});const paid=w.coins;
assert.equal(transact(w,{type:'reward',run:1,coins:5000}).wallet.coins,paid);
for(let tier=0;tier<=4;tier++){
 w={...initialWallet(tier),coins:5000};
 assert.equal(priceFor(100,tier),tier>=3?80:100);
 assert.equal(transact(w,{type:'buy',id:'rollers'}).ok,tier>=2);
 assert.equal(transact(w,{type:'buy',id:'kart'}).ok,tier>=4);
}
apply({type:'buy',id:'kart'});apply({type:'equip',equipment:'kart'});
for(let i=0;i<3;i++)apply({type:'start'});
assert.equal(w.energy.kart,0);assert.equal(transact(w,{type:'start'}).ok,false);
apply({type:'equip',equipment:'feet'});apply({type:'start'});
apply({type:'buy',id:'boost'});apply({type:'bonus',bonus:'boost'});apply({type:'use',bonus:'boost'});
assert.equal(transact(w,{type:'use',bonus:'boost'}).ok,false);
assert.equal(transact({...w,coins:0},{type:'buy',id:'breaker'}).ok,false);
assert.ok(raceReward(5000,1,997,'feet').coins>raceReward(60000,1,997,'feet').coins);
assert.equal(initialWallet().coins,300);
console.log('All five tiers, non-stacking discounts, purchase locks, energy caps, inventory and reward idempotency passed');

assert.equal(circuitDistance([[0,0],[3,0],[3,4]]),12);
const canal=medalTargets(3,1665,'feet');
assert.equal(canal.gold,16.9);
assert.equal(raceReward(15800,3,1665,'feet').medal,'Or');
assert.equal(raceReward(33000,3,1665,'feet').medal,'Bronze');
assert.ok(medalTargets(3,1665,'kart').gold<medalTargets(3,1665,'rollers').gold);
assert.ok(medalTargets(3,2000,'feet').gold>canal.gold);
console.log('Distance-based thresholds and 15.8s/33s regression checks passed');

assert.equal(priceFor(25,0),25);
assert.equal(priceFor(30,0),30);
