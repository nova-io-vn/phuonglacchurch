import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
export const PRESETS={overview:{p:[55,36,68],t:[0,12,-2]},front:{p:[0,22,88],t:[0,17,13]},left:{p:[-78,32,8],t:[0,15,-4]},right:{p:[78,32,8],t:[0,15,-4]},aerial:{p:[48,73,55],t:[0,0,-2]},site:{p:[102,120,100],t:[-6,0,-8]}};
export class OrbitMode {
 controls:OrbitControls;
 constructor(public camera:T.PerspectiveCamera,canvas:HTMLCanvasElement){this.controls=new OrbitControls(camera,canvas);this.controls.enableDamping=true;this.controls.dampingFactor=.07;this.controls.minDistance=24;this.controls.maxDistance=150;this.controls.maxPolarAngle=Math.PI*.475;this.controls.minTargetRadius=0;this.reset();}
 reset(){this.preset('overview');}
 preset(key:keyof typeof PRESETS){const p=PRESETS[key];this.camera.position.fromArray(p.p);this.controls.target.fromArray(p.t);this.camera.lookAt(this.controls.target);this.controls.update();}
 update(){this.controls.update();
  // Reject entry into the continuous building envelope, including tower volumes.
  const p=this.camera.position;const solid=(q:T.Vector3)=>(Math.abs(q.x)<13&&q.z> -26&&q.z<21&&q.y<24)||(Math.abs(q.x)<20&&q.z> -20&&q.z< -4&&q.y<24)||(Math.abs(q.x)<4&&q.z>12&&q.z<20&&q.y<40)||[-8,8].some(x=>Math.abs(q.x-x)<3&&q.z>12&&q.z<20&&q.y<27);
  if(solid(p)){const d=p.clone().sub(this.controls.target).normalize();for(let i=0;i<180&&solid(p);i++)p.addScaledVector(d,.5);}
  this.controls.target.clamp(new T.Vector3(-30,0,-35),new T.Vector3(30,37,35));
 }
}
