import {preciseTime} from './leaderboard-model';
import {emptyQuests,type QuestState} from './quests';
export function QuestPanel({state=emptyQuests(),onClose,onChallenge,challenging,category}:{state?:QuestState;onClose:()=>void;onChallenge:()=>void;challenging:boolean;category:string}){
 return <div className="mode-panel quest-panel" role="dialog" aria-label="Quêtes personnelles"><div className="picker-heading"><div><small>TON CARNET DE COURSE</small><h2>Les petites victoires</h2></div><button onClick={onClose}>Retour à la piste</button></div><p>Pour ton Friend et la catégorie sélectionnée dans Modes. Entraînement et compétition acceptée comptent séparément. Progression sur cet appareil ; badges personnels sans gain RF.</p>
 <p><b>{category}</b></p><p>Les courses libres ne comptent pas. Seuls les tours terminés en entraînement ou acceptés en compétition font progresser ces quêtes.</p>
 <article><h3>Première empreinte</h3><p>Terminer un tour pour créer ton fantôme.</p><strong>{state.laps?'✦ Accomplie':'0 / 1 tour'}</strong></article>
 <article><h3>Étoile régulière</h3><p>Terminer trois tours dans cette catégorie.</p><strong>{state.laps>=3?'✦ Badge obtenu':`${state.laps} / 3 tours`}</strong></article>
 <article><h3>Chasseur de fantômes</h3><p>Battre ton meilleur temps personnel. Un exploit permanent.</p><strong>{state.beaten?'✦ Badge obtenu':'À conquérir'}</strong></article>
 <article data-testid="renewable-quest"><h3>Défier son fantôme · renouvelable</h3>{state.target?<><p>Cible figée : <b>{preciseTime(state.target.ms)}</b>. Bats-la, ou termine trois tours à moins de 3 % au-dessus de ce temps.</p><strong>{state.near} / 3 tours proches · {state.wins} défi{state.wins!==1?'s':''} réussi{state.wins!==1?'s':''}</strong><p>Après réussite, la prochaine cible vient du temps médian de tes cinq derniers tours. Les tours proches ne doivent pas être consécutifs.</p><button aria-pressed={challenging} onClick={onChallenge}>{challenging?'Rejouer mon meilleur fantôme':'Courir contre le fantôme du défi'}</button></>:<p>Termine encore {Math.max(0,5-state.recent.length)} tour{5-state.recent.length!==1?'s':''} pour préparer une cible adaptée à ton rythme.</p>}</article>
 </div>;
}
