import * as T from 'three';
import {isInterior} from '../architecture/config';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
export const STOPS=[
 {title:'Toàn cảnh công trình',text:'Ba tháp mái vòm tạo nhịp điệu đối xứng trên nền tường vàng kem.',p:v(49,30,63),t:v(0,13,0)},
 {title:'Mặt tiền chính',text:'Ba cổng vòm nhọn, phào nhiều lớp và hốc tượng phía trên cửa giữa. Hốc tượng đang chờ asset được cấp phép.',p:v(0,13,49),t:v(0,14,18)},
 {title:'Tháp trung tâm',text:'Các tầng thu nhỏ dần, vòm cong có gân kim loại và thánh giá trên đỉnh.',p:v(16,32,37),t:v(0,29,16)},
 {title:'Mặt bên trái',text:'Trụ tường và kính màu được tổ chức theo cùng một hệ nhịp với cột nội thất.',p:v(-36,12,-8),t:v(-10,8,-5)},
 {title:'Mặt bên phải',text:'Mái ngói đỏ giao với đầu hồi ngang; đường phào ngà liên tục bao quanh công trình.',p:v(36,12,-8),t:v(10,8,-5)},
 {title:'Cửa chính',text:'Cánh cửa gỗ mở vào cùng không gian 3D. Không chuyển cảnh khi đi vào nhà thờ.',p:v(0,2.28,24),t:v(0,3.5,16)},
 {title:'Gian chính · Bốn dãy ghế',text:'Bốn dãy ghế dọc, mỗi dãy mười băng ghế gỗ. Lối giữa và các lối phụ nối tới phần giao hai cánh ngang.',p:v(0,3.1,13),t:v(0,4,-16)},
 {title:'Cánh trái · Ca đoàn',text:'Ca đoàn ở cánh trái khi nhìn từ cửa chính về cung thánh: ghế hát, đàn organ và giá nhạc. Cánh phải dành cho cầu nguyện.',p:v(-6.6,3,-8),t:v(-15.5,1.6,-11.8)},
 {title:'Khu vực cung thánh',text:'Ba bậc cấp, bàn thờ đá, thánh giá và bục đọc sách. Thiết kế giả định, chưa có ảnh nội thất.',p:v(0,2.7,-12.7),t:v(0,5.5,-23)},
 {title:'Giáo xứ giữa làng quê',text:'Bối cảnh tham khảo ghim Google Maps: đường Phương Lạc, trường học, ao nước và ruộng. Kích thước cảnh quan là ước lượng từ ảnh vệ tinh.',p:v(70,90,85),t:v(-5,0,-5)},
];
export class GuidedTour {
 active=false;paused=false;index=0;elapsed=0;progress=0;arrived=false;waypoints:T.Vector3[]=[];from=new T.Vector3();look=new T.Vector3();lookFrom=new T.Vector3();segment=0;duration=1;
 constructor(public camera:T.PerspectiveCamera,public changed:(i:number)=>void){}
 start(){this.active=true;this.paused=false;this.go(0);}
 stop(){this.active=false;}
 go(i:number){this.index=T.MathUtils.clamp(i,0,STOPS.length-1);this.elapsed=0;this.progress=0;this.arrived=false;this.segment=0;this.changed(this.index);const target=STOPS[this.index];const p=this.camera.position;
  this.camera.getWorldDirection(this.look);this.look.multiplyScalar(10).add(p);this.lookFrom.copy(this.look);
  const inside=(p:T.Vector3)=>isInterior(p.x,p.z)&&p.y<22;
  const fromInside=inside(p),toInside=inside(target.p);
  this.waypoints=[];
  if(fromInside&&!toInside)this.waypoints.push(v(0,2.28,p.z),v(0,2.28,24));
  if(!fromInside&&toInside)this.waypoints.push(v(p.x,Math.max(p.y,3),32),v(0,2.28,32),v(0,2.28,24));
  if(fromInside&&toInside&&Math.abs(p.x)>6)this.waypoints.push(v(p.x,2.28,-8),v(0,2.28,-8));
  if(toInside&&Math.abs(target.p.x)>6)this.waypoints.push(v(0,2.28,-8),v(target.p.x,2.28,-8));
  // Every ground-level exterior transition around a side uses the open forecourt.
  // In particular, side -> doorway must not cut diagonally through the front corner.
  if(!fromInside&&!toInside){
   if(p.z<23&&Math.abs(p.x)>13)this.waypoints.push(v(p.x,Math.max(p.y,3),32));
   if(target.p.z<23&&Math.abs(target.p.x)>13)this.waypoints.push(v(target.p.x,target.p.y,32));
  }
  this.waypoints.push(target.p.clone());this.beginSegment();
 }
 beginSegment(){this.from.copy(this.camera.position);this.elapsed=0;this.duration=Math.max(1.6,this.from.distanceTo(this.waypoints[this.segment])/11);}
 update(dt:number){if(!this.active||this.paused)return;const target=STOPS[this.index];if(this.arrived){this.elapsed+=dt;if(this.elapsed>7&&this.index<STOPS.length-1)this.go(this.index+1);else if(this.index===STOPS.length-1&&this.elapsed>7)this.paused=true;return;}
  this.elapsed+=dt;const t=T.MathUtils.clamp(this.elapsed/this.duration,0,1),s=t*t*(3-2*t);this.camera.position.lerpVectors(this.from,this.waypoints[this.segment],s);
  this.look.lerp(target.t,1-Math.exp(-dt*1.8));this.camera.lookAt(this.look);this.progress=(this.segment+t)/this.waypoints.length;
  if(t>=1){this.segment++;if(this.segment>=this.waypoints.length){this.arrived=true;this.elapsed=0;}else this.beginSegment();}
 }
}
