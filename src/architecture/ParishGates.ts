import * as T from 'three';
import type {Font} from 'three/addons/loaders/FontLoader.js';
import {mat} from '../materials/palette';
import {batchStatic,box,cross,curve,extrude,mesh,rod} from '../utils/geometry';
import {agedStone,carvedStone,cartouche,gateGold,lettering,stoneRail} from './Stonework';
import {Collision} from '../controls/Collision';
export const GATE_SITES=[{x:-34,z:38,kind:'open' as const,title:'Cổng trụ và cầu đá'},{x:-34,z:-43,kind:'arch' as const,title:'Cổng vòm đá'}];
export const GATE_BRIDGE={center:2.6,length:5.6,width:8.8,endX:-39.4,roadNearX:-40};
export class ParishGate {
 group=new T.Group();leaves:T.Group[]=[];angle=0;open=false;
 constructor(root:T.Group,dynamic:T.Group,font:Font,public x:number,public z:number,public kind:'open'|'arch'){
  const frame=new T.Group();frame.position.set(x,0,z);frame.rotation.y=-Math.PI/2;root.add(frame);this.group.position.copy(frame.position);this.group.rotation.copy(frame.rotation);dynamic.add(this.group);
  this.open=kind==='open';this.angle=this.open?1.22:0;
  for(const side of [-1,1]){
   box(frame,agedStone,side*4.2, .16,0,1.85,.32,1.85);box(frame,carvedStone,side*4.2,2.8,0,1.35,5.4,1.35);cartouche(frame,side*4.2,2.85,.72,.98,4.3);
   for(let j=0;j<8;j++){const y=1+j*.48;curve(frame,carvedStone,[new T.Vector3(side*4.2-.27,y,.93),new T.Vector3(side*4.2+.2,y+.15,.93),new T.Vector3(side*4.2-.1,y+.35,.93)],.045);}
   for(const [y,w,h] of [[.6,1.65,.2],[5.45,1.65,.24],[5.66,1.85,.18]])box(frame,carvedStone,side*4.2,y,0,w,h,w);
  }
  if(kind==='arch'){
   const s=new T.Shape();s.moveTo(-5,5.4);s.lineTo(5,5.4);s.lineTo(5,6.15);s.lineTo(3.7,6.3);s.lineTo(2.8,7.7);s.lineTo(1.5,7.8);s.lineTo(0,8.3);s.lineTo(-1.5,7.8);s.lineTo(-2.8,7.7);s.lineTo(-3.7,6.3);s.lineTo(-5,6.15);s.closePath();
   const lower=new T.Shape();lower.moveTo(-3.5,5.45);lower.lineTo(3.5,5.45);lower.lineTo(3.5,4.05);lower.quadraticCurveTo(0,6.75,-3.5,4.05);lower.closePath();
   mesh(extrude(s,1.25),carvedStone,frame,0,0,-.62);mesh(extrude(lower,1.25),carvedStone,frame,0,0,-.62);
   cartouche(frame,0,6.65,.7,4.7,.8);lettering(frame,font,'GIÁO XỨ PHƯƠNG LẠC',.24,0,6.52,.92);cross(frame,carvedStone,0,8.8,0,.72);
   for(const side of [-1,1])curve(frame,carvedStone,[new T.Vector3(side*5,6.25,.68),new T.Vector3(side*3.6,6.55,.68),new T.Vector3(side*2.8,7.87,.68),new T.Vector3(side*.8,8.2,.68)],.1);
  }
  for(const side of [-1,1]){
   const pivot=new T.Group();pivot.position.set(side*3.5,.35,.24);pivot.scale.y=kind==='arch'?.77:1;this.group.add(pivot);this.leaves.push(pivot);const cx=-side*1.75;
   for(const xx of [-side*.09,-side*3.4])box(pivot,gateGold,xx,2.4,0,.09,4.8,.12);
   for(const y of [.2,1.5,4.6])box(pivot,gateGold,cx,y,0,3.4,.08,.12);
   for(let j=0;j<17;j++){const xx=-side*(.18+j*.195),h=4.8+Math.sin(j/16*Math.PI)*.4;box(pivot,gateGold,xx,h/2,0,.035,h,.055);mesh(new T.SphereGeometry(.065,7,5),gateGold,pivot,xx,h+.06,0);}
   const ring=mesh(new T.TorusGeometry(.65,.055,7,48),gateGold,pivot,cx,3.13,.07);ring.name='Gate medallion';
   for(let j=0;j<20;j++){const a=j*Math.PI/10;rod(pivot,gateGold,new T.Vector3(cx+Math.cos(a)*.75,3.13+Math.sin(a)*.75,.07),new T.Vector3(cx+Math.cos(a)*1.35,3.13+Math.sin(a)*1.35,.07),.025);}
   lettering(pivot,font,'IHS',.24,cx,3.04,.12);
   for(let j=0;j<5;j++)for(const sign of [-1,1]){const xx=cx+(j-2)*.6;curve(pivot,gateGold,[new T.Vector3(xx,.4,.08),new T.Vector3(xx+sign*.22,.7,.08),new T.Vector3(xx-sign*.16,1.1,.08),new T.Vector3(xx+sign*.18,1.4,.08)],.025);}
   curve(pivot,gateGold,[new T.Vector3(-side*.05,4.8,0),new T.Vector3(cx,5.7,0),new T.Vector3(-side*3.45,4.8,0)],.055);
  }
  this.leaves.forEach(leaf=>batchStatic(leaf));this.update(0);
  // Raised bridge crossing the water edge with sculpted balustrades.
  box(frame,agedStone,0,.04,GATE_BRIDGE.center,8.8,.25,GATE_BRIDGE.length);box(frame,mat.pavement,0,.2,GATE_BRIDGE.center,8.4,.1,GATE_BRIDGE.length);
  for(const side of [-1,1]){const rail=new T.Group();rail.position.set(side*4.4,.22,GATE_BRIDGE.center);rail.rotation.y=Math.PI/2;frame.add(rail);stoneRail(rail,GATE_BRIDGE.length);}
 }
 update(dt:number){this.angle=T.MathUtils.damp(this.angle,this.open?1.22:0,6,dt);this.leaves[0].rotation.y=-this.angle;this.leaves[1].rotation.y=this.angle;}
}
export function buildEntrances(root:T.Group,dynamic:T.Group,col:Collision,font:Font){
 const gates=GATE_SITES.map(a=>new ParishGate(root,dynamic,font,a.x,a.z,a.kind));
 const sign=new T.Group();sign.position.set(-28,.05,29);sign.rotation.y=-Math.PI/2;root.add(sign);
 const s=new T.Shape();s.moveTo(-2.9,0);s.lineTo(2.8,0);s.lineTo(2.5,2.5);s.lineTo(1.7,3.05);s.lineTo(-1.65,2.9);s.lineTo(-2.4,2.25);s.closePath();mesh(extrude(s,.5),agedStone,sign,0,.22,-.25);box(sign,carvedStone,0,.16,0,6.2,.32,1.1);
 lettering(sign,font,'GIÁO XỨ',.38,0,2.05,.28);lettering(sign,font,'PHƯƠNG LẠC',.5,0,1.15,.29);
 for(const side of [-1,1]){const rail=new T.Group();rail.position.set(-28,.05,29+side*3.5);root.add(rail);stoneRail(rail,6);}
 for(const a of GATE_SITES)col.add(a.x,a.z+5.1,1.3,1.3,'gate pier');
 return gates;
}
