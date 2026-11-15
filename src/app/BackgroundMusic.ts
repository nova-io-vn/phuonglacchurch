/** Attempt audible autoplay; retry inside the first trusted interaction when the browser requires it. */
export function backgroundMusic(button:HTMLButtonElement){
 const audio=new Audio('/nhac.mp3');audio.loop=true;audio.volume=.32;audio.preload='metadata';audio.autoplay=true;
 let pausedByUser=false,destroyed=false;
 const paint=()=>{const playing=!audio.paused;button.setAttribute('aria-pressed',String(playing));button.setAttribute('aria-label',playing?'Tắt nhạc nền':'Bật nhạc nền');button.title=playing?'Tắt nhạc nền':'Bật nhạc nền';button.classList.toggle('playing',playing);};
 const attempt=()=>{if(pausedByUser||destroyed)return;void audio.play().then(paint).catch(()=>paint());};
 const unlock=(event:Event)=>{if((event.target as Element)?.closest?.('#music'))return;attempt();};
 document.addEventListener('pointerdown',unlock,{capture:true});document.addEventListener('keydown',unlock,{capture:true});
 const removeUnlock=()=>{document.removeEventListener('pointerdown',unlock,true);document.removeEventListener('keydown',unlock,true);};
 audio.addEventListener('playing',()=>{removeUnlock();paint();});audio.addEventListener('pause',paint);audio.addEventListener('error',()=>{button.title='Không tải được nhạc nền';paint();});
 button.onclick=()=>{if(!audio.paused){pausedByUser=true;audio.pause();}else{pausedByUser=false;attempt();}paint();};
 attempt();paint();window.addEventListener('pagehide',()=>{destroyed=true;removeUnlock();audio.pause();audio.removeAttribute('src');audio.load();},{once:true});
 return audio;
}
