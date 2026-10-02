import assert from 'node:assert/strict';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
import {RULES} from '../supabase/functions/sparking-api/validation.js';
await testGame('games/sparking-stars',{publicHost:true,profile:{generation:3,tier:0},width:390,height:844,beforeOpen:async({page})=>{
 await page.route('https://hkudnvqseodizcplkgvw.supabase.co/functions/v1/sparking-api',async route=>{const b=route.request().postDataJSON();assert(['creator','board'].includes(b.action));await route.fulfill({json:b.action==='creator'?{rules:RULES,controls:b.controls,ms:null}:{rules:RULES,controls:b.controls,rows:[]},headers:{'access-control-allow-origin':'*'}});});
},check:async({page,game})=>{
 const auth=page.getByRole('button',{name:'Activer le classement',exact:true});assert.equal(await auth.isVisible(),false);
 await game.getByRole('button',{name:'Chronos',exact:true}).click();await game.getByRole('button',{name:'Voir le classement public ↗',exact:true}).click();assert.equal(await auth.isVisible(),false);await game.getByRole('button',{name:'Retour',exact:true}).click();
 await game.getByRole('button',{name:/Boutique ·/}).click();await auth.waitFor();await page.screenshot({path:'../../outputs/depart-connexion-mobile.png'});await page.getByRole('button',{name:'Fermer la demande de connexion'}).click();assert.equal(await auth.isVisible(),false);
 await game.getByRole('button',{name:'Actualiser la collection',exact:true}).click();await auth.waitFor();await page.getByRole('button',{name:'Fermer la demande de connexion'}).click();await game.getByRole('button',{name:'Retour au circuit',exact:true}).click();await auth.waitFor({state:'hidden'});
 console.log('Auth only on demand: no banner on training or public board, wardrobe request, dismiss/retry, hidden on return to training.');
}});
