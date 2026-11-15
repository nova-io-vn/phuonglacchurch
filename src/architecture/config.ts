// All dimensions are design assumptions, not measured survey data. +Z faces the forecourt.
export const PLAN = { width:22, front:18, back:-36, floor:1.35, wall:18.6, ridge:22.5, bay:6, thickness:0.65 } as const;
export const BAYS = [-33,-27,-21,-15,-9,-3,3,9,15];
export const TRANSEPT={back:-30,front:-18,extent:18.5,center:-24} as const;
export const PEW_BLOCKS=[-8,-3.15,3.15,8] as const;
export const PEW_ROWS=16;
export const isInterior=(x:number,z:number)=>z>=-36.5&&z<=18.7&&(Math.abs(x)<11||(z>TRANSEPT.back&&z<TRANSEPT.front&&Math.abs(x)<TRANSEPT.extent));

export const CHURCH_BASE=.75;
