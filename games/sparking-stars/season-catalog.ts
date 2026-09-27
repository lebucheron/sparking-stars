
export const seasonItems=[
 {id:'crown',kind:'cosmetic',name:'Couronne stellaire',laps:1,cost:0,description:'Ta première arrivée parmi les étoiles.'},
 {id:'halo',kind:'cosmetic',name:'Halo de lune',laps:5,cost:0,description:'Une orbite au-dessus du paddock.'},
 {id:'comets',kind:'trail',name:'Sillage de comètes',laps:10,cost:0,description:'Une petite pluie de météores.'},
 {id:'cometcap',kind:'cosmetic',name:'Casque comète',laps:0,cost:30,description:'Une étoile filante sur la visière.'},
 {id:'eclipse',kind:'cosmetic',name:'Éclipse double',laps:0,cost:50,description:'Deux lunes, un seul pilote.'},
 {id:'orbits',kind:'trail',name:'Ondes orbitales',laps:0,cost:60,description:'Des cercles blancs sur ton passage.'},
] as const;
export type StyleState={balance:number;cosmetic:string;trail:string;owned:string[];laps:number;daily:number;active:boolean;endsAt:string};
