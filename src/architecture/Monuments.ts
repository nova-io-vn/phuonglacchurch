import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {mat} from '../materials/palette';
import {box,column,cross,curve,mesh,ring} from '../utils/geometry';
const marble=new T.MeshStandardMaterial({color:'#eee9d7',roughness:.55,metalness:.03});
export const SHRINE={x:0,z:-53};
export function monumentBases(root:T.Group){
 const g=new T.Group();g.position.set(0,0,-53);g.rotation.y=Math.PI;root.add(g);
 for(let i=0;i<4;i++)box(g,mat.stone,0,.14+i*.23,0,8.4-i*.65,.28,6.6-i*.45);
 box(g,mat.ivory,0,1.5,0,2.8,1.3,2);box(g,mat.bronze,0,2.2,0,3,.12,2.2);
 for(const x of [-3.2,3.2])column(g,mat.ivory,x,.35,6.7,.9,.24);
 const archG=new T.Group();archG.position.set(0,2.1,.4);g.add(archG);ring(archG,mat.ivory,5.8,5.6,.2,0);ring(archG,mat.archLight,6,5.8,.045,.18);
 const shell=new T.Shape();shell.moveTo(-3.6,7.5);shell.lineTo(3.6,7.5);shell.lineTo(0,9);shell.closePath();mesh(new T.ExtrudeGeometry(shell,{depth:2.2,bevelEnabled:false}),mat.ivory,g,0,0,-.7);cross(g,mat.bronze,0,9.55,0,.6);
 for(let i=0;i<12;i++){const a=i*Math.PI*2/12;mesh(new T.SphereGeometry(.08,8,6),mat.glow,g,Math.cos(a)*1.25,5.55+Math.sin(a)*1.25,-.2);}
 box(root,mat.pavement,0,.05,-46,5,.12,12);
 for(const x of [-25,25]){
  for(let i=0;i<3;i++)box(root,mat.stone,x,.15+i*.23,14,3.5-i*.4,.3,3.5-i*.4);
  box(root,mat.ivory,x,1.25,14,1.8,1.2,1.6);box(root,mat.bronze,x,1.91,14,2,.1,1.8);
 }
}
export async function loadFigures(root:T.Group){
 const loader=new GLTFLoader();const [mary,low,person]=await Promise.all([loader.loadAsync('/models/mary.glb'),loader.loadAsync('/models/mary-low.glb'),loader.loadAsync('/models/human.glb')]);
 function canonical(g:T.Object3D){g.rotation.x=-Math.PI/2;g.updateMatrixWorld(true);const b=new T.Box3().setFromObject(g),h=b.max.y-b.min.y;g.scale.multiplyScalar(1/h);g.position.set(-(b.min.x+b.max.x)/2/h,-b.min.y/h,-(b.min.z+b.max.z)/2/h);g.traverse(o=>{if(o instanceof T.Mesh){o.material=marble;o.castShadow=true;o.receiveShadow=true;}});const p=new T.Group();p.add(g);return p;}
 const high=canonical(mary.scene),small=canonical(low.scene);const statues:T.Object3D[]=[];
 for(const a of [{x:0,y:2.28,z:-53,h:3.65,r:Math.PI},{x:-25,y:1.98,z:14,h:2.35,r:0},{x:25,y:1.98,z:14,h:2.35,r:0},{x:0,y:8.2,z:19.07,h:2.1,r:0},{x:0,y:12.65,z:19.15,h:4.2,r:0}]){
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
