import * as T from 'three';
import {mat} from '../materials/palette';
import {box,rod} from '../utils/geometry';
import {Collision} from '../controls/Collision';
export type StairSpec={x:number,z:number,width:number,rotation:number,rise:number,run:number,steps:number};
export function staircase(root:T.Group,col:Collision,x:number,z:number,width:number,rotation=0){
 const spec:StairSpec={x,z,width,rotation,rise:1.35,run:4,steps:8};col.stairs.push(spec);const p=new T.Group();p.position.set(x,0,z);p.rotation.y=rotation;root.add(p);
 for(let i=0;i<8;i++){const h=1.35-i*1.35/8;box(p,mat.stone,0,h/2,(i+.5)*.5,width,h,.5);box(p,mat.ivory,0,h+.015,(i+.5)*.5,width+.08,.045,.52);box(p,mat.archLight,0,h+.045,(i+1)*.5-.03,width,.018,.025);for(const side of [-1,1])box(p,mat.stone,side*(width/2+.16),h/2+.15,(i+.5)*.5,.32,h+.3,.5);}
 for(const side of [-1,1]){
  rod(p,mat.bronze,new T.Vector3(side*(width/2+.16),2.35,.1),new T.Vector3(side*(width/2+.16),1.15,3.9),.04);
  for(let i=0;i<5;i++){const zz=i*.9+.15,h=1.35-Math.floor(zz/.5)*1.35/8;rod(p,mat.bronze,new T.Vector3(side*(width/2+.16),h+.2,zz),new T.Vector3(side*(width/2+.16),2.35-zz*.3,zz),.025);}
 }
 return spec;
}
