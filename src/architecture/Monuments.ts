import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {mat} from '../materials/palette';
import {box,column,cross,curve,mesh} from '../utils/geometry';
import type {Font} from 'three/addons/loaders/FontLoader.js';
import {agedStone,carvedStone,gateGold,lettering} from './Stonework';
const marble=new T.MeshStandardMaterial({color:'#eee9d7',roughness:.55,metalness:.03});
export const SHRINE={x:18,z:47,rotation:0,columns:3,sideStatues:2,onWater:false};
export const PLAZA_COLUMNS=[{x:-18,z:30},{x:18,z:30}];
export function monumentBases(root:T.Group,font:Font){
 const g=new T.Group();g.position.set(SHRINE.x,0,SHRINE.z);g.rotation.y=SHRINE.rotation;root.add(g);
 for(let i=0;i<4;i++)box(g,agedStone,0,.13+i*.17,0,21-i*.65,.26,8.5-i*.4);
 box(g,carvedStone,0,.77,0,19.1,.14,7.2);
 for(const x of [-3.6,0,3.6]){
  const h=x===0?8.2:5.8;
  column(g,agedStone,x,0,h,1.1,.48);
  for(let j=0;j<12;j++){const a=j*Math.PI/6;rodForFlute(g,x,a,h);}
  for(const y of [1.3,2.15,h+.87]){const band=mesh(new T.TorusGeometry(.64,.06,8,48),gateGold,g,x,y,0);band.rotation.x=Math.PI/2;}
  for(let j=0;j<8;j++){const a=j*Math.PI/4;curve(g,carvedStone,[new T.Vector3(x+Math.cos(a)*.45,h+.6,Math.sin(a)*.45),new T.Vector3(x+Math.cos(a)*.7,h+.85,Math.sin(a)*.7),new T.Vector3(x+Math.cos(a)*.62,h+1.05,Math.sin(a)*.62)],.07);}
  if(x!==0){cross(g,gateGold,x,h+1.65,0,.58);mesh(new T.SphereGeometry(.24,14,10),mat.glow,g,x,h+1.12,0);}
 }
 for(const x of [-7.8,7.8]){for(let i=0;i<3;i++)box(g,carvedStone,x,.94+i*.17,0,2.7-i*.27,.18,2.5-i*.2);box(g,agedStone,x,1.76,0,1.6,.9,1.5);box(g,gateGold,x,2.3,0,1.9,.12,1.8);}
 lettering(g,font,'ĐÀI ĐỨC MẸ',.31,0,.95,3.66);
 // Dry paved forecourt: the former pond and its enclosing rails are removed.
 for(const p of PLAZA_COLUMNS){
  column(root,agedStone,p.x,p.z,8.2,.12,.48);
  for(let j=0;j<12;j++){const a=j*Math.PI/6;const flute=mesh(new T.CylinderGeometry(.035,.035,7.25,7),carvedStone,root,p.x+Math.cos(a)*.48,4.05,p.z+Math.sin(a)*.48);flute.name='Fluted plaza statue column';}
  for(const y of [.8,7.98]){const band=mesh(new T.TorusGeometry(.64,.06,8,48),gateGold,root,p.x,y,p.z);band.rotation.x=Math.PI/2;}
 }
}
function rodForFlute(g:T.Group,x:number,a:number,h:number){const p=mesh(new T.CylinderGeometry(.035,.035,h-.9,7),carvedStone,g,x+Math.cos(a)*.48,1.35+(h-.9)/2,Math.sin(a)*.48);return p;}
export async function loadFigures(root:T.Group){
 const loader=new GLTFLoader();const [mary,low,person]=await Promise.all([loader.loadAsync('/models/mary.glb'),loader.loadAsync('/models/mary-low.glb'),loader.loadAsync('/models/human.glb')]);
 function canonical(g:T.Object3D){g.rotation.x=-Math.PI/2;g.updateMatrixWorld(true);const b=new T.Box3().setFromObject(g),h=b.max.y-b.min.y;g.scale.multiplyScalar(1/h);g.position.set(-(b.min.x+b.max.x)/2/h,-b.min.y/h,-(b.min.z+b.max.z)/2/h);g.traverse(o=>{if(o instanceof T.Mesh){o.material=marble;o.castShadow=true;o.receiveShadow=true;}});const p=new T.Group();p.add(g);return p;}
 const high=canonical(mary.scene),small=canonical(low.scene);const statues:T.Object3D[]=[];
 for(const a of [{x:SHRINE.x,y:9.45,z:SHRINE.z,h:3.2,r:0},{x:SHRINE.x-7.8,y:2.38,z:SHRINE.z,h:2.35,r:0},{x:SHRINE.x+7.8,y:2.38,z:SHRINE.z,h:2.35,r:0},...PLAZA_COLUMNS.map(p=>({...p,y:8.4,h:2.5,r:0})),{x:0,y:8.2,z:19.07,h:2.1,r:0},{x:0,y:12.65,z:19.15,h:4.2,r:0}]){
  const lod=new T.LOD();lod.addLevel(high.clone(true),0);lod.addLevel(small.clone(true),28);lod.position.set(a.x,a.y,a.z);lod.scale.setScalar(a.h);lod.rotation.y=a.r;lod.name='Đức Mẹ và Hài Nhi — SMK KAS225, CC0';root.add(lod);statues.push(lod);
 }
 const humans=new T.Group();root.add(humans);
 for(const p of [{x:3.6,z:25,y:.08},{x:-4.8,z:27,y:.08},{x:6.15,z:7,y:1.35}]){
  const human=clone(person.scene);human.updateMatrixWorld(true);
  for(const side of ['l','r']){
   const arm=human.getObjectByName(`upperarm_${side}`),elbow=human.getObjectByName(`lowerarm_${side}`);if(arm&&elbow&&arm.parent){const dir=elbow.getWorldPosition(new T.Vector3()).sub(arm.getWorldPosition(new T.Vector3())).normalize(),target=new T.Vector3(side==='l'?.17:-.17,-1,.03).normalize(),world=arm.getWorldQuaternion(new T.Quaternion());world.premultiply(new T.Quaternion().setFromUnitVectors(dir,target));arm.quaternion.copy(arm.parent.getWorldQuaternion(new T.Quaternion()).invert().multiply(world));human.updateMatrixWorld(true);}
  }
  human.traverse(o=>{if(o instanceof T.SkinnedMesh)o.skeleton.update();});const b=new T.Box3().setFromObject(human,true),h=b.max.y-b.min.y;
  human.traverse(o=>{if(!(o instanceof T.Mesh))return;o.castShadow=true;o.receiveShadow=true;if(/eye/i.test(o.name)){o.material=new T.MeshStandardMaterial({color:/brow/i.test(o.name)?'#382b21':'#382e23',roughness:.7});return;}o.geometry=o.geometry.clone();const positions=o.geometry.getAttribute('position'),colors:number[]=[];for(let i=0;i<positions.count;i++){const v=new T.Vector3();o.getVertexPosition(i,v);v.applyMatrix4(o.matrixWorld);const t=(v.y-b.min.y)/h,hand=Math.abs(v.x-(b.min.x+b.max.x)/2)>h*.17&&t<.66;const c=new T.Color(t>.83||hand||t>.78&&Math.abs(v.x)<h*.06?'#b99375':t<.075?'#342d27':t<.46?'#38434a':'#5f7781');colors.push(c.r,c.g,c.b);}o.geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));o.material=new T.MeshStandardMaterial({vertexColors:true,roughness:.83});});
  human.scale.multiplyScalar(1.7/h);human.position.set(-(b.min.x+b.max.x)/2*1.7/h,-b.min.y*1.7/h,-(b.min.z+b.max.z)/2*1.7/h);const wrap=new T.Group();wrap.position.set(p.x,p.y,p.z);wrap.add(human);wrap.name='Người mẫu tỷ lệ cao 1.70 m — Quaternius CC0';humans.add(wrap);
 }
 return {statues,humans,height:1.7};
}
