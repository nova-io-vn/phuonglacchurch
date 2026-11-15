import layout from './layout.html?raw';
const icons:Record<string,string>={
 orbit:'<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(-30 12 12)"/>',
 space:'<path d="M4 21V10Q4 6 8 4Q12 6 12 10V21M12 21V10Q12 6 16 4Q20 6 20 10V21M2 21h20M8 10v8m8-8v8"/>',
 tour:'<path d="m9 5 11 7-11 7Z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',moon:'<path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z"/>',
 arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',reset:'<path d="M3 10a9 9 0 1 1 2 8M3 3v7h7"/>',camera:'<path d="M8 5l2-2h4l2 2h5v15H3V5Z"/><circle cx="12" cy="12" r="4"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 8.5a2.5 2.5 0 1 1 4 2L12 12v2m0 3h.01"/>',expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',map:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Zm6-2v16m6-14v16"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',chevron:'<path d="m9 5 7 7-7 7"/>',pause:'<path d="M9 5v14m6-14v14"/>'};
export const icon=(name:string)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.arrow}</svg>`;
export function mountUI(){document.querySelector('#app')!.innerHTML=layout.replace(/\{\{icon:(\w+)\}\}/g,(_,name)=>icon(name));}
