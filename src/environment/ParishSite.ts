import * as T from 'three';
import {mat} from '../materials/palette';
import {arch,box,cross,extrude,mesh,rod} from '../utils/geometry';
import {Collision} from '../controls/Collision';
import {stoneRail} from '../architecture/Stonework';
import {SHRINE} from '../architecture/Monuments';
import {waterway} from './River';
export const SITE={latitude:20.0533125,longitude:106.1911875,frontBearing:270,source:'https://maps.app.goo.gl/w534umHBSEyiYDQz5'};
const asphalt=new T.MeshStandardMaterial({color:'#777b76',roughness:.97}),soil=new T.MeshStandardMaterial({color:'#86765c',roughness:1});
const paints=['#d8d3bb','#c3bdac','#b4c4c2'].map(color=>new T.MeshStandardMaterial({color,roughness:.95}));
const foliage:T.Matrix4[]=[],foliageColors:T.Color[]=[];const dummy=new T.Object3D();
const waveCanvas=document.createElement('canvas');waveCanvas.width=waveCanvas.height=128;const wx=waveCanvas.getContext('2d')!,wd=wx.createImageData(128,128);
for(let y=0;y<128;y++)for(let x=0;x<128;x++){const i=(y*128+x)*4;wd.data[i]=128+20*Math.sin(x*.3+y*.12);wd.data[i+1]=128+20*Math.cos(y*.22-x*.1);wd.data[i+2]=252;wd.data[i+3]=255;}wx.putImageData(wd,0,0);
const waterNormal=new T.CanvasTexture(waveCanvas);waterNormal.wrapS=waterNormal.wrapT=T.RepeatWrapping;waterNormal.repeat.set(8,8);
const water=new T.MeshPhysicalMaterial({color:'#315d61',metalness:.24,roughness:.2,clearcoat:.95,side:T.DoubleSide,normalMap:waterNormal,normalScale:new T.Vector2(.15,.15)});
export function animateWater(time:number){waterNormal.offset.set(time*.008,time*.004);}
function leaf(x:number,y:number,z:number,sx:number,sy:number,sz:number){
 // Individual folded leaves preserve a porous canopy silhouette at close viewing distance.
 const rand=(n:number)=>{const v=Math.sin(n*127.1+x*39.7+z*17.3)*43758.5453;return v-Math.floor(v);};
 for(let i=0;i<110;i++){
  const a=rand(i*7+1)*Math.PI*2,c=rand(i*7+2)*2-1,r=Math.cbrt(rand(i*7+3)),q=Math.sqrt(1-c*c);
  dummy.position.set(x+Math.cos(a)*q*r*sx,y+c*r*sy,z+Math.sin(a)*q*r*sz);
  const size=.29+rand(i*7+4)*.19;dummy.scale.set(size,size,size);dummy.rotation.set(rand(i*7+5)*Math.PI,rand(i*7+6)*Math.PI*2,a);dummy.updateMatrix();foliage.push(dummy.matrix.clone());foliageColors.push(new T.Color().setHSL(.25+rand(i+8)*.055,.31,.25+rand(i+9)*.14));
 }
}
function tree(root:T.Group,x:number,z:number,size=1,col?:Collision){
 const h=5.2*size;rod(root,mat.wood,new T.Vector3(x,0,z),new T.Vector3(x,h,z),.17*size);
 for(let j=0;j<9;j++){const a=j*2.4,r=(j%3)*.55*size,yy=h+(j%4)*.5*size;rod(root,mat.wood,new T.Vector3(x,h*.65,z),new T.Vector3(x+Math.cos(a)*r,yy,z+Math.sin(a)*r),.055*size);leaf(x+Math.cos(a)*r,yy,z+Math.sin(a)*r,1.35*size,1.6*size,1.3*size);}
 col?.add(x,z,.8*size,.8*size,'tree');
}
function pond(root:T.Group,col:Collision,x:number,z:number,rx:number,rz:number){
 const r=Math.min(rx,rz)*.35,shape=new T.Shape();shape.moveTo(-rx+r,-rz);shape.lineTo(rx-r,-rz);shape.quadraticCurveTo(rx,-rz,rx,-rz+r);shape.lineTo(rx,rz-r);shape.quadraticCurveTo(rx,rz,rx-r,rz);shape.lineTo(-rx+r,rz);shape.quadraticCurveTo(-rx,rz,-rx,rz-r);shape.lineTo(-rx,-rz+r);shape.quadraticCurveTo(-rx,-rz,-rx+r,-rz);shape.closePath();
 const o=mesh(new T.ShapeGeometry(shape,24),water,root,x,.06,z);o.rotation.x=-Math.PI/2;o.castShadow=false;
 const bankShape=new T.Shape(shape.getPoints(24).map(p=>p.multiplyScalar(1.09)));bankShape.holes.push(new T.Path(shape.getPoints(24)));const bank=mesh(new T.ShapeGeometry(bankShape),soil,root,x,.025,z);bank.rotation.x=-Math.PI/2;
 // Patches of floating leaves along sheltered banks; keep the shrine bridge and island clear.
 const pad=new T.CircleGeometry(1,12,.12,Math.PI*1.91),pads=new T.InstancedMesh(pad,new T.MeshStandardMaterial({color:'#526c3d',roughness:.7,side:T.DoubleSide}),180),d=new T.Object3D();
 for(let i=0;i<180;i++){const a=i*2.39996,f=.84+.12*((Math.sin(i*71.3)+1)/2);d.position.set(x+Math.cos(a)*rx*f,.075+(i%3)*.001,z+Math.sin(a)*rz*f);d.rotation.set(-Math.PI/2,0,a);d.scale.setScalar(.08+(i%9)*.018);d.updateMatrix();pads.setMatrixAt(i,d.matrix);pads.setColorAt(i,new T.Color().setHSL(.24,.3,.22+(i%5)*.025));}pads.receiveShadow=true;root.add(pads);
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
 for(const f of [{x:110,z:5,w:120,d:220},{x:0,z:145,w:65,d:150},{x:0,z:-170,w:64,d:60}]){
  box(root,rice,f.x,-.02,f.z,f.w,.1,f.d);
  for(let z=f.z-f.d/2;z<f.z+f.d/2;z+=22)box(root,soil,f.x,.06,z,f.w,.14,.65);
  for(let x=f.x-f.w/2;x<f.x+f.w/2;x+=24)box(root,soil,x,.06,f.z,.6,.14,f.d);
 }
}
export function parishSite(root:T.Group,col:Collision){
 foliage.length=0;foliageColors.length=0;fields(root);
 // Map north is -X; the Phương Lạc road runs east-west along the northern boundary.
 box(root,asphalt,-38,.02,0,7,.18,340);box(root,mat.stone,-33.8,.12,0,1.1,.3,165);box(root,asphalt,0,.02,-71,170,.18,4.5);
 box(root,water,-43.5,-.02,0,1.8,.08,300);
 // School across the road: blocks around a courtyard, observed only at footprint level.
 house(root,-74,-8,9,45,6.2,0);house(root,-60,-30,30,9,6.2,1);house(root,-61,31,29,8,4.1,2);box(root,asphalt,-61,.01,2,22,.16,46);box(root,mat.grass,-62,.12,0,14,.16,27);
 // Dense red-roof village edge, rather than an invented park around the church.
 for(let i=0;i<16;i++){const z=-111+i*15;if(z>-41&&z<44)continue;house(root,-52-(i%3)*2,z,6.5+(i%2)*2,8.5,3+(i%3)*1.4,i);tree(root,-58,z+5,.65);}
 for(let i=0;i<14;i++){const x=-88+i*12;if(Math.abs(x)<28)continue;house(root,x,-101,6+(i%3),8+(i%2)*3,3+(i%3),i+1);if(i%2===0)tree(root,x+4,-108,.7);}
 // Parish buildings east of the proposed church and a small southern block.
 house(root,-17,-55,8,12,6.2,1,col);house(root,-4,-56,10,14,3.7,1,col);house(root,4,-57,9,8,3.4,1,col);
 pond(root,col,18,43,9,10);pond(root,col,-12,-117,10,13);pond(root,col,12,-118,10,14);pond(root,col,SHRINE.pond.x,SHRINE.pond.z,SHRINE.pond.rx,SHRINE.pond.rz);pond(root,col,-27,27,5,6);pond(root,col,-27,-32,5,6);waterway(root,water,col);
 // Trees frame the enlarged site and leave both entrances and the shrine unobstructed.
 for(const z of [-29,-15,1,17,49])for(const x of [-28,46])tree(root,x,z,.85,col);
 for(let z=-117;z<125;z+=18)if(Math.abs(z-38)>9&&Math.abs(z+43)>9&&Math.abs(z-29)>7)tree(root,-33,z,.85);
 for(const [x,z] of [[-57,-8],[-57,15],[-61,43],[45,-67],[45,-91],[-25,-98],[45,62],[52,70]])tree(root,x,z,1.1);
 // Stone boundary, interrupted at the two independently modelled gate openings.
 for(const [x,z,l,r] of [[-34,-61.1,25.8,Math.PI/2],[-34,-2.5,70.6,Math.PI/2],[-34,55.1,23.8,Math.PI/2],[48,-3.5,141,Math.PI/2],[7,-74,82,0],[7,67,82,0]]){
  const g=new T.Group();g.position.set(x,.05,z);g.rotation.y=r;root.add(g);stoneRail(g,l);
 }
 const crown=new T.BufferGeometry();crown.setAttribute('position',new T.Float32BufferAttribute([0,-.5,0,-.34,-.2,0,-.38,.17,0,0,.5,0,.38,.17,0,.34,-.2,0,0,0,.09],3));crown.setIndex([6,0,1,6,1,2,6,2,3,6,3,4,6,4,5,6,5,0]);crown.computeVertexNormals();
 const leafMaterial=new T.MeshStandardMaterial({color:'#a5b789',roughness:.88,side:T.DoubleSide});
 const inst=new T.InstancedMesh(crown,leafMaterial,foliage.length);foliage.forEach((matrix,i)=>{inst.setMatrixAt(i,matrix);inst.setColorAt(i,foliageColors[i]);});inst.castShadow=true;inst.receiveShadow=true;root.add(inst);
}
