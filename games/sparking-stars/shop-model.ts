export type Equipment="feet"|"rollers"|"kart";
export type Bonus="none"|"boost"|"breaker";
export type Wallet={coins:number;tier:number;owned:Equipment[];equipped:Equipment;bonus:Bonus;stock:{boost:number;breaker:number};energy:{rollers:number;kart:number};paidRuns:number[]};
export const labels={feet:"À pied",rollers:"Rollers",kart:"Kart",none:"Aucun",boost:"Boost",breaker:"Casse-brique"};
export const initialWallet=(tier=0):Wallet=>({coins:300,tier,owned:["feet"],equipped:"feet",bonus:"none",stock:{boost:0,breaker:0},energy:{rollers:3,kart:3},paidRuns:[]});
export const tierBenefits=["Aucun avantage de tier","Une étoile offerte par course","Rollers disponibles à l’achat","−20 % sur les articles","Kart disponible à l’achat"];
export const catalogue=[{id:"boost",name:"Boost",price:25,tier:0,description:"+60 % de vitesse pendant 3 secondes. Un usage."},{id:"breaker",name:"Casse-brique",price:30,tier:0,description:"Détruit la barricade proche. Un usage."},{id:"rollers",name:"Rollers",price:180,tier:2,description:"+20 % de vitesse. 3 courses équipées par session."},{id:"kart",name:"Kart",price:450,tier:4,description:"+45 % de vitesse. 3 courses équipées par session."}] as const;
export const priceFor=(price:number,tier:number)=>Math.ceil(price*(tier>=3?.8:1));
export type Action={type:"buy";id:string}|{type:"equip";equipment:Equipment}|{type:"bonus";bonus:Bonus}|{type:"start"}|{type:"use";bonus:Exclude<Bonus,"none">}|{type:"reward";run:number;coins:number};
export function transact(w:Wallet,a:Action):{wallet:Wallet;message:string;ok:boolean}{
 const fail=(message:string)=>({wallet:w,message,ok:false});
 const done=(wallet:Wallet,message:string)=>({wallet,message,ok:true});
 if(a.type==="buy"){
  const item=catalogue.find(i=>i.id===a.id);if(!item)return fail("Article inconnu.");
  if(w.tier<item.tier)return fail(`Tier ${item.tier} requis.`);
  const cost=priceFor(item.price,w.tier);if(w.coins<cost)return fail("Pas assez de pièces.");
  if(item.id==="rollers"||item.id==="kart"){
   if(w.owned.includes(item.id))return fail("Déjà dans ton garage.");
   return done({...w,coins:w.coins-cost,owned:[...w.owned,item.id]},`${item.name} achetés. Équipe-les dans le garage.`);
  }
  return done({...w,coins:w.coins-cost,stock:{...w.stock,[item.id]:w.stock[item.id]+1}},`${item.name} ajouté au sac.`);
 }
 if(a.type==="equip"){
  if(!w.owned.includes(a.equipment))return fail("Équipement non acheté.");
  if(a.equipment!=="feet"&&w.energy[a.equipment]===0)return fail("Énergie épuisée pour cette session.");
  return done({...w,equipped:a.equipment},`${labels[a.equipment]} équipés.`);
 }
 if(a.type==="bonus"){
  if(a.bonus!=="none"&&w.stock[a.bonus]===0)return fail("Achète ce bonus avant de l’équiper.");
  return done({...w,bonus:a.bonus},`Bonus : ${labels[a.bonus]}.`);
 }
 if(a.type==="start"){
  if(w.equipped!=="feet"&&w.energy[w.equipped]<=0)return fail("Énergie épuisée : repasse à pied dans la boutique.");
  return done({...w,energy:w.equipped==="feet"?w.energy:{...w.energy,[w.equipped]:w.energy[w.equipped]-1}},"");
 }
 if(a.type==="use"){
  if(w.bonus!==a.bonus||w.stock[a.bonus]<=0)return fail("Bonus indisponible.");
  return done({...w,stock:{...w.stock,[a.bonus]:w.stock[a.bonus]-1}},`${labels[a.bonus]} utilisé !`);
 }
 if(w.paidRuns.includes(a.run))return fail("Récompense déjà reçue.");
 if(!Number.isSafeInteger(a.coins)||a.coins<0)return fail("Récompense invalide.");
 return done({...w,coins:w.coins+a.coins,paidRuns:[...w.paidRuns,a.run]},`+${a.coins} pièces de test`);
}
export function circuitDistance(route:readonly (readonly number[])[]){
 return route.reduce((sum,a,i)=>{const b=route[(i+1)%route.length];return sum+Math.hypot(b[0]-a[0],b[1]-a[1]);},0);
}
export function medalTargets(gen:number,distance:number,equipment:Equipment){
 const pace=equipment==="kart"?1.45:equipment==="rollers"?1.2:1;
 // 170 world units/s is the renderer's walking speed. Allow for bends and
 // collision detours; GEN 3 is calibrated against a real 15.8s walking lap.
 // Provisional until all six terrains have comparable player runs.
 const gold=Math.round(((distance/170*1.65+gen*.25)/pace)*10)/10;
 const silver=Math.round(gold*1.3*10)/10;
 return {gold,silver};
}
export function raceReward(ms:number,gen:number,distance:number,equipment:Equipment){
 const {gold,silver}=medalTargets(gen,distance,equipment);
 const medal=ms/1000<=gold?"Or":ms/1000<=silver?"Argent":"Bronze";
 return {medal,coins:30+gen*5+(medal==="Or"?35:medal==="Argent"?20:10)};
}
