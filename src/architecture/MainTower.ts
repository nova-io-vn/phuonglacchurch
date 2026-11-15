import * as T from 'three';
import {mat} from '../materials/palette';
import {arch,box,column,cross,curve,mesh,panel,ring} from '../utils/geometry';
import {windows} from './GothicWindow';
function towerSection(p:T.Group,w:number,y:number,h:number,niche=false){
 for(let side=0;side<4;side++){
  const g=new T.Group();g.position.y=y;g.rotation.y=side*Math.PI/2;g.position.x=Math.sin(side*Math.PI/2)*w/2;g.position.z=Math.cos(side*Math.PI/2)*w/2;p.add(g);
  const holeW=w*.38,holeH=h*.72;panel(g,mat.wall,w,h,.38,[{x:0,y:h*.12,w:holeW,h:holeH}]);
  const frame=new T.Group();frame.position.set(0,h*.12,.35);g.add(frame);ring(frame,mat.ivory,holeW,holeH,.12,0);ring(frame,mat.ivory,holeW+.35,holeH+.2,.07,-.03);
  mesh(new T.ShapeGeometry(arch(holeW-.04,holeH-.05)),niche&&side===0?mat.stone:mat.dark,frame,0,0,-.16);
  if(!(niche&&side===0))for(let row=0;row<18;row++){const yy=.12+row*holeH*.034;box(frame,mat.stone,0,yy,-.03,holeW-.14,.065,.1);}else box(frame,mat.ivory,0,.05,.1,holeW+.3,.22,.7);
  curve(g,mat.ivory,[new T.Vector3(-w*.31,h*.9,.5),new T.Vector3(0,h+.17,.5),new T.Vector3(w*.31,h*.9,.5)],.07);
  for(const x of [-1,1])column(g,mat.ivory,x*(w/2-.22),.43,h,0,.12);
 }
 for(const yy of [y,y+h-.25]){
  box(p,mat.ivory,0,yy,0,w+.55,.23,w+.55);box(p,mat.wall,0,yy+.2,0,w+.28,.18,w+.28);
 }
}
export function tower(root:T.Group,x:number,z:number,small=false){
 const p=new T.Group();p.position.set(x,0,z);root.add(p);const w=small?3.55:6.1;
 if(small){towerSection(p,w,9,6);towerSection(p,w*.84,15.25,5.6);}else{towerSection(p,w,10.8,8,true);towerSection(p,w*.85,19.1,7);towerSection(p,w*.66,26.4,5.1);}
 const base=small?21.2:32,rad=small?1.7:2.45,dh=small?3.7:4.8;
 mesh(new T.CylinderGeometry(rad*.9,rad*1.08,.45,8),mat.ivory,p,0,base,0);
 const profile=[new T.Vector2(0,0),new T.Vector2(rad*.94,0),new T.Vector2(rad,dh*.12),new T.Vector2(rad*.95,dh*.34),new T.Vector2(rad*.77,dh*.63),new T.Vector2(rad*.4,dh*.88),new T.Vector2(.15,dh),new T.Vector2(0,dh)];
 mesh(new T.LatheGeometry(profile,48),mat.dome,p,0,base+.2,0);
 // Curving meridian ribs follow the dome profile rather than forming a cone.
 for(let i=0;i<12;i++){const a=i*Math.PI/6;const points=profile.slice(1,-1).map(v=>new T.Vector3(Math.cos(a)*v.x,base+.2+v.y,Math.sin(a)*v.x));const c=new T.CatmullRomCurve3(points);mesh(new T.TubeGeometry(c,28,.035,6,false),mat.bronze,p);}
 mesh(new T.CylinderGeometry(.11,.2,.65,12),mat.ivory,p,0,base+dh+.45,0);cross(p,mat.ivory,0,base+dh+1.1,0,small?.65:1);
 for(const sx of [-1,1])for(const sz of [-1,1]){column(p,mat.ivory,sx*w*.48,sz*w*.48,1.6,base-1.5,.12);mesh(new T.SphereGeometry(.16,10,8),mat.ivory,p,sx*w*.48,base+.2,sz*w*.48);}
}
