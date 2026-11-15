import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
export function mesh(g:T.BufferGeometry,m:T.Material,parent:T.Object3D,x=0,y=0,z=0){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
const cube=new T.BoxGeometry(1,1,1);
export function box(p:T.Object3D,m:T.Material,x:number,y:number,z:number,w:number,h:number,d:number){const o=mesh(cube,m,p,x,y,z);o.scale.set(w,h,d);return o;}
export function rod(p:T.Object3D,m:T.Material,a:T.Vector3,b:T.Vector3,r=.06){const o=mesh(new T.CylinderGeometry(r,r,a.distanceTo(b),8),m,p);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());return o;}
export function curve(p:T.Object3D,m:T.Material,points:T.Vector3[],r=.065){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),48,r,7,false),m,p);}
export function arch(w:number,h:number){const s=new T.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(w/2,h*.61);s.quadraticCurveTo(w/2,h*.84,0,h);s.quadraticCurveTo(-w/2,h*.84,-w/2,h*.61);s.closePath();return s;}
export function extrude(s:T.Shape,d:number){return new T.ExtrudeGeometry(s,{depth:d,bevelEnabled:false,curveSegments:16});}
export function ring(p:T.Object3D,m:T.Material,w:number,h:number,t:number,z:number){const s=arch(w+t*2,h+t);const hole=arch(w,h);s.holes.push(new T.Path(hole.getPoints(32).map(v=>new T.Vector2(v.x,v.y+t*.2))));const o=mesh(extrude(s,.16),m,p,0,-t*.2,z);return o;}
export function panel(p:T.Object3D,m:T.Material,w:number,h:number,d:number,holes:{x:number,y:number,w:number,h:number}[]=[]){const s=new T.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(w/2,h);s.lineTo(-w/2,h);s.closePath();for(const a of holes){const sh=arch(a.w,a.h);s.holes.push(new T.Path(sh.getPoints(32).map(v=>new T.Vector2(v.x+a.x,v.y+a.y))));}return mesh(extrude(s,d),m,p);}
export function cross(p:T.Object3D,m:T.Material,x:number,y:number,z:number,size=1){box(p,m,x,y,z,.14*size,1.65*size,.14*size);box(p,m,x,y+.2*size,z,.95*size,.14*size,.14*size);}
export function column(p:T.Object3D,m:T.Material,x:number,z:number,h:number,y=.6,r=.35){
 box(p,m,x,y+.15,z,r*3,.3,r*3);mesh(new T.CylinderGeometry(r*1.3,r*1.7,.22,12),m,p,x,y+.4,z);
 mesh(new T.CylinderGeometry(r,r*1.08,h-.9,16),m,p,x,y+h/2,z);
 for(let i=0;i<4;i++){const a=i*Math.PI/2;mesh(new T.CylinderGeometry(r*.2,r*.2,h-.7,8),m,p,x+Math.cos(a)*r,y+h/2,z+Math.sin(a)*r);}
 mesh(new T.CylinderGeometry(r*1.65,r,.35,12),m,p,x,y+h-.3,z);box(p,m,x,y+h-.08,z,r*3.6,.2,r*3.6);
}
/** Bake static meshes by material; leave animated doors and lights in their own tree. */
export function batchStatic(root:T.Group){
 root.updateMatrixWorld(true);const bins=new Map<T.Material,T.BufferGeometry[]>();const old:T.Mesh[]=[];
 root.traverse(o=>{if(o instanceof T.Mesh && !(o instanceof T.InstancedMesh) && !Array.isArray(o.material)){const base=o.geometry.clone().applyMatrix4(o.matrixWorld);const g=base.index?base.toNonIndexed():base;if(g!==base)base.dispose();g.deleteAttribute('uv1');const arr=bins.get(o.material)||[];arr.push(g);bins.set(o.material,arr);old.push(o);}});
 for(const o of old)o.removeFromParent();for(const [m,gs] of bins){const merged=mergeGeometries(gs,false);if(merged){const o=mesh(merged,m,root);o.castShadow=!m.userData.transmitsLight;o.name='Batched architecture';}gs.forEach(g=>g.dispose());}
}
