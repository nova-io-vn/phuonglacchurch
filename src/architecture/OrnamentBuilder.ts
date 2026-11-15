import * as T from 'three';
import {mat} from '../materials/palette';
import {arch,box,column,cross,curve,mesh,ring,rod} from '../utils/geometry';
const gold=new T.MeshStandardMaterial({color:'#b59a56',metalness:.72,roughness:.3});
const darkMarble=new T.MeshStandardMaterial({color:'#31534a',metalness:.08,roughness:.32});
const crystal=new T.MeshPhysicalMaterial({color:'#f1e4bd',metalness:.12,roughness:.16,clearcoat:1,transparent:true,opacity:.78});
export function ornaments(root:T.Group){
 // Carved surrounds and finials on every lower bay; intentionally real relief geometry.
 for(const side of [-1,1])for(const z of [-33,-15,-9,-3,3,9,15]){
  const g=new T.Group();g.position.set(side*11.8,.6,z);g.rotation.y=side*Math.PI/2;root.add(g);
  curve(g,mat.ivory,[new T.Vector3(-2.6,8.1,.2),new T.Vector3(0,9.25,.2),new T.Vector3(2.6,8.1,.2)],.065);
  for(const a of [-1,1]){column(g,mat.ivory,a*2.6,.24,1.1,8,.07);cross(g,mat.ivory,a*2.6,9.4,.24,.18);}
  for(let j=0;j<7;j++){const x=(j-3)*.62;mesh(new T.SphereGeometry(.085,8,6),gold,g,x,9.3,.25);}
 }
 for(const z of [-34,-28,-22,-16,-10,-4,2,8])for(const side of [-1,1]){
  for(const sign of [-1,1])rod(root,gold,new T.Vector3(side*5.2+sign*.24,1,z+.27),new T.Vector3(side*5.2+sign*.24,10.9,z+.27),.018);
  mesh(new T.TorusGeometry(.48,.045,8,32),gold,root,side*5.2,10.9,z).rotation.x=Math.PI/2;
 }
 // Marble carpet with brass borders and radial stone inlays along the central nave.
 box(root,darkMarble,0,.621,-8,3.4,.018,47);for(const x of [-1.75,1.75])box(root,gold,x,.638,-8,.055,.025,47);
 for(const z of [-27,-19,-11,-3,5,11]){
  const ringFloor=mesh(new T.RingGeometry(.78,.84,48),gold,root,0,.65,z);ringFloor.rotation.x=-Math.PI/2;
  for(let i=0;i<8;i++){const a=i*Math.PI/4,s=new T.Shape();s.moveTo(0,0);s.lineTo(.18,.38);s.lineTo(0,.74);s.lineTo(-.18,.38);s.closePath();const o=mesh(new T.ShapeGeometry(s),mat.ivory,root,0,.652,z);o.rotation.set(-Math.PI/2,0,a);}
 }
 // Reredos: gilded Gothic altar screen framing the cross, with deep side niches.
 for(const x of [-4,-2.3,2.3,4]){
  column(root,mat.ivory,x,-35.1,9.5,1.15,.13);column(root,gold,x+.14,-34.94,9.2,1.3,.035);
  const p=new T.Group();p.position.set(x,10.65,-35.05);root.add(p);mesh(new T.ConeGeometry(.28,1.6,8),gold,p,0,.8,0);cross(p,gold,0,1.85,0,.22);
 }
 const screen=new T.Group();screen.position.set(0,3.35,-35.1);root.add(screen);ring(screen,gold,3.45,7.2,.12,0);ring(screen,mat.ivory,3.8,7.5,.12,-.08);
 for(const x of [-3.1,3.1]){const n=new T.Group();n.position.set(x,3.4,-35.1);root.add(n);mesh(new T.ShapeGeometry(arch(1.15,4.7)),darkMarble,n,0,0,-.08);ring(n,gold,1.15,4.7,.09,.02);cross(n,gold,0,2.25,.15,.7);}
 for(const y of [1.24,2.7,10.6])box(root,gold,0,y,-35.05,8.6,.08,.28);
 for(const z of [-24,-10,4,13])for(const [r,y,n] of [[1.05,12.8,12],[.7,13.7,8],[.35,14.45,6]]){
  const ringC=mesh(new T.TorusGeometry(r,.045,8,48),gold,root,0,y,z);ringC.rotation.x=Math.PI/2;
  for(let j=0;j<n;j++){const a=j*Math.PI*2/n,x=Math.cos(a)*r,zz=z+Math.sin(a)*r;rod(root,gold,new T.Vector3(x,y,zz),new T.Vector3(x,y-.45,zz),.015);const c=mesh(new T.OctahedronGeometry(.13),crystal,root,x,y-.58,zz);c.scale.y=1.9;}
 }
 // Recessed coffering on aisle soffits, with gold bosses at the ridge.
 for(const z of [-34,-28,-22,-16,-10,-4,2,8]){const o=mesh(new T.SphereGeometry(.17,12,8),gold,root,0,19.05,z);o.scale.y=.6;}
}
