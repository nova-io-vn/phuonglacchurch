import * as T from 'three';
import {Sky} from './Sky';
import {setGlassNight} from '../materials/palette';
import {LAMPS} from './Garden';
import {isInterior} from '../architecture/config';
export class Lighting {
 sun=new T.DirectionalLight('#fff0ce',3.1);ambient=new T.HemisphereLight('#d5e6ed','#908164',1.3);night=false;lamps:T.Light[]=[];inside:T.Light[]=[];sky:Sky;
 constructor(public scene:T.Scene,public renderer:T.WebGLRenderer){
  this.sky=new Sky(scene);scene.add(this.sun,this.ambient);this.sun.position.set(32,44,-48);this.sun.castShadow=true;this.sun.shadow.mapSize.set(2048,2048);Object.assign(this.sun.shadow.camera,{left:-65,right:65,top:65,bottom:-65,near:1,far:180});this.sun.shadow.bias=-.0003;this.sun.shadow.normalBias=.035;this.sun.shadow.camera.updateProjectionMatrix();
  for(const x of [-10,-5,0,5,10]){
   const spot=new T.SpotLight('#ffc77d',0,68,.35,.7,1.3);spot.position.set(x,.8,24);spot.target.position.set(x*.6,25,16);scene.add(spot,spot.target);this.lamps.push(spot);
  }
  for(const s of [-1,1])for(const z of [-15,0,14]){const l=new T.PointLight('#f8cd83',0,18,1.5);l.position.set(s*13,4,z);scene.add(l);this.lamps.push(l);}
  for(const {x,z} of LAMPS){const l=new T.PointLight('#ffd18c',0,11,1.6);l.position.set(x,3.7,z);scene.add(l);this.lamps.push(l);}
  for(const z of [-20,-10,0,10]){const l=new T.PointLight('#ffe3af',65,24,1.4);l.position.set(0,8,z);scene.add(l);this.inside.push(l);}
  for(const x of [-14,14]){const l=new T.PointLight('#ffe1aa',70,18,1.5);l.position.set(x,8,-12);scene.add(l);this.inside.push(l);}
  const altar=new T.SpotLight('#ffe6b4',180,35,.65,.8,1.3);altar.position.set(0,12,-17);altar.target.position.set(0,1,-21);scene.add(altar,altar.target);this.inside.push(altar);this.set(false);
 }
 set(night:boolean){this.night=night;this.sky.set(night);this.sun.intensity=night?.035:3.2;this.sun.color.set(night?'#9bb4e7':'#ffdda8');this.ambient.intensity=night?.2:.95;this.scene.environmentIntensity=night?.07:.28;this.ambient.color.set(night?'#6d83bc':'#d5e6ed');this.lamps.forEach(l=>{l.intensity=l instanceof T.SpotLight?170:24;l.visible=night;});this.scene.fog=new T.FogExp2(night?'#182330':'#d8dfd5',night?.0025:.0019);this.renderer.toneMappingExposure=night?1.05:.96;this.renderer.shadowMap.needsUpdate=true;setGlassNight(night);}
 update(camera:T.Camera){
  const p=camera.position,inside=isInterior(p.x,p.z)&&p.y<22;
  this.inside.forEach(l=>l.visible=inside);
  if(!this.night)return;
  // Bound fragment shader light count; lantern emissive meshes remain visible everywhere.
  const candidates=this.lamps.map(l=>({l,d:l.position.distanceToSquared(p)*(l instanceof T.SpotLight?.25:1)})).sort((a,b)=>a.d-b.d);
  const selected=new Set(candidates.slice(0,inside?2:7).map(item=>item.l));this.lamps.forEach(l=>l.visible=selected.has(l));
 }
}
