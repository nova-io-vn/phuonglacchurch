import * as T from 'three';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {backgroundMusic} from './BackgroundMusic';
import {mountUI} from '../ui/interface';
import {setupAuthorInfo} from '../ui/AuthorInfo';
import '../ui/minimal.css';
import {buildChurch} from '../architecture/ChurchBuilder';
import {ornaments} from '../architecture/OrnamentBuilder';
import {rearSpire,REAR_SPIRE} from '../architecture/RearSpire';
import {monumentBases,loadFigures} from '../architecture/Monuments';
import {SHRINE,VINCENT} from '../architecture/ShrineLayout';
import {buildEntrances,GATE_BRIDGE} from '../architecture/ParishGates';
import {staircase} from '../architecture/Staircase';
import {CHURCH_BASE,PLAN,PEW_BLOCKS,PEW_ROWS,isInterior} from '../architecture/config';
import {terrain} from '../environment/Terrain';
import {garden} from '../environment/Garden';
import {parishSite,SITE} from '../environment/ParishSite';
import {Life} from '../environment/Life';
import {Lighting} from '../environment/Lighting';
import {Collision} from '../controls/Collision';
import {OrbitMode} from '../controls/OrbitMode';
import {ChurchSpace,SPACES} from '../controls/ChurchSpace';
import {batchStatic,box} from '../utils/geometry';
import {mat} from '../materials/palette';
mountUI();
setupAuthorInfo();
const $=<E extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as E;
const music=backgroundMusic($<HTMLButtonElement>('music'));
async function boot(){
 await new Promise(requestAnimationFrame);
 const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,matchMedia('(pointer:coarse)').matches?1.25:1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.outputColorSpace=T.SRGBColorSpace;$('viewer').append(renderer.domElement);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(43,innerWidth/innerHeight,.12,1600);
 const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment(),environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;room.dispose();pmrem.dispose();
 const staticRoot=new T.Group(),dynamic=new T.Group(),assets=new T.Group();scene.add(staticRoot,dynamic,assets);
 const church=new T.Group(),doorRoot=new T.Group();church.position.y=doorRoot.position.y=CHURCH_BASE;staticRoot.add(church);dynamic.add(doorRoot);
 const collision=new Collision(),doors=buildChurch(church,doorRoot,collision);ornaments(church);rearSpire(church);
 box(staticRoot,mat.stone,0,.48,-9,22.6,.96,54.6);box(staticRoot,mat.stone,0,.48,-24,38.6,.96,12.6);
 staircase(staticRoot,collision,0,18.85,23.5);
 for(const side of [-1,1]){for(const z of [3,-9])staircase(staticRoot,collision,side*11.8,z,5.6,side*Math.PI/2);staircase(staticRoot,collision,side*19.25,-24,6,side*Math.PI/2);staircase(staticRoot,collision,side*7.8,-36.7,5.2,Math.PI);}
 const font=await new FontLoader().loadAsync('/fonts/parish-serif.json');
 terrain(staticRoot);garden(staticRoot,collision);parishSite(staticRoot,collision);monumentBases(staticRoot,font);const gates=buildEntrances(staticRoot,dynamic,collision,font),figures=await loadFigures(assets),life=new Life(dynamic);batchStatic(staticRoot);
 const lighting=new Lighting(scene,renderer),orbit=new OrbitMode(camera,renderer.domElement);
 const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));composer.addPass(new UnrealBloomPass(new T.Vector2(innerWidth,innerHeight),.2,.38,1.3));composer.addPass(new OutputPass());
 renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
 let mode:'orbit'|'space'='orbit',night=false,last=performance.now(),disposed=false,orbitFit=1;
 const space=new ChurchSpace(camera,renderer.domElement,index=>{$<HTMLSelectElement>('space-select').value=String(index);$('space-note').textContent=SPACES[index].note;document.querySelectorAll('[data-space]').forEach(b=>b.classList.toggle('active',Number((b as HTMLElement).dataset.space)===index));});
 function resize(){camera.aspect=innerWidth/innerHeight;if(mode==='orbit'){const fit=Math.max(1,Math.sqrt(1/camera.aspect));camera.position.sub(orbit.controls.target).multiplyScalar(fit/orbitFit).add(orbit.controls.target);orbitFit=fit;}camera.clearViewOffset();camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);}
 function setMode(next:typeof mode){space.exit();mode=next;orbit.controls.enabled=next==='orbit';$('space-panel').hidden=next!=='space';$('orbit').classList.toggle('active',next==='orbit');$('space').classList.toggle('active',next==='space');document.body.classList.toggle('exploring',next==='space');if(next==='space'){doors.forEach(d=>d.open=true);space.enter();}else{camera.fov=43;orbit.reset();orbitFit=1;}resize();}
 $('space-select').innerHTML=SPACES.map((s,i)=>`<option value="${i}">${s.title}</option>`).join('');$('space-stations').innerHTML=SPACES.map((s,i)=>`<button data-space="${i}"${i===0?' class="active"':''}>${s.title}</button>`).join('');
 $('space-select').onchange=()=>space.go(Number($<HTMLSelectElement>('space-select').value));document.querySelectorAll<HTMLButtonElement>('[data-space]').forEach(b=>b.onclick=()=>space.go(Number(b.dataset.space)));
 $('orbit').onclick=()=>setMode('orbit');$('space').onclick=()=>setMode('space');
 function setTime(value:boolean){night=value;lighting.set(night);document.body.classList.toggle('night',night);for(const id of ['morning','evening']){const active=(id==='evening')===night;$(id).classList.toggle('active',active);$(id).setAttribute('aria-pressed',String(active));}}
 $('morning').onclick=()=>setTime(false);$('evening').onclick=()=>setTime(true);
 window.addEventListener('keydown',e=>{if($<HTMLDialogElement>('author-dialog').open)return;if(e.code==='Escape')setMode('orbit');if(e.code==='KeyF'&&!e.repeat){if(document.fullscreenElement)void document.exitFullscreen();else void document.documentElement.requestFullscreen().catch(()=>{});}});
 const ray=new T.Raycaster();let down={x:0,y:0};
 renderer.domElement.addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY});
 renderer.domElement.addEventListener('pointerup',e=>{if(Math.hypot(e.clientX-down.x,e.clientY-down.y)>4||space.moving)return;const r=renderer.domElement.getBoundingClientRect();ray.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const interactive=[...doors,...gates],hit=ray.intersectObjects(interactive.map(d=>d.group),true)[0];if(hit){const d=interactive.find(d=>{let o:T.Object3D|null=hit.object;while(o){if(o===d.group)return true;o=o.parent;}return false;});if(d)d.open=!d.open;}});
 // Double-click any visible surface to relocate the orbit target; ordinary pan/zoom remains free.
 renderer.domElement.addEventListener('dblclick',e=>{if(mode!=='orbit')return;ray.setFromCamera(new T.Vector2(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1),camera);const hit=ray.intersectObjects([staticRoot,assets],true)[0];if(hit)orbit.focus(hit.point);});
 const render=()=>{if(night)composer.render();else renderer.render(scene,camera);};
 window.addEventListener('resize',resize);resize();
 function frame(now:number){if(disposed)return;const dt=Math.min((now-last)/1000,.05);last=now;doors.forEach(d=>d.update(dt));gates.forEach(g=>g.update(dt));if(mode==='orbit')orbit.update(dt);else space.update(dt);$('simulation').hidden=mode==='orbit'||!isInterior(camera.position.x,camera.position.z)||camera.position.y>23;lighting.update(camera);if(gates.some(g=>Math.abs(g.angle-(g.open?1.22:0))>.02)||doors.some(d=>Math.abs(d.angle-(d.open?1.45:0))>.02))renderer.shadowMap.needsUpdate=true;lighting.sky.update(now/1000);life.update(now/1000,night);render();requestAnimationFrame(frame);}
 lighting.update(camera);renderer.compile(scene,camera);render();$('loading').style.opacity='0';setTimeout(()=>$('loading').remove(),800);requestAnimationFrame(frame);
 Object.assign(window,{__app:{music,gates,gateBridge:GATE_BRIDGE,shrine:SHRINE,vincent:VINCENT,rearSpire:REAR_SPIRE,camera,scene,renderer,collision,doors,space,orbit,setMode,setTime,figures,measureFigures:()=>figures.humans.children.map(o=>{const b=new T.Box3().setFromObject(o,true);return b.max.y-b.min.y;}),site:SITE,plan:PLAN,pewBlocks:PEW_BLOCKS,pewRows:PEW_ROWS,get mode(){return mode;},stats:()=>({calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures})}});
 window.addEventListener('pagehide',()=>{disposed=true;space.exit();space.input.dispose();orbit.controls.dispose();const geos=new Set<T.BufferGeometry>(),materials=new Set<T.Material>();scene.traverse(o=>{if(o instanceof T.Mesh){geos.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}});geos.forEach(g=>g.dispose());materials.forEach(m=>{for(const value of Object.values(m))if(value instanceof T.Texture)value.dispose();m.dispose();});composer.passes.forEach(pass=>pass.dispose());composer.dispose();environment.dispose();renderer.dispose();},{once:true});
}
boot().catch(error=>{console.error(error);$('loading').innerHTML='<strong>Không thể mở không gian 3D</strong><p>Hãy dùng trình duyệt có WebGL 2 và tải lại trang.</p>';});
