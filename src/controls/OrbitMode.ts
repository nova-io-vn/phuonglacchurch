import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
export const PRESETS={overview:{p:[70,40,80],t:[0,12,-9]},front:{p:[0,23,94],t:[0,17,13]},left:{p:[-94,33,-10],t:[0,14,-9]},right:{p:[94,33,-10],t:[0,14,-9]},aerial:{p:[65,88,72],t:[0,0,-12]},site:{p:[127,146,95],t:[-5,0,-29]},shrine:{p:[39,16,73],t:[18,5.8,47]},river:{p:[95,72,-142],t:[0,0,-88]}};
export class OrbitMode {
 controls:OrbitControls;
 constructor(public camera:T.PerspectiveCamera,canvas:HTMLCanvasElement){this.controls=new OrbitControls(camera,canvas);this.controls.enableDamping=true;this.controls.dampingFactor=.07;this.controls.minDistance=.8;this.controls.maxDistance=650;this.controls.maxPolarAngle=Math.PI*.495;this.controls.minTargetRadius=0;this.controls.enablePan=true;this.controls.screenSpacePanning=true;this.controls.zoomToCursor=true;this.controls.panSpeed=.85;this.controls.touches.ONE=T.TOUCH.ROTATE;this.controls.touches.TWO=T.TOUCH.DOLLY_PAN;this.reset();}
 reset(){this.preset('overview');}
 preset(key:keyof typeof PRESETS){const p=PRESETS[key];this.camera.position.fromArray(p.p);this.controls.target.fromArray(p.t);this.camera.lookAt(this.controls.target);this.controls.update();}
 update(){this.controls.update();
  // Reject entry into the continuous building envelope, including tower volumes.
  const p=this.camera.position;const solid=(q:T.Vector3)=>(Math.abs(q.x)<3&&q.z>-38&&q.z<-32&&q.y<37)||(Math.abs(q.x)<13&&q.z> -38&&q.z<21&&q.y<25)||(Math.abs(q.x)<20&&q.z> -32&&q.z< -16&&q.y<25)||(Math.abs(q.x)<4&&q.z>12&&q.z<20&&q.y<41)||[-8,8].some(x=>Math.abs(q.x-x)<3&&q.z>12&&q.z<20&&q.y<28);
  if(solid(p)){const d=p.clone().sub(this.controls.target).normalize();for(let i=0;i<180&&solid(p);i++)p.addScaledVector(d,.5);}
  this.controls.target.clamp(new T.Vector3(-700,.05,-700),new T.Vector3(700,250,700));this.camera.position.y=Math.max(.35,this.camera.position.y);
 }
}
