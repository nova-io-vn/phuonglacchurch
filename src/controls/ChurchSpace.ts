import {PanoramaInput} from './PanoramaInput';
import * as T from 'three';
import {cameraRoute} from './Routes';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
export const SPACES=[
 {title:'Toàn gian nhà thờ',note:'Bốn dãy ghế · Sàn đá và vòm Gothic',p:v(0,4.4,14),t:v(0,5,-28),fov:62},
 {title:'Tầm mắt 1,70 m',note:'Cùng tỷ lệ với người mẫu trong công trình',p:v(0,3.05,5),t:v(0,4.7,-31),fov:55},
 {title:'Khu vực cung thánh',note:'Bàn thờ · Hậu tòa · Trang trí mạ vàng',p:v(0,3.65,-26),t:v(0,5.8,-35),fov:55},
 {title:'Cánh trái · Ca đoàn',note:'Đàn organ · Ghế hát · Giá nhạc',p:v(-6.6,3.7,-20),t:v(-15.5,2.35,-23.8),fov:57},
 {title:'Cánh phải · Cầu nguyện',note:'Một khoảng tĩnh lặng bên gian thánh',p:v(6.6,3.7,-20),t:v(16,3.3,-24),fov:57},
 {title:'Vòm và đèn chùm',note:'Gân vòm · Hoa thị · Pha lê',p:v(0,4.5,-10),t:v(0,18.4,-21),fov:61},
];
export class ChurchSpace {
 active=false;index=0;moving=false;elapsed=0;duration=1;segment=0;points:T.Vector3[]=[];from=new T.Vector3();look=new T.Vector3();pointers=new Map<number,{x:number,y:number}>();pinch=0;
 input:PanoramaInput;
 constructor(public camera:T.PerspectiveCamera,canvas:HTMLCanvasElement,public changed:(index:number)=>void,public stops=SPACES){
  this.input=new PanoramaInput(camera,canvas,()=>this.active,()=>{if(!this.moving)return false;this.moving=false;return true;});
 }
 enter(index=0){this.active=true;this.go(index);}
 exit(){this.active=false;this.moving=false;this.pointers.clear();this.input.clear();}
 go(index:number){this.input.clear();this.index=T.MathUtils.clamp(index,0,this.stops.length-1);this.changed(this.index);this.points=cameraRoute(this.camera.position,this.stops[this.index].p);this.segment=0;this.moving=true;this.camera.getWorldDirection(this.look);this.look.multiplyScalar(12).add(this.camera.position);this.begin();}
 begin(){this.from.copy(this.camera.position);this.elapsed=0;this.duration=Math.max(.4,this.from.distanceTo(this.points[this.segment])/42);}
 update(dt:number){if(!this.active)return;if(!this.moving){this.input.update(dt);return;}this.elapsed+=dt;const t=Math.min(1,this.elapsed/this.duration),s=t*t*(3-2*t),stop=this.stops[this.index];this.camera.position.lerpVectors(this.from,this.points[this.segment],s);this.look.lerp(stop.t,1-Math.exp(-dt*3));this.camera.lookAt(this.look);this.camera.fov=T.MathUtils.damp(this.camera.fov,stop.fov,5,dt);this.camera.updateProjectionMatrix();if(t===1){this.segment++;if(this.segment===this.points.length){this.moving=false;this.camera.lookAt(stop.t);this.input.sync();}else this.begin();}}
}
