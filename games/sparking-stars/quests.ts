import type {Ghost} from './ghost';
export type QuestState={laps:number;best:number|null;beaten:boolean;recent:Ghost[];target:Ghost|null;near:number;wins:number;last:string};
export const emptyQuests=():QuestState=>({laps:0,best:null,beaten:false,recent:[],target:null,near:0,wins:0,last:''});
export function medianGhost(recent:Ghost[]):Ghost|null{return recent.length===5?[...recent].sort((a,b)=>a.ms-b.ms)[2]:null;}
export function completeQuest(previous:QuestState,ghost:Ghost,id:string){
 if(previous.last===id)return {state:previous,earned:[] as string[]};
 const state={...previous,recent:[...previous.recent,ghost].slice(-5),laps:previous.laps+1,last:id};
 const earned:string[]=[];
 if(previous.laps===0)earned.push('Première empreinte');
 if(previous.laps===2)earned.push('Étoile régulière');
 if(previous.best!==null&&ghost.ms<previous.best&&!previous.beaten){state.beaten=true;earned.push('Chasseur de fantômes');}
 state.best=Math.min(previous.best??Infinity,ghost.ms);
 if(previous.target){
  state.near=previous.near+(ghost.ms<=previous.target.ms*1.03?1:0);
  if(ghost.ms<previous.target.ms||state.near>=3){state.wins++;state.near=0;state.target=medianGhost(state.recent);earned.push('Défi du fantôme réussi');}
 }else state.target=medianGhost(state.recent);
 return {state,earned};
}
