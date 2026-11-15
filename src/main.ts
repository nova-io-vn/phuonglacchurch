import * as T from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {mountUI,icon} from './ui/interface';
import './ui/style.css';
import {buildChurch} from './architecture/ChurchBuilder';
import {terrain} from './environment/Terrain';
import {garden} from './environment/Garden';
import {Lighting} from './environment/Lighting';
import {Collision} from './controls/Collision';
import {OrbitMode,PRESETS} from './controls/OrbitMode';
import {WalkMode} from './controls/WalkMode';
import {GuidedTour,STOPS} from './controls/GuidedTour';
import {batchStatic} from './utils/geometry';
import {parishSite,SITE} from './environment/ParishSite';
import {Life} from './environment/Life';
import {isInterior,PEW_BLOCKS,PEW_ROWS} from './architecture/config';
mountUI();
const $=<E extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as E;
let toastTimer=0;
function toast(text:string){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=window.setTimeout(()=>$('toast').classList.remove('show'),3500);}
async function boot(){
 await new Promise(requestAnimationFrame);
 const renderer=new T.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.outputColorSpace=T.SRGBColorSpace;$('viewer').append(renderer.domElement);
 const scene=new T.Scene();const camera=new T.PerspectiveCamera(43,innerWidth/innerHeight,.12,1600);
 const pmrem=new T.PMREMGenerator(renderer);const room=new RoomEnvironment();const environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;scene.environmentIntensity=.3;room.dispose();pmrem.dispose();
 const staticRoot=new T.Group(),dynamic=new T.Group();scene.add(staticRoot,dynamic);const collision=new Collision();const doors=buildChurch(staticRoot,dynamic,collision);terrain(staticRoot);garden(staticRoot,collision);parishSite(staticRoot,collision);const life=new Life(dynamic);
 const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));composer.addPass(new UnrealBloomPass(new T.Vector2(innerWidth,innerHeight),.13,.45,1.25));composer.addPass(new OutputPass());
 batchStatic(staticRoot);const lighting=new Lighting(scene,renderer);const orbit=new OrbitMode(camera,renderer.domElement);const walk=new WalkMode(camera,renderer.domElement,collision);renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
 let mode:'orbit'|'walk'|'tour'='orbit';let map=false,night=false,last=performance.now(),nearDoor=doors[0],disposed=false,orbitFit=1;const raycaster=new T.Raycaster();const look=new T.Vector3();const touch=matchMedia('(pointer: coarse)').matches;
 const tour=new GuidedTour(camera,index=>{const stop=STOPS[index];$('tour-count').textContent=`${String(index+1).padStart(2,'0')} / 10`;$('tour-title').textContent=stop.title;$('tour-text').textContent=stop.text;$('location-title').textContent=stop.title;$('location-number').textContent=String(index+1).padStart(2,'0');($('tour-prev') as HTMLButtonElement).disabled=index===0;($('tour-next') as HTMLButtonElement).disabled=index===9;});
 function responsiveCamera(){camera.aspect=innerWidth/innerHeight;if(mode==='orbit'){const fit=Math.max(1,1.02/camera.aspect);camera.position.sub(orbit.controls.target).multiplyScalar(fit/orbitFit).add(orbit.controls.target);orbit.controls.maxDistance=190*fit;orbitFit=fit;}camera.setViewOffset(innerWidth,innerHeight,mode==='orbit'&&innerWidth>760?-innerWidth*.095:0,mode==='orbit'&&innerWidth<=760?-innerHeight*.08:0,innerWidth,innerHeight);camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);}
 function setMode(next:typeof mode){walk.exit();tour.stop();clearTimeout(toastTimer);$('toast').classList.remove('show');document.querySelectorAll('[data-view]').forEach(b=>b.classList.remove('selected'));mode=next;orbit.controls.enabled=next==='orbit';document.body.classList.toggle('exploring',next!=='orbit');for(const id of ['orbit','walk','tour'])$(id).classList.toggle('active',id===next);$('crosshair').hidden=next!=='walk';$('walk-hint').hidden=next!=='walk';$('tour-panel').hidden=next!=='tour';$('lock-hint').hidden=next!=='walk'||touch;$('touch-controls').hidden=next!=='walk'||!touch;$('interact').hidden=true;$('minimap').hidden=true;map=false;
  if(next==='orbit'){orbit.reset();orbitFit=1;$('location-title').textContent='Toàn cảnh công trình';$('location-number').textContent='01';}
  if(next==='walk'){walk.enter();toast(touch?'Dùng cần trái để đi, kéo trên không gian để nhìn.':'Nhấp vào không gian để khóa chuột; E mở cửa khi đến gần.');}
  if(next==='tour'){doors.forEach(d=>d.open=true);tour.start();updatePause();}
  responsiveCamera();
 }
 function updatePause(){$('tour-pause').innerHTML=icon(tour.paused?'tour':'pause')+(tour.paused?' Tiếp tục':' Tạm dừng');}
 function toggleMap(){map=!map;$('minimap').hidden=!map;}
 function interact(){if(mode!=='walk')return;if(!nearDoor||camera.position.distanceTo(new T.Vector3(nearDoor.x,camera.position.y,nearDoor.z))>4.8){toast('Hãy đến gần một trong ba cửa phía trước.');return;}if(nearDoor.open&&Math.abs(camera.position.z-nearDoor.z)<1&&Math.abs(camera.position.x-nearDoor.x)<nearDoor.width/2+.3){toast('Bước ra khỏi vùng cánh cửa trước khi đóng.');return;}nearDoor.open=!nearDoor.open;}
 $('orbit').onclick=()=>setMode('orbit');$('walk').onclick=()=>setMode('walk');$('enter').onclick=()=>setMode('walk');$('tour').onclick=()=>setMode('tour');$('tour-exit').onclick=()=>setMode('orbit');$('reset').onclick=()=>{setMode('orbit');toast('Đã trở về góc nhìn tổng thể.');};
 $('tour-prev').onclick=()=>tour.go(tour.index-1);$('tour-next').onclick=()=>tour.go(tour.index+1);$('tour-pause').onclick=()=>{tour.paused=!tour.paused;updatePause();};
 function setTime(value:boolean){night=value;lighting.set(night);document.body.classList.toggle('night',night);$('daynight').innerHTML=icon(night?'sun':'moon');$('weather-label').textContent=night?'BUỔI TỐI · 19:00':'BUỔI SÁNG · 07:30';$('daynight').setAttribute('aria-pressed',String(night));for(const id of ['morning','evening']){const active=(id==='evening')===night;$(id).classList.toggle('active',active);$(id).setAttribute('aria-pressed',String(active));}}
 $('daynight').onclick=()=>setTime(!night);$('morning').onclick=()=>setTime(false);$('evening').onclick=()=>setTime(true);
 $('choir-view').onclick=()=>{setMode('tour');tour.go(7);};
 $('map-seating').innerHTML=PEW_BLOCKS.map(x=>Array.from({length:PEW_ROWS},(_,row)=>`<path d="M${x-1.25} ${11-row*1.85}h2.5" class="map-pews"/>`).join('')).join('');
 const dialog=$<HTMLDialogElement>('info-dialog');for(const id of ['help','about'])$(id).onclick=()=>{walk.controls.unlock();dialog.showModal();};$('dialog-close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 $('lock').onclick=()=>{walk.controls.lock();};document.addEventListener('pointerlockchange',()=>{$('lock-hint').hidden=mode!=='walk'||walk.controls.isLocked||touch;});
 $('interact').onclick=interact;$('touch-interact').onclick=interact;$('map-toggle').onclick=toggleMap;$('map-close').onclick=toggleMap;
 const fullscreen=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('Trình duyệt này không hỗ trợ toàn màn hình.');}};$('fullscreen').onclick=fullscreen;
 $('capture').onclick=()=>{render();renderer.domElement.toBlob(blob=>{if(!blob)return;const a=document.createElement('a');const url=URL.createObjectURL(blob);a.href=url;a.download=`phuong-lac-${night?'buoi-toi':'buoi-sang'}-${Date.now()}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('Đã lưu ảnh không gian 3D.');});};
 document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(b=>b.onclick=()=>{setMode('orbit');orbit.preset(b.dataset.view as keyof typeof PRESETS);orbitFit=1;responsiveCamera();document.querySelectorAll('[data-view]').forEach(p=>p.classList.toggle('selected',p===b));$('location-title').textContent=b.textContent;});
 window.addEventListener('keydown',e=>{if(dialog.open)return;if(e.code==='Escape'&&mode==='walk')walk.controls.unlock();if(e.code==='KeyF'&&!e.repeat)void fullscreen();if(e.code==='KeyM'&&!e.repeat&&mode==='walk')toggleMap();if(e.code==='KeyE'&&!e.repeat)interact();});
 const joystick=$('joystick'),knob=joystick.querySelector('i')!;const release=()=>{walk.touch.set(0,0);knob.style.transform='';};joystick.addEventListener('pointerdown',e=>{joystick.setPointerCapture(e.pointerId);moveStick(e);});function moveStick(e:PointerEvent){if(!joystick.hasPointerCapture(e.pointerId))return;const r=joystick.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)/30,y=(e.clientY-r.top-r.height/2)/30;const v=new T.Vector2(x,-y).clampLength(0,1);walk.touch.copy(v);knob.style.transform=`translate(${v.x*27}px,${-v.y*27}px)`;}joystick.addEventListener('pointermove',moveStick);joystick.addEventListener('pointerup',release);joystick.addEventListener('pointercancel',release);
 window.addEventListener('resize',responsiveCamera);responsiveCamera();
 function frame(now:number){if(disposed)return;const dt=Math.min((now-last)/1000,.05);last=now;doors.forEach(d=>d.update(dt));if(mode==='orbit')orbit.update();if(mode==='walk')walk.update(dt);if(mode==='tour'){tour.update(dt);$('tour-progress').style.width=`${tour.progress*100}%`;updatePause();}
  if(mode==='walk'){
   nearDoor=doors.reduce((a,b)=>Math.hypot(camera.position.x-a.x,camera.position.z-a.z)<Math.hypot(camera.position.x-b.x,camera.position.z-b.z)?a:b);
   camera.getWorldDirection(look);raycaster.set(camera.position,look);const hit=raycaster.intersectObject(nearDoor.group,true)[0];const distance=Math.hypot(camera.position.x-nearDoor.x,camera.position.z-nearDoor.z);const facing=new T.Vector3(nearDoor.x-camera.position.x,0,nearDoor.z-camera.position.z).normalize().dot(look);
   const close=distance<4.8&&(facing>.25||!!hit&&hit.distance<4.8);$('interact').hidden=!close;$('interact').innerHTML=`<kbd>E</kbd> ${nearDoor.open?'Đóng':'Mở'} cửa`;
   $('location-title').textContent=isInterior(camera.position.x,camera.position.z)?(camera.position.x< -11?'Cánh trái · Ca đoàn':camera.position.x>11?'Cánh phải · Cầu nguyện':camera.position.z< -16?'Khu vực cung thánh':'Gian chính · Bốn dãy ghế'):'Khuôn viên giáo xứ Phương Lạc';
  }
  const inside=mode!=='orbit'&&isInterior(camera.position.x,camera.position.z)&&camera.position.y<22;$('simulation').hidden=!inside;
  $('map-dot').setAttribute('cx',String(camera.position.x));$('map-dot').setAttribute('cy',String(camera.position.z));const yaw=new T.Euler().setFromQuaternion(camera.quaternion,'YXZ').y;$('map-direction').setAttribute('transform',`translate(${camera.position.x} ${camera.position.z}) rotate(${-yaw*180/Math.PI})`);$('compass').style.transformOrigin='25px 25px';$('compass').style.transform=`rotate(${yaw-Math.PI/2}rad)`;
  lighting.update(camera);if(doors.some(d=>Math.abs(d.angle-(d.open?1.45:0))>.02))renderer.shadowMap.needsUpdate=true;
  lighting.sky.update(now/1000);life.update(now/1000,night);render();requestAnimationFrame(frame);
 }
 function render(){if(night)composer.render();else renderer.render(scene,camera);}
 lighting.update(camera);renderer.compile(scene,camera);renderer.render(scene,camera);$('loading').style.opacity='0';setTimeout(()=>$('loading').remove(),800);requestAnimationFrame(frame);
 // Read-only inspection and explicit local test hooks; no network or backend.
 Object.assign(window,{__app:{camera,scene,renderer,collision,doors,tour,walk,orbit,setMode,setTime,site:SITE,pewBlocks:PEW_BLOCKS,pewRows:PEW_ROWS,get mode(){return mode;},stats:()=>({calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures})}});
 window.addEventListener('pagehide',()=>{disposed=true;walk.exit();orbit.controls.dispose();walk.controls.dispose();const geos=new Set<T.BufferGeometry>(),materials=new Set<T.Material>();scene.traverse(o=>{if(o instanceof T.Mesh){geos.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}});geos.forEach(g=>g.dispose());materials.forEach(m=>{for(const value of Object.values(m))if(value instanceof T.Texture)value.dispose();m.dispose();});composer.passes.forEach(pass=>pass.dispose());composer.dispose();environment.dispose();renderer.dispose();},{once:true});
}
boot().catch(error=>{console.error(error);$('loading').innerHTML='<strong>Không thể mở không gian 3D</strong><p>Hãy dùng trình duyệt có WebGL 2 và bật tăng tốc phần cứng.</p>';});
