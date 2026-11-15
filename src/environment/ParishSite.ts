import * as T from 'three';
import {mat} from '../materials/palette';
import {arch,box,cross,extrude,mesh,rod} from '../utils/geometry';
import {Collision} from '../controls/Collision';
export const SITE={latitude:20.0533125,longitude:106.1911875,frontBearing:270,source:'https://maps.app.goo.gl/w534umHBSEyiYDQz5'};
const asphalt=new T.MeshStandardMaterial({color:'#777b76',roughness:.97}),soil=new T.MeshStandardMaterial({color:'#86765c',roughness:1});
const paints=['#d8d3bb','#c3bdac','#b4c4c2'].map(color=>new T.MeshStandardMaterial({color,roughness:.95}));
const foliage:T.Matrix4[]=[],foliageColors:T.Color[]=[];const dummy=new T.Object3D();
const waveCanvas=document.createElement('canvas');waveCanvas.width=waveCanvas.height=128;const wx=waveCanvas.getContext('2d')!,wd=wx.createImageData(128,128);
for(let y=0;y<128;y++)for(let x=0;x<128;x++){const i=(y*128+x)*4;wd.data[i]=128+20*Math.sin(x*.3+y*.12);wd.data[i+1]=128+20*Math.cos(y*.22-x*.1);wd.data[i+2]=252;wd.data[i+3]=255;}wx.putImageData(wd,0,0);
const waterNormal=new T.CanvasTexture(waveCanvas);waterNormal.wrapS=waterNormal.wrapT=T.RepeatWrapping;waterNormal.repeat.set(8,8);
const water=new T.MeshPhysicalMaterial({color:'#354e42',metalness:.22,roughness:.23,clearcoat:.9,normalMap:waterNormal,normalScale:new T.Vector2(.15,.15)});
export function animateWater(time:number){waterNormal.offset.set(time*.008,time*.004);}
function leaf(x:number,y:number,z:number,sx:number,sy:number,sz:number){dummy.position.set(x,y,z);dummy.scale.set(sx,sy,sz);dummy.rotation.set(x*.13,y,z*.11);dummy.updateMatrix();foliage.push(dummy.matrix.clone());foliageColors.push(new T.Color().setHSL(.27+Math.sin(x+z)*.025,.24,.28+Math.sin(x*2+z)*.04));}
function tree(root:T.Group,x:number,z:number,size=1,col?:Collision){
 const h=5.2*size;rod(root,mat.wood,new T.Vector3(x,0,z),new T.Vector3(x,h,z),.17*size);
 for(let j=0;j<9;j++){const a=j*2.4,r=(j%3)*.55*size,yy=h+(j%4)*.5*size;rod(root,mat.wood,new T.Vector3(x,h*.65,z),new T.Vector3(x+Math.cos(a)*r,yy,z+Math.sin(a)*r),.055*size);leaf(x+Math.cos(a)*r,yy,z+Math.sin(a)*r,1.35*size,1.6*size,1.3*size);}
 col?.add(x,z,.8*size,.8*size,'tree');
}
function pond(root:T.Group,col:Collision,x:number,z:number,rx:number,rz:number){
 const r=Math.min(rx,rz)*.35,shape=new T.Shape();shape.moveTo(-rx+r,-rz);shape.lineTo(rx-r,-rz);shape.quadraticCurveTo(rx,-rz,rx,-rz+r);shape.lineTo(rx,rz-r);shape.quadraticCurveTo(rx,rz,rx-r,rz);shape.lineTo(-rx+r,rz);shape.quadraticCurveTo(-rx,rz,-rx,rz-r);shape.lineTo(-rx,-rz+r);shape.quadraticCurveTo(-rx,-rz,-rx+r,-rz);shape.closePath();
 const o=mesh(new T.ShapeGeometry(shape,24),water,root,x,.06,z);o.rotation.x=-Math.PI/2;o.castShadow=false;
 const bankShape=new T.Shape(shape.getPoints(24).map(p=>p.multiplyScalar(1.09)));bankShape.holes.push(new T.Path(shape.getPoints(24)));const bank=mesh(new T.ShapeGeometry(bankShape),soil,root,x,.025,z);bank.rotation.x=-Math.PI/2;
 // An ellipse sampled into small cells keeps walkers out of the water without blocking its shore.
 for(let xx=-rx+.6;xx<rx;xx+=1.2)for(let zz=-rz+.6;zz<rz;zz+=1.2){const bridge=x===18&&z===43&&(Math.abs(xx)<1.1&&zz<1||Math.abs(xx)<1.9&&Math.abs(zz)<2.3);const qx=Math.max(0,Math.abs(xx)-(rx-r)),qz=Math.max(0,Math.abs(zz)-(rz-r));if(!bridge&&qx*qx+qz*qz<r*r)col.add(x+xx,z+zz,1.2,1.2,'pond');}
}
function house(root:T.Group,x:number,z:number,w:number,d:number,h:number,index:number,col?:Collision){
 box(root,paints[index%3],x,h/2,z,w,h,d);box(root,mat.stone,x,.24,z,w+.2,.48,d+.2);
 const s=new T.Shape();s.moveTo(-w/2-.35,0);s.lineTo(w/2+.35,0);s.lineTo(0,w*.34);s.closePath();const ro=mesh(extrude(s,d+.7),index%4===0?mat.stone:mat.red,root,x,h,z-d/2-.35);ro.name='Neighbourhood pitched roof';
 for(const side of [-1,1]){
  box(root,mat.ivory,x,h+.03,z+side*d/2,w+.7,.16,.28);
  for(let floor=0;floor<Math.max(1,Math.floor(h/2.8));floor++)for(const dx of [-w*.28,w*.28]){box(root,mat.ivory,x+dx,1.8+floor*2.6,z+side*(d/2+.03),1.05,1.35,.12);box(root,mat.dark,x+dx,1.8+floor*2.6,z+side*(d/2+.1),.85,1.16,.03);box(root,mat.ivory,x+dx,1.8+floor*2.6,z+side*(d/2+.13),.035,1.16,.04);}
 }
 box(root,mat.wood,x,.95,z+d/2+.09,1.3,1.9,.12);col?.add(x,z,w+.5,d+.5,'parish ancillary building');
}
function fields(root:T.Group){
 const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d')!;ctx.fillStyle='#7b8857';ctx.fillRect(0,0,256,256);for(let i=0;i<256;i++){ctx.fillStyle=i%16<2?'#64734d':`hsl(${70+i%12},22%,${42+i%7}%)`;ctx.fillRect(i,0,1,256);}
 const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(8,8);const rice=new T.MeshStandardMaterial({map:tex,roughness:1});
 for(const f of [{x:95,z:5,w:120,d:220},{x:0,z:125,w:65,d:140},{x:0,z:-135,w:64,d:70}]){
  box(root,rice,f.x,-.02,f.z,f.w,.1,f.d);
  for(let z=f.z-f.d/2;z<f.z+f.d/2;z+=22)box(root,soil,f.x,.06,z,f.w,.14,.65);
  for(let x=f.x-f.w/2;x<f.x+f.w/2;x+=24)box(root,soil,x,.06,f.z,.6,.14,f.d);
 }
}
export function parishSite(root:T.Group,col:Collision){
 foliage.length=0;foliageColors.length=0;fields(root);
 // Map north is -X; the Phương Lạc road runs east-west along the northern boundary.
 box(root,asphalt,-38,.02,0,7,.18,340);box(root,mat.stone,-33.8,.12,0,1.1,.3,165);box(root,asphalt,0,.02,-55,170,.18,4.5);
 box(root,water,-43.5,-.02,0,1.8,.08,300);
 // School across the road: blocks around a courtyard, observed only at footprint level.
 house(root,-74,-8,9,45,6.2,0);house(root,-60,-30,30,9,6.2,1);house(root,-61,31,29,8,4.1,2);box(root,asphalt,-61,.01,2,22,.16,46);box(root,mat.grass,-62,.12,0,14,.16,27);
 // Dense red-roof village edge, rather than an invented park around the church.
 for(let i=0;i<16;i++){const z=-111+i*15;if(z>-41&&z<44)continue;house(root,-52-(i%3)*2,z,6.5+(i%2)*2,8.5,3+(i%3)*1.4,i);tree(root,-58,z+5,.65);}
 for(let i=0;i<14;i++){const x=-88+i*12;house(root,x,-66,6+(i%3),8+(i%2)*3,3+(i%3),i+1);if(i%2===0)tree(root,x+4,-72,.7);}
 // Parish buildings east of the proposed church and a small southern block.
 house(root,-14,-37,10,10,6.2,0,col);house(root,15,-37,11,8,3.7,1,col);house(root,-24,-22,5,12,3.4,0,col);
 pond(root,col,18,43,9,10);pond(root,col,-12,-81,10,13);pond(root,col,12,-82,10,14);pond(root,col,16,-47,10,4);
 // The western pond's concrete platform is visible on imagery; its use is not asserted.
 box(root,mat.ivory,18,.24,43,3.8,.4,4.5);box(root,mat.stone,18,.26,36.4,1.7,.42,9);cross(root,mat.ivory,18,3,43,.9);
 for(const z of [-42,-29,-15,1,17,31,49])for(const x of [-28,29])tree(root,x,z,.8+(Math.abs(z)%5)*.045,col);
 for(let z=-117;z<125;z+=18)tree(root,-33,z,.85);
 for(const [x,z] of [[-57,-8],[-57,15],[-61,43],[35,-67],[28,-91],[-25,-98],[37,62],[45,70]] as [number,number][])tree(root,x,z,1.1);
 // Local parish boundary; main public approach is an opening from the north road.
 for(const x of [-30,31])for(let z=-47;z<55;z+=3){if(x<0&&z>25&&z<39)continue;box(root,mat.ivory,x,1,z,.32,2,.32);box(root,mat.stone,x,.25,z,.35,.5,3);box(root,mat.dark,x,1.5,z,.07,.055,3);for(let i=0;i<5;i++)box(root,mat.dark,x,.95,z-1.2+i*.5,.035,1.4,.035);col.add(x,z,.45,3,'site fence');}
 for(const z of [-48,55]){box(root,mat.stone,.5,.3,z,61,.6,.5);col.add(.5,z,61,.6,'site wall');}
 box(root,mat.pavement,-33,.04,32,11,.14,9);for(const z of [25,39]){box(root,mat.wall,-30,1.7,z,1,3.4,1);box(root,mat.ivory,-30,3.5,z,1.4,.25,1.4);}
 const crown=new T.SphereGeometry(1,18,12);const a=crown.getAttribute('position');for(let i=0;i<a.count;i++){const n=1+.075*Math.sin(i*2.19);a.setXYZ(i,a.getX(i)*n,a.getY(i)*n,a.getZ(i)*n);}crown.computeVertexNormals();
 const inst=new T.InstancedMesh(crown,mat.leaf,foliage.length);foliage.forEach((matrix,i)=>{inst.setMatrixAt(i,matrix);inst.setColorAt(i,foliageColors[i]);});inst.castShadow=true;inst.receiveShadow=true;root.add(inst);
}
