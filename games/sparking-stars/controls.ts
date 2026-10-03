export type Controls='touch'|'desktop';
export const controlLabel=(controls:Controls)=>controls==='touch'?'Tactile':'Clavier / souris';
export function initialControls():Controls {return typeof matchMedia==='function'&&matchMedia('(pointer: coarse)').matches?'touch':'desktop';}
/** A mouse, pen or movement key permanently promotes this lap to desktop. */
export const classifyControl=(current:Controls,input:'touch'|'mouse'|'pen'|'keyboard'):Controls=>current==='desktop'||input!=='touch'?'desktop':'touch';
