import * as T from 'three';
import {cameraRoute} from './Routes';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
export const STOPS=[
 {title:'Toàn cảnh giáo xứ',text:'Nhà thờ Giáo xứ Phương Lạc — tác giả trải nghiệm: Dinh Quoc Bao.',p:v(65,37,72),t:v(0,12,-8)},
 {title:'Mặt tiền và đại bậc',text:'Bệ cao 1,35 m, tám bậc đá có tay vịn và đèn hắt. Nhân vật 1,70 m giúp đọc tỷ lệ kiến trúc.',p:v(0,13,58),t:v(0,11,18)},
 {title:'Ba tháp mái vòm',text:'Giữ dáng mái vòm của phối cảnh vàng, bổ sung lớp phào, hốc tượng và các chi tiết nổi.',p:v(18,31,41),t:v(0,28,16)},
 {title:'Mặt bên và cửa vào',text:'Thân dài 54 m theo tỷ lệ mô phỏng, có các lối vào bên và cầu thang đá riêng.',p:v(74,27,-8),t:v(0,10,-9)},
 {title:'Gian chính',text:'Bốn dãy ghế, sàn đá khảm, cột và vòm cao. Nội thất là phương án tái dựng mô phỏng.',p:v(0,4.4,14),t:v(0,4.5,-28)},
 {title:'Ca đoàn bên trái',text:'Không gian ca đoàn được bố trí ở cánh trái khi nhìn từ cửa chính về bàn thờ.',p:v(-6.6,3.7,-20),t:v(-15.5,2.35,-23.8)},
 {title:'Cung thánh',text:'Hậu tòa Gothic, bàn thờ, điểm nhấn mạ vàng và hệ đèn chùm pha lê.',p:v(0,3.65,-26),t:v(0,6,-35)},
 {title:'Đài Đức Mẹ · sân trước',text:'Đài trên sân trước phía phải, tại vị trí hồ cũ; tượng Đức Mẹ và Hài Nhi dùng bản quét SMK, không phải bản quét tượng thực địa.',p:v(39,16,73),t:v(18,5.8,47)},
 {title:'Sông, ao và xóm đạo',text:'Bổ sung tuyến sông/kênh, cầu, ao và bờ xanh. Tọa độ tuyến nước và đài vẫn cần dữ liệu khảo sát để khớp hiện trạng.',p:v(85,64,-132),t:v(0,0,-83)},
 {title:'Tổng thể từ trên cao',text:'Công trình nối với sân, đài Đức Mẹ, ao nước và cảnh quan làng quê.',p:v(100,118,103),t:v(-4,0,-20)},
];
export class GuidedTour {
 active=false;paused=false;index=0;elapsed=0;progress=0;arrived=false;waypoints:T.Vector3[]=[];from=new T.Vector3();look=new T.Vector3();segment=0;duration=1;
 constructor(public camera:T.PerspectiveCamera,public changed:(i:number)=>void){}
 start(){this.active=true;this.paused=false;this.go(0);}
 stop(){this.active=false;}
 go(i:number){this.index=T.MathUtils.clamp(i,0,STOPS.length-1);this.elapsed=0;this.progress=0;this.arrived=false;this.segment=0;this.changed(this.index);this.camera.getWorldDirection(this.look);this.look.multiplyScalar(10).add(this.camera.position);this.waypoints=cameraRoute(this.camera.position,STOPS[this.index].p);this.beginSegment();}
 beginSegment(){this.from.copy(this.camera.position);this.elapsed=0;this.duration=Math.max(.8,this.from.distanceTo(this.waypoints[this.segment])/21);}
 update(dt:number){if(!this.active||this.paused)return;const target=STOPS[this.index];if(this.arrived){this.elapsed+=dt;if(this.elapsed>7&&this.index<STOPS.length-1)this.go(this.index+1);else if(this.index===STOPS.length-1&&this.elapsed>7)this.paused=true;return;}this.elapsed+=dt;const t=T.MathUtils.clamp(this.elapsed/this.duration,0,1),s=t*t*(3-2*t);this.camera.position.lerpVectors(this.from,this.waypoints[this.segment],s);this.look.lerp(target.t,1-Math.exp(-dt*2));this.camera.lookAt(this.look);this.progress=(this.segment+t)/this.waypoints.length;if(t>=1){this.segment++;if(this.segment>=this.waypoints.length){this.arrived=true;this.elapsed=0;}else this.beginSegment();}}
}
