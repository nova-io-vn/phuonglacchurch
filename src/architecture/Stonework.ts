import * as T from 'three';
import type {Font} from 'three/addons/loaders/FontLoader.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import {mat} from '../materials/palette';
import {box,curve,extrude,mesh} from '../utils/geometry';
const graniteCanvas=document.createElement('canvas');graniteCanvas.width=graniteCanvas.height=256;
const graniteContext=graniteCanvas.getContext('2d')!,granitePixels=graniteContext.createImageData(256,256);
for(let i=0;i<256*256;i++){const r=Math.sin(i*12.9898)*43758.5453,n=r-Math.floor(r),v=202+n*48;granitePixels.data.set([v,v+1,v,255],i*4);}graniteContext.putImageData(granitePixels,0,0);
const granite=new T.CanvasTexture(graniteCanvas);granite.colorSpace=T.SRGBColorSpace;granite.wrapS=granite.wrapT=T.RepeatWrapping;granite.repeat.set(3,3);granite.anisotropy=8;
export const carvedStone=new T.MeshStandardMaterial({color:'#c2c6c0',map:granite,roughness:.94,normalMap:mat.wall.normalMap,normalScale:new T.Vector2(.25,.25)});
export const agedStone=new T.MeshStandardMaterial({color:'#929992',map:granite,roughness:.97,normalMap:mat.stone.normalMap,normalScale:new T.Vector2(.3,.3)});
export const gateGold=new T.MeshStandardMaterial({color:'#9d8443',metalness:.78,roughness:.42});
const s=new T.Shape();s.moveTo(-1.3,0);s.lineTo(1.3,0);s.lineTo(1.3,1);s.lineTo(-1.3,1);s.closePath();
for(const x of [-.78,0,.78]){const h=new T.Path();h.absellipse(x,.52,.25,.24,0,Math.PI*2,true);s.holes.push(h);}
const lattice=extrude(s,.14);
export function stoneRail(root:T.Object3D,length:number){
 const n=Math.max(1,Math.round(length/2.8)),span=length/n;
 for(let i=0;i<n;i++){
  const x=-length/2+(i+.5)*span,o=mesh(lattice,carvedStone,root,x,.22,-.07);o.scale.x=span/2.8;
  for(const sign of [-1,1])curve(root,carvedStone,[new T.Vector3(x-sign*.95,.57,.09),new T.Vector3(x-sign*.4,.8,.1),new T.Vector3(x,.47,.1),new T.Vector3(x+sign*.65,.3,.1)],.035);
 }
 for(let i=0;i<=n;i++){const x=-length/2+i*span;box(root,carvedStone,x,.77,0,.28,1.54,.36);box(root,carvedStone,x,1.56,0,.43,.12,.5);box(root,carvedStone,x,1.67,0,.32,.12,.38);}
 box(root,agedStone,0,.12,0,length,.24,.38);box(root,carvedStone,0,1.27,0,length,.14,.31);
}
export function lettering(root:T.Object3D,font:Font,text:string,size:number,x:number,y:number,z:number,material:T.Material=gateGold){
 const geo=new TextGeometry(text.normalize('NFC'),{font,size,depth:.045,curveSegments:5,bevelEnabled:true,bevelThickness:.007,bevelSize:.007,bevelSegments:1});geo.computeBoundingBox();const b=geo.boundingBox!;const o=mesh(geo,material,root,x-(b.max.x+b.min.x)/2,y,z);return o;
}
export function cartouche(root:T.Object3D,x:number,y:number,z:number,w:number,h:number){
 box(root,agedStone,x,y,z,w,h,.12);box(root,carvedStone,x,y,z+.08,w-.12,h-.12,.1);
 for(const side of [-1,1]){box(root,carvedStone,x+side*(w/2-.06),y,z+.16,.09,h,.12);box(root,carvedStone,x,y+side*(h/2-.06),z+.16,w,.09,.12);}
}
