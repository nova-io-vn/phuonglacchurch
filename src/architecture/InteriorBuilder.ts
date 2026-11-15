import * as T from 'three';
import {mat} from '../materials/palette';
import {box,column,cross,curve,mesh,rod} from '../utils/geometry';
import {Collision} from '../controls/Collision';
import {PEW_BLOCKS,PEW_ROWS} from './config';
import {pew} from './PewBuilder';
import {choirAndPrayer} from './ChoirBuilder';
function vaultArc(x:number,z:number){return [new T.Vector3(-x,11.2,z),new T.Vector3(-x*.9,14,z),new T.Vector3(-x*.5,17.5,z),new T.Vector3(0,19.15,z),new T.Vector3(x*.5,17.5,z),new T.Vector3(x*.9,14,z),new T.Vector3(x,11.2,z)];}
export function interior(root:T.Group,col:Collision){
 // A curved interior web, independent of the exterior sloped weather roof.
 const pts=vaultArc(5.2,0),path=new T.CatmullRomCurve3(pts);const pos:number[]=[],uv:number[]=[],idx:number[]=[];
 for(let z=0;z<2;z++)for(let i=0;i<=48;i++){const p=path.getPoint(i/48);pos.push(p.x,p.y,z===0?-35.8:12);uv.push(i/48,z);}
 for(let i=0;i<48;i++){idx.push(i,i+1,49+i,i+1,50+i,49+i);}
 const web=new T.BufferGeometry();web.setAttribute('position',new T.Float32BufferAttribute(pos,3));web.setAttribute('uv',new T.Float32BufferAttribute(uv,2));web.setIndex(idx);web.computeVertexNormals();const vaultMat=mat.ivory.clone();vaultMat.side=T.DoubleSide;mesh(web,vaultMat,root);
 for(const side of [-1,1]){
  const aislePath=new T.CatmullRomCurve3([new T.Vector3(side*5.2,11.3,0),new T.Vector3(side*7.6,11.5,0),new T.Vector3(side*10.7,8.8,0)]);
  for(const [start,end] of [[-35.8,-30.1],[-17.9,11.9]]){
   const ap:number[]=[],au:number[]=[],ai:number[]=[];
   for(let z=0;z<2;z++)for(let i=0;i<=24;i++){const p=aislePath.getPoint(i/24);ap.push(p.x,p.y,z===0?start:end);au.push(i/24,z);}
   for(let i=0;i<24;i++)ai.push(i,i+1,25+i,i+1,26+i,25+i);
   const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(ap,3));g.setAttribute('uv',new T.Float32BufferAttribute(au,2));g.setIndex(ai);g.computeVertexNormals();mesh(g,vaultMat,root);
  }
 }
 for(const z of [-34,-28,-22,-16,-10,-4,2,8,14]){
  for(const x of [-5.2,5.2]){column(root,mat.ivory,x,z,z===14?7.4:10.7,.6,.36);col.add(x,z,1,1,'nave column');}
  curve(root,mat.stone,z===14?[new T.Vector3(-5.2,8,z),new T.Vector3(-3,9.8,z),new T.Vector3(0,10.4,z),new T.Vector3(3,9.8,z),new T.Vector3(5.2,8,z)]:vaultArc(5.2,z),.095);
  if(z<12){
   for(const sign of [-1,1])curve(root,mat.ivory,[new T.Vector3(sign*5.2,11.3,z),new T.Vector3(sign*3.5,16.5,z+1.5),new T.Vector3(0,19.15,z+3),new T.Vector3(-sign*3.5,16.5,z+4.5),new T.Vector3(-sign*5.2,11.3,z+6)],.075);
  }
  if(z!==-28&&z!==-22)for(const side of [-1,1])curve(root,mat.ivory,[new T.Vector3(side*5.2,z===14?8:11.3,z),new T.Vector3(side*7.6,z===14?10:11.5,z),new T.Vector3(side*10.6,z===14?9.5:8.8,z)],.09);
 }
 rod(root,mat.stone,new T.Vector3(0,19.15,-36),new T.Vector3(0,19.15,14),.085);
 // Four longitudinal blocks, ten benches each. Transept stays clear for cross circulation.
 for(let block=0;block<PEW_BLOCKS.length;block++)for(let row=0;row<PEW_ROWS;row++){
  const x=PEW_BLOCKS[block],z=11-row*1.85,g=new T.Group();g.position.set(x,0,z);root.add(g);pew(g);col.add(x,z,2.65,1.28,`pew:congregation:${block}:${row}`);
 }
 choirAndPrayer(root,col);
 // Inlaid stone strips and central aisle medallions.
 for(const x of [-5.7,-1.55,1.55,5.7])box(root,mat.stone,x,.613,-9,.08,.015,52);
 for(let z=-28;z<16;z+=4){const o=box(root,mat.stone,0,.62,z,.75,.02,.75);o.rotation.y=Math.PI/4;}
 for(let i=0;i<3;i++)box(root,mat.ivory,0,.69+i*.18,-32.6-i*.35,11-i*.5,.18,7.2-i*.7);
 box(root,mat.ivory,0,1.85,-32.3,3.5,1.42,1.3);box(root,mat.stone,0,2.63,-32.3,4,.18,1.65);cross(root,mat.bronze,0,2.08,-31.62,.5);col.add(0,-32.3,4,1.7,'altar');
 cross(root,mat.wood,0,7.6,-35.55,2.3);cross(root,mat.bronze,0,7.6,-35.42,1.95);
 for(const x of [-1.5,1.5]){rod(root,mat.bronze,new T.Vector3(x,2.7,-32.3),new T.Vector3(x,3.4,-32.3),.06);box(root,mat.glow,x,3.6,-32.3,.12,.4,.12);}
 // Lectern and celebrant chair.
 box(root,mat.wood,-4,1.85,-30.5,.75,1.4,.7);const top=box(root,mat.wood,-4,2.6,-30.5,1,.12,.8);top.rotation.x=.2;col.add(-4,-30.5,1,1,'lectern');
 box(root,mat.wood,2.8,1.65,-34,.9,.16,.8);box(root,mat.wood,2.8,2.2,-34.4,1,1.7,.15);for(const x of [2.45,3.15])box(root,mat.wood,x,1.4,-34,.12,.7,.65);col.add(2.8,-34,1,1.1,'chair');
 // Shallow side prayer altars, with no fictitious inaccessible doorways.
 for(const side of [-1,1]){box(root,mat.ivory,side*8,1.3,-33,2.3,1.4,1.1);cross(root,mat.bronze,side*8,3.7,-33.4,.8);col.add(side*8,-33,2.4,1.2,'side altar');}
 // Choir now occupies the real left transept, rather than the former vestibule balcony.
 for(const z of [-24,-10,4,13]){
  rod(root,mat.bronze,new T.Vector3(0,18.7,z),new T.Vector3(0,13.3,z),.035);
  const o=mesh(new T.TorusGeometry(1.2,.055,8,48),mat.bronze,root,0,13.3,z);o.rotation.x=Math.PI/2;
  for(let i=0;i<8;i++){const a=i*Math.PI/4,x=Math.cos(a)*1.2,zz=z+Math.sin(a)*1.2;rod(root,mat.bronze,new T.Vector3(0,14.4,z),new T.Vector3(x,13.3,zz),.025);box(root,mat.glow,x,13.55,zz,.1,.5,.1);}
 }
}
