import * as T from 'three';
import {PointerLockControls} from 'three/addons/controls/PointerLockControls.js';
import {Collision} from './Collision';
export class WalkMode {
 controls:PointerLockControls;keys=new Set<string>();velocity=new T.Vector2();active=false;touch=new T.Vector2();lookTouch:{id:number,x:number,y:number}|null=null;
 constructor(public camera:T.PerspectiveCamera,public canvas:HTMLCanvasElement,public collision:Collision){
  this.controls=new PointerLockControls(camera,canvas);this.controls.pointerSpeed=.7;
  document.addEventListener('keydown',e=>{if(!this.active||e.target instanceof HTMLInputElement)return;if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();this.keys.add(e.code);});document.addEventListener('keyup',e=>this.keys.delete(e.code));
  window.addEventListener('blur',()=>{this.keys.clear();this.touch.set(0,0);this.velocity.set(0,0);});document.addEventListener('pointerlockchange',()=>{if(!this.controls.isLocked){this.keys.clear();this.velocity.set(0,0);}});
  canvas.addEventListener('pointerdown',e=>{if(this.active&&e.pointerType==='touch'){this.lookTouch={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);}else if(this.active&&!this.controls.isLocked){this.controls.lock();}});
  canvas.addEventListener('pointermove',e=>{if(!this.lookTouch||e.pointerId!==this.lookTouch.id)return;const q=new T.Euler().setFromQuaternion(camera.quaternion,'YXZ');q.y-=(e.clientX-this.lookTouch.x)*.004;q.x=T.MathUtils.clamp(q.x-(e.clientY-this.lookTouch.y)*.004,-1.4,1.4);camera.quaternion.setFromEuler(q);this.lookTouch.x=e.clientX;this.lookTouch.y=e.clientY;});
  canvas.addEventListener('pointerup',()=>this.lookTouch=null);canvas.addEventListener('pointercancel',()=>this.lookTouch=null);
 }
 enter(){this.active=true;this.velocity.set(0,0);this.camera.position.set(0,1.68,27);this.camera.lookAt(0,2,0);}
 exit(){this.active=false;this.controls.unlock();this.keys.clear();this.touch.set(0,0);}
 update(dt:number){if(!this.active)return;const enabled=this.controls.isLocked||this.touch.length()>0;if(!enabled)return;
  let x=Number(this.keys.has('KeyD')||this.keys.has('ArrowRight'))-Number(this.keys.has('KeyA')||this.keys.has('ArrowLeft'))+this.touch.x;
  let z=Number(this.keys.has('KeyW')||this.keys.has('ArrowUp'))-Number(this.keys.has('KeyS')||this.keys.has('ArrowDown'))+this.touch.y;
  const v=new T.Vector2(x,z);if(v.length()>1)v.normalize();v.multiplyScalar(this.keys.has('ShiftLeft')||this.keys.has('ShiftRight')?5:2.6);this.velocity.lerp(v,1-Math.exp(-12*dt));
  const direction=new T.Vector3();this.camera.getWorldDirection(direction);direction.y=0;direction.normalize();const right=new T.Vector3().crossVectors(direction,new T.Vector3(0,1,0));const move=direction.multiplyScalar(this.velocity.y*dt).addScaledVector(right,this.velocity.x*dt);
  this.collision.move(this.camera.position,move.x,move.z);this.camera.position.y=T.MathUtils.damp(this.camera.position.y,this.collision.floor(this.camera.position.x,this.camera.position.z)+1.68,18,dt);
 }
}
