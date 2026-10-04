export type HalloweenProgress={wins:number;unlocked:boolean;equipped:boolean;saved?:boolean};
export const emptyHalloween:HalloweenProgress={wins:0,unlocked:false,equipped:false};
export function HalloweenReward({progress,onEquip}:{progress:HalloweenProgress;onEquip:(value:boolean)=>void}){
 if(!progress.unlocked)return null;
 return <section className="halloween-reward" aria-label="Souvenir Halloween"><strong>Chapeau de sorcière</strong>
  <p data-testid="halloween-progress">Souvenir Halloween débloqué !</p>
  <button aria-pressed={progress.equipped} onClick={()=>onEquip(!progress.equipped)}>{progress.equipped?'Retirer le chapeau Halloween':'Porter le chapeau Halloween'}</button>
  <small>{progress.saved===false?'Souvenir conservé pour cette session, pour ce Friend.':'Souvenir sauvegardé sur cet appareil, pour ce Friend.'}</small>
 </section>;
}
