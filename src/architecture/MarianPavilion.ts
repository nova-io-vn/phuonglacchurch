import * as T from 'three';
import type {Font} from 'three/addons/loaders/FontLoader.js';
import {mat} from '../materials/palette';
import {box,column,cross,curve,mesh} from '../utils/geometry';
import {agedStone,carvedStone,gateGold,lettering,stoneRail} from './Stonework';
import {SHRINE,VINCENT,PLAZA_COLUMNS} from './ShrineLayout';
const coral=new T.MeshStandardMaterial({color:'#c78e70',roughness:.9,normalMap:mat.wall.normalMap});
const lacquer=new T.MeshStandardMaterial({color:'#794231',roughness:.62});
/** Curved hip surfaces with raised corners, real soffit and swept eave profiles. */
function pagodaRoof(root:T.Group,half:number,y:number,rise:number){
 const point=(t:number,v:number)=>{const r=.22+(half-.22)*v;return new T.Vector3(t*r,y+rise*(1-v)**1.7+.18*v**8+.65*Math.abs(t)**6*v**5,r);};
 for(let side=0;side<4;side++){
  const g=new T.Group();g.rotation.y=side*Math.PI/2;root.add(g);const p:number[]=[],uv:number[]=[],idx:number[]=[];const n=24,m=18;
  for(let j=0;j<=m;j++)for(let i=0;i<=n;i++){const q=point(-1+2*i/n,j/m);p.push(q.x,q.y,q.z);uv.push(i/n,j/m);}
  for(let j=0;j<m;j++)for(let i=0;i<n;i++){const a=j*(n+1)+i;idx.push(a,a+n+1,a+1,a+1,a+n+1,a+n+2);}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(p,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();mesh(geo,mat.red,g);
  const soffit=geo.clone().translate(0,-.13,0);const underside=mesh(soffit,lacquer,g);underside.material=new T.MeshStandardMaterial({color:'#573e2b',roughness:.9,side:T.DoubleSide});
  const edge=Array.from({length:33},(_,i)=>point(-1+i/16,1));curve(g,gateGold,edge,.09);curve(g,carvedStone,edge.map(p=>p.clone().add(new T.Vector3(0,-.16,0))),.065);
  curve(g,gateGold,Array.from({length:25},(_,i)=>point(1,i/24)),.07);
  for(let i=0;i<25;i++){const t=-.96+i*.08,a=point(t,.92),b=point(t,1);curve(g,mat.red,[a,b,b.clone().add(new T.Vector3(0,.1,.1))],.075);}
  const corner=point(1,1);curve(g,gateGold,[corner,corner.clone().add(new T.Vector3(.15,.38,.15)),corner.clone().add(new T.Vector3(.05,.65,.1)),corner.clone().add(new T.Vector3(-.18,.57,-.04))],.065);
 }
}
function rail(root:T.Group,x:number,z:number,length:number,rotation=0){const g=new T.Group();g.position.set(x,.8,z);g.rotation.y=rotation;g.scale.y=.72;root.add(g);stoneRail(g,length);}
export function marianPavilion(root:T.Group,font:Font){
 const g=new T.Group();g.name='Đài Đức Mẹ — đình hai tầng mái cong';g.position.set(SHRINE.x,0,SHRINE.z);g.rotation.y=SHRINE.rotation;root.add(g);
 for(let i=0;i<4;i++)box(g,i===3?carvedStone:agedStone,0,.12+i*.19,0,15-i*.32,.24,13-i*.32);
 for(const x of [-3.7,3.7])for(const z of [-2.8,2.8]){
  column(g,coral,x,z,6.1,.8,.28);for(const y of [1.15,6.55])box(g,gateGold,x,y,z,.95,.16,.95);
  for(const dx of [-.34,.34])box(g,carvedStone,x+dx,3.85,z+.24,.035,4.8,.045);
 }
 for(const z of [-2.8,2.8]){box(g,lacquer,0,6.63,z,8.1,.32,.52);curve(g,carvedStone,[new T.Vector3(-3.3,6.4,z+.29),new T.Vector3(-2.1,5.9,z+.29),new T.Vector3(0,6.3,z+.29),new T.Vector3(2.1,5.9,z+.29),new T.Vector3(3.3,6.4,z+.29)],.12);}
 for(const x of [-3.7,3.7])box(g,lacquer,x,6.63,0,.52,.32,6.5);
 pagodaRoof(g,5.8,6.85,2.1);
 // Open upper lantern with fretwork below the second, smaller curved roof.
 box(g,lacquer,0,8.67,0,3.55,1.65,3.55);
 for(const x of [-1.8,1.8])for(const z of [-1.8,1.8])column(g,coral,x,z,2.35,7.7,.13);
 for(let side=0;side<4;side++){const b=new T.Group();b.rotation.y=side*Math.PI/2;g.add(b);box(b,lacquer,0,9.05,1.85,3.7,.6,.12);for(let i=0;i<9;i++){const d=box(b,gateGold,-1.55+i*.39,9.04,1.94,.17,.25,.055);d.rotation.z=Math.PI/4;}}
 pagodaRoof(g,3.9,10.05,2.15);cross(g,gateGold,0,12.7,0,.48);
 // Low devotional plinth rather than the three tall columns of the superseded version.
 box(g,lacquer,0,1.45,0,2.5,1.35,2);box(g,gateGold,0,2.16,0,2.7,.12,2.2);lettering(g,font,'ĐỨC MẸ',.29,0,1.35,1.04);
 box(g,lacquer,0,1.2,2.2,2.2,.78,1.1);box(g,carvedStone,0,1.63,2.2,2.45,.13,1.3);
 for(const x of [-1.7,1.7]){column(g,carvedStone,x,2.05,.9,.8,.1);mesh(new T.SphereGeometry(.16,12,8),mat.glow,g,x,1.85,2.05);}
 // Stone island balustrade; opening faces the bridge and the church.
 rail(g,0,-6,14.2);rail(g,-7,0,12,Math.PI/2);rail(g,7,0,12,Math.PI/2);rail(g,-4.6,6,4.8);rail(g,4.6,6,4.8);
 const bridge=SHRINE.bridge;box(root,agedStone,bridge.x,.31,bridge.z,bridge.width,.62,bridge.length);box(root,carvedStone,bridge.x,.65,bridge.z,bridge.width,.1,bridge.length);
 for(const x of [-2.05,2.05]){const r=new T.Group();r.position.set(x,.7,bridge.z);r.rotation.y=Math.PI/2;r.scale.y=.72;root.add(r);stoneRail(r,bridge.length);}
 for(let i=0;i<3;i++)box(root,carvedStone,0,.65+i*.06,89.1+i*.32,3.8,.12,.65);
 // A clear axis from the existing forecourt to the opening in the front fence.
 box(root,mat.stone,0,.07,56,4,.06,22);
 for(const p of PLAZA_COLUMNS){column(root,agedStone,p.x,p.z,8.2,.12,.48);for(let j=0;j<12;j++){const a=j*Math.PI/6;mesh(new T.CylinderGeometry(.035,.035,7.25,7),carvedStone,root,p.x+Math.cos(a)*.48,4.05,p.z+Math.sin(a)*.48);}for(const y of [.8,7.98]){const band=mesh(new T.TorusGeometry(.64,.06,8,48),gateGold,root,p.x,y,p.z);band.rotation.x=Math.PI/2;}}
}
export function vincentBase(root:T.Group,font:Font){
 const g=new T.Group();g.position.set(VINCENT.x,0,VINCENT.z);g.rotation.y=VINCENT.rotation;root.add(g);
 for(let i=0;i<4;i++)box(g,agedStone,0,.14+i*.16,0,11.8-i*.28,.28,8.8-i*.28);
 box(g,carvedStone,0,.82,0,10.6,.14,7.6);box(g,agedStone,0,1.8,0,3.4,1.8,2.5);box(g,carvedStone,0,2.77,0,3.8,.2,2.9);
 lettering(g,font,'THÁNH VINH SƠN',.26,0,1.9,1.3);lettering(g,font,'PHAOLÔ',.29,0,1.4,1.3);
 rail(g,0,-4.1,11.5);rail(g,-5.6,0,8.2,Math.PI/2);rail(g,5.6,0,8.2,Math.PI/2);rail(g,-3.6,4.1,3.9);rail(g,3.6,4.1,3.9);
 const bridge=VINCENT.bridge;box(root,agedStone,bridge.x,.31,bridge.z,bridge.length,.62,bridge.width);box(root,carvedStone,bridge.x,.66,bridge.z,bridge.length,.12,bridge.width);
 for(const z of [bridge.z-1.55,bridge.z+1.55]){const r=new T.Group();r.position.set(bridge.x,.72,z);r.scale.y=.72;root.add(r);stoneRail(r,bridge.length);}
 // Shore railing follows the entire pond, with one intentional opening at the approach bridge.
 const p=VINCENT.pond,l=p.x-p.rx-.35,r=p.x+p.rx+.35,back=p.z-p.rz-.35,front=p.z+p.rz+.35;
 for(const [x,z,length,rotation] of [[r,p.z,front-back,Math.PI/2],[p.x,back,r-l,0],[p.x,front,r-l,0],[l,(back+p.z-2)/2,p.z-2-back,Math.PI/2],[l,(front+p.z+2)/2,front-p.z-2,Math.PI/2]]){const rail=new T.Group();rail.position.set(x,.08,z);rail.rotation.y=rotation;rail.scale.y=.8;root.add(rail);stoneRail(rail,length);}
}
