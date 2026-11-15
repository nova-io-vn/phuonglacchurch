import * as T from 'three';
import {mat} from '../materials/palette';
import {box,mesh,rod} from '../utils/geometry';
import {Collision} from '../controls/Collision';
export const LAMPS:{x:number,z:number}[]=[];
export function garden(root:T.Group,col:Collision){
 LAMPS.length=0;
 for(const side of [-1,1]){
  for(const z of [-28,-2,22,45]){
   const x=side>0&&z===45?34:side*23;LAMPS.push({x,z});box(root,mat.stone,x,.18,z,.55,.36,.55);rod(root,mat.dark,new T.Vector3(x,.3,z),new T.Vector3(x,3.8,z),.055);box(root,mat.glow,x,3.8,z,.3,.48,.3);box(root,mat.dark,x,4.08,z,.48,.12,.48);box(root,mat.dark,x,3.5,z,.4,.1,.4);col.add(x,z,.5,.5,'lamp');
  }
  for(const z of [4,24]){const x=side*24;box(root,mat.stone,x,.4,z,2.7,.55,.8);box(root,mat.ivory,x,.74,z,3,.13,.9);col.add(x,z,3.1,1,'stone bench');}
  for(let i=0;i<25;i++){const z=-7+i*1.1;const bush=mesh(new T.SphereGeometry(.45,10,8),mat.leaf,root,side*26,.53,z);bush.scale.set(.85,.85,1.2);for(let j=0;j<2;j++)mesh(new T.SphereGeometry(.07,6,4),mat.flower,root,side*25.6,.62,z+j*.27);}
 }
}
