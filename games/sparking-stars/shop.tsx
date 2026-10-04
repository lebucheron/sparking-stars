import {Season} from "./season";
import {Wardrobe} from "./wardrobe";
import {HalloweenReward,type HalloweenProgress} from './halloween-reward';
import type {Cosmetic,Trail} from "./cosmetics";
import {catalogue,labels,priceFor,tierBenefits,type Wallet,type Action,type Equipment,type Bonus} from "./shop-model";
export function Shop({wallet:w,act,onClose,message,cosmetic,onCosmetic,onRestoreCosmetic,friendId,trail,onTrail,halloween,onHalloweenEquip}:{wallet:Wallet;act:(action:Action)=>void;onClose:()=>void;message:string;cosmetic:Cosmetic;onCosmetic:(id:Cosmetic)=>void;onRestoreCosmetic:(id:Cosmetic)=>void;friendId:bigint;trail:Trail;onTrail:(id:Trail)=>void;halloween:HalloweenProgress;onHalloweenEquip:(value:boolean)=>void}){
 return <div className="shop-panel" role="dialog" aria-modal="true" aria-label="Boutique"><header className="picker-heading"><div><small>LE COMPTOIR DE L’ÎLE</small><h2>Boutique & garage</h2></div><button onClick={onClose}>Retour au circuit</button></header>
 <div className="shop-balance"><strong data-testid="coins">{w.coins} pièces</strong><span>Tier officiel {w.tier} / 4 · remise {w.tier>=3?20:0} %</span></div>
 <p className="shop-note">Monnaie de test sans valeur RF. 300 pièces offertes au départ. Ton tier est lu sur le NFT ; il ne s’achète pas ici. Les achats du garage, les records locaux et l’énergie sont réinitialisés en rechargeant. La collection Constellations ci-dessous est sauvegardée en ligne.</p>
 <p className="shop-message" role="status">{message||"Termine une course : un meilleur chrono rapporte davantage de pièces."}</p>
 <section className="tier-box"><div><h3>Avantages de ton Friend · tier {w.tier}</h3><p>{tierBenefits.slice(0,w.tier+1).filter((_,i)=>!(w.tier>0&&i===0)).join(" · ")}</p><small>Tier synchronisé à l’ouverture du jeu. Après une évolution sur Rare Friends, recharge la page. Les remises ne se cumulent pas.</small></div></section>
 <Season friendId={friendId} onCosmetic={onCosmetic} onRestoreCosmetic={onRestoreCosmetic} onTrail={onTrail}/>
 <Wardrobe friendId={friendId} trail={trail} onTrail={onTrail} value={halloween.equipped?'witchhat':cosmetic} onChange={onCosmetic}/>
 <HalloweenReward progress={halloween} onEquip={onHalloweenEquip}/>
 <h3>Articles</h3><div className="shop-grid">{catalogue.map(item=>{const owned=(item.id==="kart"||item.id==="rollers")&&w.owned.includes(item.id),locked=w.tier<item.tier,cost=priceFor(item.price,w.tier);return <article key={item.id}><span className="item-symbol" aria-hidden="true">{item.id==="boost"?"ϟ":item.id==="breaker"?"▥":item.id==="rollers"?"○—○":"▰"}</span><h4>{item.name}</h4><p>{item.description}</p><small>{item.id==="boost"||item.id==="breaker"?`En stock : ${w.stock[item.id]}`:`Débloqué au tier ${item.tier}`}</small><button disabled={owned||locked||w.coins<cost} onClick={()=>act({type:"buy",id:item.id})}>{owned?"Possédé":locked?`Tier ${item.tier} requis`:`Acheter ${item.name} · ${cost} pièces`}</button></article>;})}</div>
 <h3>Ton équipement</h3><div className="loadout">{(["feet","rollers","kart"] as Equipment[]).map(e=><button key={e} aria-pressed={w.equipped===e} disabled={!w.owned.includes(e)||(e!=="feet"&&w.energy[e]===0)} onClick={()=>act({type:"equip",equipment:e})}>{labels[e]}{e!=="feet"?` · ${w.energy[e]}/3 courses`:" · illimité"}</button>)}</div>
 <h3>Un bonus pour la prochaine course</h3><div className="loadout">{(["none","boost","breaker"] as Bonus[]).map(b=><button key={b} aria-pressed={w.bonus===b} disabled={b!=="none"&&w.stock[b]===0} onClick={()=>act({type:"bonus",bonus:b})}>{labels[b]}{b!=="none"?` · ${w.stock[b]}`:""}</button>)}</div>
 <p className="shop-note">Active ton bonus avec Espace ou le bouton en course. Un seul consommable par course. Le casse-brique agit à proximité de la barricade. Une course commencée ou recommencée consomme une énergie en rollers ou en kart.</p>
 <ol className="tier-list">{tierBenefits.map((b,i)=><li key={b}>Tier {i} : {b}</li>)}</ol></div>;
}
