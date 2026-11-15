import * as T from 'three';
import {mat} from '../materials/palette';
import {box,column,cross,curve,panel,ring} from '../utils/geometry';
import {windows} from './GothicWindow';
import {gable} from './RoofBuilder';
import {Collision} from '../controls/Collision';
/** Real connected cross arms. Left is -X when looking from the west entrance toward the altar. */
export function transept(root:T.Group,col:Collision){
 for(const side of [-1,1]){
  box(root,mat.stone,side*14.8,.22,-24,8.2,.44,12.6);box(root,mat.floor,side*14.7,.53,-24,7.8,.14,11.9);
  const end=new T.Group();end.position.set(side*18.5,.6,-24);end.rotation.y=side*Math.PI/2;root.add(end);
  const holes=[];for(const x of [-3.8,0,3.8])holes.push({x,y:x===0?0:1.1,w:2.2,h:x===0?5.5:4.4});for(const x of [-2.5,0,2.5])holes.push({x,y:11,w:1.35,h:5.25});
  panel(end,mat.wall,12,18.1,.65,holes);
  for(const a of holes){if(a.y===0)continue;const w=windows.create(a.w,a.h);w.position.set(a.x,a.y,.27);end.add(w);}
  const rose=windows.rose(1.05);rose.position.set(0,8,.69);end.add(rose);
  gable(end,12.6,18.1,21.9,-.05);for(const s of [-1,1])curve(end,mat.ivory,[new T.Vector3(s*6.3,18.15,.65),new T.Vector3(s*3.15,20.1,.65),new T.Vector3(0,21.9,.65)],.12);
  cross(end,mat.ivory,0,22.65,.4,.7);
  for(const x of [-5.85,-1.8,1.8,5.85])column(end,mat.ivory,x,.8,17.8,0,.13);
  for(const y of [6.4,9.2,18.05])box(end,mat.ivory,0,y,.72,12.7,.21,.38);
  // Empty upper niche as in the provided perspective; no placeholder human sculpture.
  const n=new T.Group();n.position.set(0,18.9,.63);end.add(n);ring(n,mat.ivory,1,1.8,.12,0);
  col.add(side*18.8,-24,.85,12.7,'transept end');
  for(const z of [-30,-18]){
   // Close the high shoulder between the raised nave and the projecting arm.
   // Below this shoulder the side aisle remains genuinely open to the transept.
   const shoulder=new T.Group();shoulder.position.set(side*8.5,9.4,z);if(z===-30)shoulder.rotation.y=Math.PI;root.add(shoulder);
   panel(shoulder,mat.wall,5,9.3,.65,[{x:0,y:2.9,w:1.3,h:4.2}]);const sw=windows.create(1.3,4.2);sw.position.set(0,2.9,.3);shoulder.add(sw);box(shoulder,mat.ivory,0,9.1,.72,5.2,.2,.4);
   const wall=new T.Group();wall.position.set(side*14.75,.6,z);if(z===-30)wall.rotation.y=Math.PI;root.add(wall);
   panel(wall,mat.wall,7.5,18.1,.65,[{x:0,y:1.3,w:2.5,h:4.5},{x:-1.5,y:11,w:1.25,h:5.2},{x:1.5,y:11,w:1.25,h:5.2}]);
   for(const a of [{x:0,y:1.3,w:2.5,h:4.5},{x:-1.5,y:11,w:1.25,h:5.2},{x:1.5,y:11,w:1.25,h:5.2}]){const w=windows.create(a.w,a.h);w.position.set(a.x,a.y,.3);wall.add(w);}
   for(const y of [6.4,9.2,18])box(wall,mat.ivory,0,y,.72,7.8,.2,.4);
   for(const x of [-3.6,3.6])column(wall,mat.ivory,x,.8,18,0,.15);
   col.add(side*14.8,z,7.8,.9,'transept flank');
  }
  // Raised white aisle ceiling across the accessible arm, with pointed rib vaults.
  box(root,mat.ivory,side*12.5,17.4,-24,12,.18,11.7);
  for(const x of [side*9,side*14,side*18])curve(root,mat.ivory,[new T.Vector3(x,10.5,-29.5),new T.Vector3(x,15,-27.8),new T.Vector3(x,17.25,-24),new T.Vector3(x,15,-20.2),new T.Vector3(x,10.5,-18.5)],.1);
 }
}
