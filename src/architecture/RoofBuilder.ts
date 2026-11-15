import * as T from 'three';
import {mat} from '../materials/palette';
import {box,mesh} from '../utils/geometry';
export function roof(p:T.Object3D,width:number,length:number,eave:number,ridge:number,z:number){
 const rise=ridge-eave, slope=Math.hypot(width/2,rise),angle=Math.atan2(rise,width/2);
 for(const side of [-1,1]){
  const o=box(p,mat.red,side*width/4,(eave+ridge)/2,z,slope,.23,length);o.rotation.z=-side*angle;
  box(p,mat.ivory,side*width/2,eave-.12,z,.25,.35,length+.35);
 }
 const count=Math.ceil(length/.43);const tiles=new T.InstancedMesh(new T.CylinderGeometry(.15,.15,.46,8,1,false,0,Math.PI),mat.red,count);
 const dummy=new T.Object3D();for(let i=0;i<count;i++){dummy.position.set(0,ridge+.12,z-length/2+i*.43);dummy.rotation.x=Math.PI/2;dummy.updateMatrix();tiles.setMatrixAt(i,dummy.matrix);}tiles.castShadow=true;p.add(tiles);
 // Raised seams enrich the silhouette without thousands of individual tiles.
 for(const side of [-1,1])for(let i=0;i<=Math.floor(length/2);i++){
  const strip=box(p,mat.red,side*width/4,(eave+ridge)/2+.14,z-length/2+i*2,slope,.055,.065);strip.rotation.z=-side*angle;
 }
}
export function gable(p:T.Object3D,w:number,base:number,peak:number,z:number){const s=new T.Shape();s.moveTo(-w/2,base);s.lineTo(w/2,base);s.lineTo(0,peak);s.closePath();return mesh(new T.ExtrudeGeometry(s,{depth:.5,bevelEnabled:false}),mat.wall,p,0,0,z);}
/** Solid roof patches with actual valley cuts; the two gables meet at a common ridge height. */
export function roofPatch(root:T.Group,points:[number,number][],height:(x:number,z:number)=>number){
 const pos:number[]=[],uv:number[]=[],indices:number[]=[];const n=points.length;
 for(const dy of [0,-.16])for(const [x,z] of points){pos.push(x,height(x,z)+dy,z);uv.push(x/8,z/8);}
 const triangles=T.ShapeUtils.triangulateShape(points.map(p=>new T.Vector2(...p)),[]);
 for(const t of triangles){indices.push(...t,t[0]+n,t[2]+n,t[1]+n);}for(let i=0;i<n;i++){const j=(i+1)%n;indices.push(i,j,i+n,j,j+n,i+n);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();mesh(g,mat.red,root);
}
export function basilicaRoof(root:T.Group){
 const w=6.6,center=-24,peak=22.5,slope=3.8/w;
 for(const side of [-1,1]){
  const main=(x:number)=>peak-Math.abs(x)*slope;
  roofPatch(root,[[0,-36.7],[side*w,-36.7],[side*w,center-w],[0,center]],main);
  roofPatch(root,[[0,center],[side*w,center+w],[side*w,12.2],[0,12.2]],main);
  for(const sign of [-1,1])roofPatch(root,[[0,center],[side*w,center+sign*w],[side*19.3,center+sign*w],[side*19.3,center]],(_x,z)=>peak-Math.abs(z-center)*slope);
  for(const [a,b] of [[-36.6,-30.6],[-17.4,12.2]]){
   roofPatch(root,[[side*6, a],[side*11.9,a],[side*11.9,b],[side*6,b]],x=>13.3-(Math.abs(x)-6)*.64);
   box(root,mat.ivory,side*11.9,9.4,(a+b)/2,.28,.28,b-a);
  }
  for(const z of [-30.6,-17.4])box(root,mat.ivory,side*13,18.6,z,12.6,.25,.25);
  for(const [a,b] of [[-36.7,-30.6],[-17.4,12.2]])box(root,mat.ivory,side*6.6,18.65,(a+b)/2,.23,.25,b-a);
 }
 // Ridge capping and individual raised tile courses along all ridges.
 const caps:{x:number,z:number,rotate:boolean}[]=[];
 for(let z=-36.5;z<12.3;z+=.42)caps.push({x:0,z,rotate:false});for(let x=-19.2;x<19.3;x+=.42)caps.push({x,z:center,rotate:true});
 const inst=new T.InstancedMesh(new T.CylinderGeometry(.15,.15,.44,8,1,false,0,Math.PI),mat.red,caps.length);const o=new T.Object3D();caps.forEach((p,i)=>{o.position.set(p.x,peak+.08,p.z);o.rotation.set(p.rotate?0:Math.PI/2,0,p.rotate?Math.PI/2:0);o.updateMatrix();inst.setMatrixAt(i,o.matrix);});inst.castShadow=true;root.add(inst);
}
