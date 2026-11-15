import * as T from 'three';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {batchStatic,box,curve,mesh} from '../utils/geometry';
import {VINCENT} from './ShrineLayout';
const stone=new T.MeshStandardMaterial({color:'#d5d1c1',roughness:.7,metalness:.025});
const recess=new T.MeshStandardMaterial({color:'#99998d',roughness:.86});
/** Bake the licensed character's posed face, ears, hands and body into a static sculptural study. */
function figure(source:T.Object3D){
 const posed=clone(source);posed.updateMatrixWorld(true);
 for(const side of ['l','r']){const arm=posed.getObjectByName(`upperarm_${side}`),elbow=posed.getObjectByName(`lowerarm_${side}`);if(arm&&elbow&&arm.parent){const direction=elbow.getWorldPosition(new T.Vector3()).sub(arm.getWorldPosition(new T.Vector3())).normalize(),target=new T.Vector3(side==='l'?.15:-.15,-1,.07).normalize(),world=arm.getWorldQuaternion(new T.Quaternion());world.premultiply(new T.Quaternion().setFromUnitVectors(direction,target));arm.quaternion.copy(arm.parent.getWorldQuaternion(new T.Quaternion()).invert().multiply(world));posed.updateMatrixWorld(true);}}
 const g=new T.Group();posed.traverse(o=>{if(!(o instanceof T.Mesh))return;if(o instanceof T.SkinnedMesh)o.skeleton.update();const geo=o.geometry.clone(),p=geo.getAttribute('position');for(let i=0;i<p.count;i++){const v=new T.Vector3();o.getVertexPosition(i,v);v.applyMatrix4(o.matrixWorld);p.setXYZ(i,v.x,v.y,v.z);}geo.deleteAttribute('skinIndex');geo.deleteAttribute('skinWeight');geo.computeVertexNormals();mesh(geo,/eye/i.test(o.name)?recess:stone,g);});
 const b=new T.Box3().setFromObject(g,true),h=b.max.y-b.min.y;const out=new T.Group();g.position.set(-(b.min.x+b.max.x)/2,-b.min.y,-(b.min.z+b.max.z)/2);out.add(g);out.scale.setScalar(1/h);return out;
}
/** Continuous pleated cassock, avoiding an assembly of primitive body proxies. */
function cassock(root:T.Group){
 const rows=[[.08,.8,.42],[.35,.78,.42],[1,.69,.38],[1.8,.54,.34],[2.3,.5,.32],[2.8,.68,.35],[3.17,.71,.33],[3.3,.35,.27]],p:number[]=[],uv:number[]=[],idx:number[]=[],n=80;
 rows.forEach(([y,rx,rz],j)=>{for(let i=0;i<=n;i++){const a=i/n*Math.PI*2,f=.045*Math.cos(a*16+y*.7)+.017*Math.sin(a*27-y),fall=1-j/(rows.length+2);p.push(Math.cos(a)*(rx+f*fall),y,Math.sin(a)*(rz+f*fall));uv.push(i/n,j/(rows.length-1));}});
 for(let j=0;j<rows.length-1;j++)for(let i=0;i<n;i++){const a=j*(n+1)+i;idx.push(a,a+n+1,a+1,a+1,a+n+1,a+n+2);}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(p,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();mesh(geo,stone,root);
 // Capelet, Roman collar, centre seam, buttons and shallow carved drapery.
 const cape=new T.LatheGeometry([new T.Vector2(.35,3.29),new T.Vector2(.61,3.19),new T.Vector2(.79,2.99),new T.Vector2(.76,2.78)],64);cape.scale(1,1,.61);mesh(cape,stone,root);
 for(const x of [-.11,.11])box(root,stone,x,3.22,.3,.17,.21,.06);
 curve(root,recess,[new T.Vector3(0,.17,.46),new T.Vector3(0,1,.4),new T.Vector3(0,2,.36),new T.Vector3(0,3.15,.36)],.012);
 for(let i=0;i<23;i++)mesh(new T.SphereGeometry(.025,8,6),stone,root,.045,.4+i*.12,.43-i*.003);
 for(const s of [-1,1])curve(root,stone,[new T.Vector3(s*.62,3.13,.05),new T.Vector3(s*.8,2.78,.17),new T.Vector3(s*.84,2.18,.32)],.17);
}
export function vincentSculpture(root:T.Group,character:T.Object3D){
 const g=new T.Group();g.name='Thánh Vinh Sơn Phaolô với trẻ em — tái dựng hình tượng';g.position.set(VINCENT.x,2.89,VINCENT.z);g.rotation.y=VINCENT.rotation;root.add(g);
 const priest=figure(character);priest.scale.multiplyScalar(3.9);g.add(priest);cassock(g);
 // Receding hair, short beard and facial carving distinguish an elderly priest from the base figure.
 const hair=new T.MeshStandardMaterial({color:'#c4c3b3',roughness:.92});
 const bead=(x:number,y:number,z:number,sx:number,sy:number,sz:number)=>{const o=mesh(new T.SphereGeometry(1,20,14),hair,g,x,y,z);o.scale.set(sx,sy,sz);return o;};
 bead(0,3.46,.13,.115,.13,.065);bead(-.055,3.54,.17,.064,.024,.025);bead(.055,3.54,.17,.064,.024,.025);
 curve(g,hair,[new T.Vector3(-.16,3.69,.025),new T.Vector3(-.15,3.78,-.09),new T.Vector3(0,3.81,-.14),new T.Vector3(.15,3.78,-.09),new T.Vector3(.16,3.69,.025)],.035);
 for(let i=0;i<7;i++){const x=(i-3)*.025;curve(g,hair,[new T.Vector3(x,3.51,.19),new T.Vector3(x*.9,3.45,.2),new T.Vector3(x*.55,3.37,.16)],.009);}
 // Child at the saint's side; a second, swaddled infant rests in his arm.
 const child=figure(character);child.scale.multiplyScalar(1.65);child.position.set(1.02,.02,.18);child.rotation.z=.1;g.add(child);
 const tunic=new T.LatheGeometry([new T.Vector2(.26,.45),new T.Vector2(.22,.82),new T.Vector2(.22,1.13),new T.Vector2(.28,1.28),new T.Vector2(.13,1.37)],40);tunic.scale(1,1,.7);mesh(tunic,stone,g,1.02,.02,.18);
 for(const x of [.78,1.26])curve(g,stone,[new T.Vector3(x,1.28,.18),new T.Vector3(x+Math.sign(x-1.02)*.05,1.05,.21),new T.Vector3(x+Math.sign(x-1.02)*.06,.96,.21)],.075);
 const infant=figure(character);infant.scale.multiplyScalar(1.04);infant.position.set(-.68,2.06,.5);infant.rotation.z=-.3;g.add(infant);
 const blanket=mesh(new T.LatheGeometry([new T.Vector2(.02,0),new T.Vector2(.2,.12),new T.Vector2(.22,.52),new T.Vector2(.16,.72)],32),stone,g,-.67,2.05,.5);blanket.rotation.z=-.3;
 for(let i=0;i<5;i++)curve(g,stone,[new T.Vector3(-.85+i*.07,2.15,.69),new T.Vector3(-.82+i*.07,2.4,.73),new T.Vector3(-.73+i*.07,2.65,.69)],.018);
 // The supporting forearm is continuous with the sleeve, reaching beneath the infant.
 curve(g,stone,[new T.Vector3(-.7,2.72,.12),new T.Vector3(-1,2.35,.4),new T.Vector3(-.65,2.3,.71)],.15);
 // The imported body uses extra skin/colour channels; normalize channels before merging with cloth.
 g.traverse(o=>{if(!(o instanceof T.Mesh))return;for(const name of Object.keys(o.geometry.attributes))if(!['position','normal','uv'].includes(name))o.geometry.deleteAttribute(name);if(!o.geometry.hasAttribute('uv'))o.geometry.setAttribute('uv',new T.BufferAttribute(new Float32Array(o.geometry.getAttribute('position').count*2),2));});
 batchStatic(g);g.userData={dedication:'Vincent de Paul',children:2,source:'Quaternius CC0 base + original procedural cassock and composition',reconstruction:true};return g;
}
