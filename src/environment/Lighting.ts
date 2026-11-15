import * as T from 'three';
import {Sky} from './Sky';
import {setGlassNight} from '../materials/palette';
import {LAMPS} from './Garden';
import {isInterior} from '../architecture/config';
export class Lighting {
 sun=new T.DirectionalLight('#fff0ce',3.1);ambient=new T.HemisphereLight('#d5e6ed','#908164',1.3);night=false;lamps:T.Light[]=[];inside:T.Light[]=[];sky:Sky;
 constructor(public scene:T.Scene,public renderer:T.WebGLRenderer){
  this.sky=new Sky(scene);scene.add(this.sun,this.ambient);this.sun.position.set(32,44,-48);this.sun.castShadow=true;this.sun.shadow.mapSize.set(2048,2048);Object.assign(this.sun.shadow.camera,{left:-120,right:120,top:145,bottom:-110,near:1,far:300});this.sun.shadow.bias=-.0003;this.sun.shadow.normalBias=.035;this.sun.shadow.camera.updateProjectionMatrix();
  for(const x of [-10,-5,0,5,10]){
   const spot=new T.SpotLight('#ffc77d',0,68,.35,.7,1.3);spot.position.set(x,.8,24);spot.target.position.set(x*.6,25,16);scene.add(spot,spot.target);this.lamps.push(spot);
  }
  for(const s of [-1,1])for(const z of [-33,-24,-12,0,14]){const l=new T.PointLight('#ffd292',0,22,1.35);l.position.set(s*(z===-24?20:13),4.5,z);scene.add(l);this.lamps.push(l);}
  for(const {x,z} of LAMPS){const l=new T.PointLight('#ffd18c',0,11,1.6);l.position.set(x,3.7,z);scene.add(l);this.lamps.push(l);}
  for(const z of [-32,-20,-8,6]){const l=new T.PointLight('#ffe3af',55,24,1.4);l.position.set(0,9,z);scene.add(l);this.inside.push(l);}
  for(const x of [-14,14]){const l=new T.PointLight('#ffe1aa',65,18,1.5);l.position.set(x,9,-24);scene.add(l);this.inside.push(l);}
  const altar=new T.SpotLight('#ffe6b4',180,35,.65,.8,1.3);altar.position.set(0,13,-29);altar.target.position.set(0,2,-33);scene.add(altar,altar.target);this.inside.push(altar);
  const shrine=new T.PointLight('#ffd89c',0,22,1.4);shrine.position.set(0,5,90);shrine.userData.power=38;scene.add(shrine);this.lamps.push(shrine);for(const [x,y,z] of [[-36,4,38],[-36,5,-43],[-5,4,94],[5,4,94],[33,4,-40],[-18,7,33],[18,7,33],[0,26,-40]]){const l=new T.PointLight('#ffd295',0,22,1.3);l.position.set(x,y,z);l.userData.power=z===94?18:38;scene.add(l);this.lamps.push(l);}this.set(false);
 }
 set(night:boolean){this.night=night;this.sky.set(night);this.sun.intensity=night?.05:3.2;this.sun.color.set(night?'#9bb4e7':'#ffdda8');this.ambient.intensity=night?.28:.95;this.scene.environmentIntensity=night?.12:.28;this.ambient.color.set(night?'#6d83bc':'#d5e6ed');this.lamps.forEach(l=>{l.intensity=l.userData.power??(l instanceof T.SpotLight?300:65);l.visible=night;});this.scene.fog=new T.FogExp2(night?'#182330':'#d8dfd5',night?.002:.0019);this.renderer.toneMappingExposure=night?1.05:.96;this.renderer.shadowMap.needsUpdate=true;setGlassNight(night);}
 update(camera:T.Camera){
  const p=camera.position,inside=isInterior(p.x,p.z)&&p.y<22;
  this.inside.forEach(l=>l.visible=inside);
  if(!this.night)return;
  // Bound fragment shader light count; lantern emissive meshes remain visible everywhere.
  const candidates=this.lamps.map(l=>({l,d:l.position.distanceToSquared(p)*(l instanceof T.SpotLight?.25:1)})).sort((a,b)=>a.d-b.d);
  const selected=new Set(candidates.slice(0,inside?2:11).map(item=>item.l));this.lamps.forEach(l=>l.visible=selected.has(l));
 }
}
