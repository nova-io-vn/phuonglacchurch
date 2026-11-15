import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
export const PRESETS={overview:{p:[94,64,143],t:[0,9,23]},front:{p:[0,28,158],t:[0,10,30]},left:{p:[-94,33,-10],t:[0,14,-9]},right:{p:[94,33,-10],t:[0,14,-9]},aerial:{p:[65,88,72],t:[0,0,-12]},site:{p:[127,146,95],t:[-5,0,-29]},shrine:{p:[24,13,65],t:[0,5.5,96]},vincent:{p:[13,9,-39],t:[35,4,-40]},river:{p:[95,72,-142],t:[0,0,-88]}};
export class OrbitMode {
 controls:OrbitControls;lastPosition=new T.Vector3();lastTarget=new T.Vector3();focusPoint:T.Vector3|null=null;
 constructor(public camera:T.PerspectiveCamera,canvas:HTMLCanvasElement){this.controls=new OrbitControls(camera,canvas);this.controls.enableDamping=true;this.controls.dampingFactor=.14;this.controls.rotateSpeed=.55;this.controls.zoomSpeed=.7;this.controls.minDistance=.8;this.controls.maxDistance=650;this.controls.maxPolarAngle=Math.PI*.495;this.controls.minTargetRadius=0;this.controls.enablePan=true;this.controls.screenSpacePanning=true;this.controls.zoomToCursor=false;this.controls.panSpeed=.75;this.controls.touches.ONE=T.TOUCH.ROTATE;this.controls.touches.TWO=T.TOUCH.DOLLY_PAN;this.controls.addEventListener('start',()=>this.focusPoint=null);this.reset();}
 reset(){this.preset('overview');if(innerWidth<=760){this.camera.position.set(0,76,180);this.controls.target.set(0,7,24);this.camera.lookAt(this.controls.target);this.controls.update();}}
 preset(key:keyof typeof PRESETS){this.focusPoint=null;const p=PRESETS[key];this.camera.position.fromArray(p.p);this.controls.target.fromArray(p.t);this.camera.lookAt(this.controls.target);this.controls.update();this.remember();}
 focus(point:T.Vector3){this.focusPoint=point.clone().clamp(new T.Vector3(-700,.05,-700),new T.Vector3(700,250,700));}
 remember(){this.lastPosition.copy(this.camera.position);this.lastTarget.copy(this.controls.target);}
 update(dt=1/60){if(this.focusPoint){this.controls.target.lerp(this.focusPoint,1-Math.exp(-dt*7));if(this.controls.target.distanceToSquared(this.focusPoint)<.0025)this.focusPoint=null;}this.controls.update();
  // Reject entry into the continuous building envelope, including tower volumes.
  const p=this.camera.position;const solid=(q:T.Vector3)=>(Math.abs(q.x)<3&&q.z>-38&&q.z<-32&&q.y<33)||(Math.abs(q.x)<13&&q.z> -38&&q.z<21&&q.y<25)||(Math.abs(q.x)<20&&q.z> -32&&q.z< -16&&q.y<25)||(Math.abs(q.x)<4&&q.z>12&&q.z<20&&q.y<41)||[-8,8].some(x=>Math.abs(q.x-x)<3&&q.z>12&&q.z<20&&q.y<28);
  if(solid(p)){p.copy(this.lastPosition);this.controls.target.copy(this.lastTarget);this.focusPoint=null;this.camera.lookAt(this.controls.target);}
  this.controls.target.clamp(new T.Vector3(-700,.05,-700),new T.Vector3(700,250,700));this.camera.position.y=Math.max(.35,this.camera.position.y);this.remember();
 }
}
