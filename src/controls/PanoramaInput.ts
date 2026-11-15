import * as T from 'three';
/** Grab-style panorama input, with frame-independent easing and bounded optical zoom. */
export class PanoramaInput {
 pointers=new Map<number,{x:number,y:number,sx:number,sy:number}>();pinch=0;center:T.Vector2|null=null;dragging=false;
 yaw=0;pitch=0;targetYaw=0;targetPitch=0;targetFov=60;abort=new AbortController();
 constructor(public camera:T.PerspectiveCamera,public canvas:HTMLCanvasElement,public enabled:()=>boolean,public interrupt:()=>boolean){
  const options={signal:this.abort.signal};
  canvas.addEventListener('pointerdown',e=>{if(!enabled()||e.button>0)return;this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY});canvas.setPointerCapture(e.pointerId);this.measure();},options);
  canvas.addEventListener('pointermove',e=>{const p=this.pointers.get(e.pointerId);if(!enabled()||!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
   if(!this.dragging&&Math.hypot(p.x-p.sx,p.y-p.sy)<3)return;
   if(this.interrupt())this.sync();this.dragging=true;
   if(this.pointers.size===2){const [a,b]=[...this.pointers.values()],distance=Math.hypot(a.x-b.x,a.y-b.y),center=new T.Vector2((a.x+b.x)/2,(a.y+b.y)/2);if(this.pinch>0&&distance>10){this.targetFov=T.MathUtils.clamp(T.MathUtils.radToDeg(2*Math.atan(Math.tan(T.MathUtils.degToRad(this.targetFov)/2)*this.pinch/distance)),24,88);}if(this.center)this.turn((center.x-this.center.x)*.6,(center.y-this.center.y)*.6);this.pinch=distance;this.center=center;
   }else this.turn(dx,dy);
  },options);
  for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,e=>{this.pointers.delete((e as PointerEvent).pointerId);this.measure();if(!this.pointers.size)this.dragging=false;},options);
  canvas.addEventListener('wheel',e=>{if(!enabled())return;e.preventDefault();if(this.interrupt())this.sync();const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?canvas.clientHeight:1);this.targetFov=T.MathUtils.clamp(this.targetFov*Math.exp(T.MathUtils.clamp(delta,-180,180)*.0009),24,88);},{...options,passive:false});
  window.addEventListener('blur',()=>this.clear(),options);this.sync();
 }
 turn(dx:number,dy:number){const scale=this.targetFov/65;this.targetYaw+=dx/Math.max(320,this.canvas.clientWidth)*Math.PI*.7*scale;this.targetPitch=T.MathUtils.clamp(this.targetPitch+dy/Math.max(320,this.canvas.clientHeight)*Math.PI*.65*scale,-1.45,1.45);}
 measure(){if(this.pointers.size===2){const [a,b]=[...this.pointers.values()];this.pinch=Math.hypot(a.x-b.x,a.y-b.y);this.center=new T.Vector2((a.x+b.x)/2,(a.y+b.y)/2);}else{this.pinch=0;this.center=null;}}
 sync(){const r=new T.Euler().setFromQuaternion(this.camera.quaternion,'YXZ');this.yaw=this.targetYaw=r.y;this.pitch=this.targetPitch=r.x;this.targetFov=this.camera.fov;}
 update(dt:number){this.yaw=T.MathUtils.damp(this.yaw,this.targetYaw,18,dt);this.pitch=T.MathUtils.damp(this.pitch,this.targetPitch,18,dt);this.camera.rotation.set(this.pitch,this.yaw,0,'YXZ');this.camera.fov=T.MathUtils.damp(this.camera.fov,this.targetFov,16,dt);this.camera.updateProjectionMatrix();}
 clear(){this.pointers.clear();this.pinch=0;this.center=null;this.dragging=false;}
 dispose(){this.clear();this.abort.abort();}
}
