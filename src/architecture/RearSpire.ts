import * as T from 'three';
import {mat} from '../materials/palette';
import {box,column,cross,curve,mesh,panel,ring} from '../utils/geometry';
const slate=new T.MeshStandardMaterial({color:'#9c976e',metalness:.18,roughness:.72});
export const REAR_SPIRE={x:0,z:-35.15,base:21.3,top:31.2};
export function rearSpire(root:T.Group){
 const g=new T.Group();g.position.set(0,21.3,-35.15);g.scale.set(.88,.9,.88);root.add(g);
 for(const [y,w,h] of [[0,4.8,.28],[.3,4.5,.16],[3.5,4.7,.3],[3.85,4.4,.16]])box(g,mat.ivory,0,y,0,w,h,w);
 for(let side=0;side<4;side++){
  const p=new T.Group();p.position.set(Math.sin(side*Math.PI/2)*1.9,.45,Math.cos(side*Math.PI/2)*1.9);p.rotation.y=side*Math.PI/2;g.add(p);
  panel(p,mat.wall,3.8,3.1,.3,[{x:0,y:.35,w:1.45,h:2.25}]);ring(p,mat.ivory,1.45,2.25,.12,.35).position.y=.35;
  for(const x of [-1.65,1.65])column(p,mat.ivory,x,.4,3.1,0,.09);
  for(let i=0;i<8;i++)box(p,slate,0,.55+i*.19,.05,1.2,.07,.08);
 }
 const profile=[[2.12,3.95],[1.85,4.7],[1.35,6.5],[.6,8.5],[.08,9.8]],pos:number[]=[],uv:number[]=[],indices:number[]=[];
 for(let row=0;row<profile.length;row++)for(let j=0;j<8;j++){const a=j*Math.PI/4+Math.PI/8;pos.push(Math.cos(a)*profile[row][0],profile[row][1],Math.sin(a)*profile[row][0]);uv.push(j/8,row/(profile.length-1));}
 for(let r=0;r<profile.length-1;r++)for(let j=0;j<8;j++){const a=r*8+j,b=r*8+(j+1)%8,c=(r+1)*8+j,d=(r+1)*8+(j+1)%8;indices.push(a,b,c,b,d,c);}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();mesh(geo,slate,g);
 for(let j=0;j<8;j++){
  const a=j*Math.PI/4+Math.PI/8;curve(g,mat.bronze,profile.map(([r,y])=>new T.Vector3(Math.cos(a)*r,y,Math.sin(a)*r)),.035);
  for(const [r,y] of [[1.6,5.2],[1.2,6.7],[.65,8.3]]){const fin=mesh(new T.OctahedronGeometry(.085),mat.ivory,g,Math.cos(a)*r,y,Math.sin(a)*r);fin.scale.y=1.6;}
 }
 cross(g,mat.bronze,0,10.45,0,.56);
 for(const x of [-2.1,2.1])for(const z of [-2.1,2.1]){column(g,mat.ivory,x,z,1.6,3.5,.09);cross(g,mat.bronze,x,5.35,z,.2);}
}
