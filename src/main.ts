import * as T from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {mountUI,icon} from './ui/interface';
import './ui/style.css';
import {buildChurch} from './architecture/ChurchBuilder';
import {ornaments} from './architecture/OrnamentBuilder';
import {monumentBases,loadFigures} from './architecture/Monuments';
import {staircase} from './architecture/Staircase';
import {terrain} from './environment/Terrain';
import {garden} from './environment/Garden';
import {Lighting} from './environment/Lighting';
import {Collision} from './controls/Collision';
import {OrbitMode,PRESETS} from './controls/OrbitMode';
import {ChurchSpace,SPACES} from './controls/ChurchSpace';
import {GuidedTour,STOPS} from './controls/GuidedTour';
import {batchStatic,box} from './utils/geometry';
import {parishSite,SITE} from './environment/ParishSite';
import {Life} from './environment/Life';
import {isInterior,PEW_BLOCKS,PEW_ROWS,CHURCH_BASE,PLAN} from './architecture/config';
import {mat} from './materials/palette';
mountUI();
const $=<E extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as E;
let toastTimer=0;
function toast(text:string){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=window.setTimeout(()=>$('toast').classList.remove('show'),3200);}
async function boot(){
 await new Promise(requestAnimationFrame);
 const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.outputColorSpace=T.SRGBColorSpace;$('viewer').append(renderer.domElement);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(43,innerWidth/innerHeight,.12,1600);
 const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment(),environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;room.dispose();pmrem.dispose();
 const staticRoot=new T.Group(),dynamic=new T.Group(),assets=new T.Group();scene.add(staticRoot,dynamic,assets);
 const church=new T.Group(),doorRoot=new T.Group();church.position.y=doorRoot.position.y=CHURCH_BASE;staticRoot.add(church);dynamic.add(doorRoot);
 const collision=new Collision(),doors=buildChurch(church,doorRoot,collision);ornaments(church);
 box(staticRoot,mat.stone,0,.48,-9,22.6,.96,54.6);box(staticRoot,mat.stone,0,.48,-24,38.6,.96,12.6);
 staircase(staticRoot,collision,0,18.85,23.5);
 for(const side of [-1,1]){for(const z of [3,-9])staircase(staticRoot,collision,side*11.8,z,5.6,side*Math.PI/2);staircase(staticRoot,collision,side*19.25,-24,6,side*Math.PI/2);staircase(staticRoot,collision,side*7.8,-36.7,5.2,Math.PI);}
 terrain(staticRoot);garden(staticRoot,collision);parishSite(staticRoot,collision);monumentBases(staticRoot);const figures=await loadFigures(assets),life=new Life(dynamic);
 batchStatic(staticRoot);
 const lighting=new Lighting(scene,renderer),orbit=new OrbitMode(camera,renderer.domElement);
 const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));composer.addPass(new UnrealBloomPass(new T.Vector2(innerWidth,innerHeight),.20,.38,1.3));composer.addPass(new OutputPass());
 renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
 let mode:'orbit'|'space'|'tour'='orbit',night=false,map=false,last=performance.now(),disposed=false,orbitFit=1;
 const space=new ChurchSpace(camera,renderer.domElement,index=>{const stop=SPACES[index];$('space-note').textContent=stop.note;$('location-title').textContent=stop.title;$('location-number').textContent=String(index+1).padStart(2,'0');document.querySelectorAll('[data-space]').forEach(b=>b.classList.toggle('active',Number((b as HTMLElement).dataset.space)===index));});
 const tour=new GuidedTour(camera,index=>{const stop=STOPS[index];$('tour-count').textContent=`${String(index+1).padStart(2,'0')} / ${STOPS.length}`;$('tour-title').textContent=stop.title;$('tour-text').textContent=stop.text;$('location-title').textContent=stop.title;$('location-number').textContent=String(index+1).padStart(2,'0');($('tour-prev') as HTMLButtonElement).disabled=index===0;($('tour-next') as HTMLButtonElement).disabled=index===STOPS.length-1;});
 function resize(){camera.aspect=innerWidth/innerHeight;if(mode==='orbit'){const fit=Math.max(1,1.08/camera.aspect);camera.position.sub(orbit.controls.target).multiplyScalar(fit/orbitFit).add(orbit.controls.target);orbit.controls.maxDistance=250*fit;orbitFit=fit;}camera.setViewOffset(innerWidth,innerHeight,mode==='orbit'&&innerWidth>760?-innerWidth*.095:0,mode==='orbit'&&innerWidth<=760?-innerHeight*.08:0,innerWidth,innerHeight);camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);}
 function updatePause(){$('tour-pause').innerHTML=icon(tour.paused?'tour':'pause')+(tour.paused?' Tiếp tục':' Tạm dừng');}
 function setMode(next:typeof mode){
  space.exit();tour.stop();clearTimeout(toastTimer);$('toast').classList.remove('show');document.querySelectorAll('[data-view]').forEach(b=>b.classList.remove('selected'));mode=next;orbit.controls.enabled=next==='orbit';document.body.classList.toggle('exploring',next!=='orbit');for(const id of ['orbit','space','tour'])$(id).classList.toggle('active',id===next);$('space-panel').hidden=next!=='space';$('tour-panel').hidden=next!=='tour';$('minimap').hidden=true;map=false;
  if(next==='orbit'){camera.fov=43;orbit.reset();orbitFit=1;$('location-title').textContent='Toàn cảnh giáo xứ';$('location-number').textContent='01';}
  else{doors.forEach(d=>d.open=true);if(next==='space')space.enter();else{camera.fov=47;tour.start();updatePause();}}
  resize();
 }
 $('space-stations').innerHTML=SPACES.map((s,i)=>`<button data-space="${i}"${i===0?' class="active"':''}>${String(i+1).padStart(2,'0')} &nbsp; ${s.title}</button>`).join('');
 document.querySelectorAll<HTMLButtonElement>('[data-space]').forEach(b=>b.onclick=()=>space.go(Number(b.dataset.space)));
 $('orbit').onclick=()=>setMode('orbit');$('space').onclick=()=>setMode('space');$('enter').onclick=()=>setMode('space');$('tour').onclick=()=>setMode('tour');$('tour-exit').onclick=()=>setMode('orbit');$('reset').onclick=()=>setMode('orbit');
 $('tour-prev').onclick=()=>tour.go(tour.index-1);$('tour-next').onclick=()=>tour.go(tour.index+1);$('tour-pause').onclick=()=>{tour.paused=!tour.paused;updatePause();};
 function setTime(value:boolean){night=value;lighting.set(night);document.body.classList.toggle('night',night);$('daynight').innerHTML=icon(night?'sun':'moon');$('weather-label').textContent=night?'BUỔI TỐI · 19:00':'BUỔI SÁNG · 07:30';$('daynight').setAttribute('aria-pressed',String(night));for(const id of ['morning','evening']){const active=(id==='evening')===night;$(id).classList.toggle('active',active);$(id).setAttribute('aria-pressed',String(active));}}
 $('morning').onclick=()=>setTime(false);$('evening').onclick=()=>setTime(true);$('daynight').onclick=()=>setTime(!night);
 $('people-toggle').onclick=()=>{figures.humans.visible=!figures.humans.visible;$('people-toggle').setAttribute('aria-pressed',String(figures.humans.visible));$('people-toggle').textContent=figures.humans.visible?'Ẩn người tỷ lệ':'Hiện người tỷ lệ';};
 function toggleMap(){map=!map;$('minimap').hidden=!map;}$('map-toggle').onclick=toggleMap;$('map-close').onclick=toggleMap;
 $('map-seating').innerHTML=PEW_BLOCKS.map(x=>Array.from({length:PEW_ROWS},(_,row)=>`<path d="M${x-1.25} ${11-row*1.85}h2.5" class="map-pews"/>`).join('')).join('');
 const dialog=$<HTMLDialogElement>('info-dialog');$('help').onclick=$('about').onclick=()=>dialog.showModal();$('dialog-close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 const fullscreen=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('Trình duyệt không hỗ trợ toàn màn hình.');}};$('fullscreen').onclick=fullscreen;
 function render(){if(night)composer.render();else renderer.render(scene,camera);}
 $('capture').onclick=()=>{render();renderer.domElement.toBlob(blob=>{if(!blob)return;const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=`phuong-lac-Dinh-Quoc-Bao-${night?'buoi-toi':'buoi-sang'}-${Date.now()}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('Đã lưu ảnh không gian 3D.');});};
 document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(b=>b.onclick=()=>{setMode('orbit');orbit.preset(b.dataset.view as keyof typeof PRESETS);orbitFit=1;resize();b.classList.add('selected');$('location-title').textContent=b.textContent;});
 window.addEventListener('keydown',e=>{if(dialog.open)return;if(e.code==='Escape')setMode('orbit');if(e.code==='KeyF'&&!e.repeat)void fullscreen();if(e.code==='KeyM'&&!e.repeat)toggleMap();});
 const ray=new T.Raycaster();let down={x:0,y:0};renderer.domElement.addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY});renderer.domElement.addEventListener('pointerup',e=>{if(Math.hypot(e.clientX-down.x,e.clientY-down.y)>4||space.moving||mode==='tour')return;const r=renderer.domElement.getBoundingClientRect();ray.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const hit=ray.intersectObjects(doors.map(d=>d.group),true)[0];if(hit){const d=doors.find(d=>{let o:T.Object3D|null=hit.object;while(o){if(o===d.group)return true;o=o.parent;}return false;});if(d)d.open=!d.open;}});
 window.addEventListener('resize',resize);resize();
 function frame(now:number){if(disposed)return;const dt=Math.min((now-last)/1000,.05);last=now;doors.forEach(d=>d.update(dt));if(mode==='orbit')orbit.update();if(mode==='space')space.update(dt);if(mode==='tour'){tour.update(dt);$('tour-progress').style.width=`${tour.progress*100}%`;updatePause();}
  $('simulation').hidden=mode==='orbit'||!isInterior(camera.position.x,camera.position.z)||camera.position.y>23;
  $('map-dot').setAttribute('cx',String(camera.position.x));$('map-dot').setAttribute('cy',String(camera.position.z));const yaw=new T.Euler().setFromQuaternion(camera.quaternion,'YXZ').y;$('compass').style.transformOrigin='25px 25px';$('compass').style.transform=`rotate(${yaw-Math.PI/2}rad)`;
  lighting.update(camera);if(doors.some(d=>Math.abs(d.angle-(d.open?1.45:0))>.02))renderer.shadowMap.needsUpdate=true;lighting.sky.update(now/1000);life.update(now/1000,night);render();requestAnimationFrame(frame);
 }
 lighting.update(camera);renderer.compile(scene,camera);render();$('loading').style.opacity='0';setTimeout(()=>$('loading').remove(),800);requestAnimationFrame(frame);
 Object.assign(window,{__app:{camera,scene,renderer,collision,doors,tour,space,orbit,setMode,setTime,figures,measureFigures:()=>figures.humans.children.map(o=>{const b=new T.Box3().setFromObject(o,true);return b.max.y-b.min.y;}),site:SITE,plan:PLAN,pewBlocks:PEW_BLOCKS,pewRows:PEW_ROWS,get mode(){return mode;},stats:()=>({calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures})}});
 window.addEventListener('pagehide',()=>{disposed=true;space.exit();orbit.controls.dispose();const geos=new Set<T.BufferGeometry>(),materials=new Set<T.Material>();scene.traverse(o=>{if(o instanceof T.Mesh){geos.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}});geos.forEach(g=>g.dispose());materials.forEach(m=>{for(const value of Object.values(m))if(value instanceof T.Texture)value.dispose();m.dispose();});composer.passes.forEach(pass=>pass.dispose());composer.dispose();environment.dispose();renderer.dispose();},{once:true});
}
boot().catch(error=>{console.error(error);$('loading').innerHTML='<strong>Không thể mở không gian 3D</strong><p>Hãy dùng trình duyệt có WebGL 2 và tải lại trang.</p>';});
