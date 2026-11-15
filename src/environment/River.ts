import * as T from 'three';
import {mat} from '../materials/palette';
import {box,curve,mesh,rod} from '../utils/geometry';
import {Collision} from '../controls/Collision';
export const riverZ=(x:number)=>-83+Math.sin(x*.018)*4;
export function waterway(root:T.Group,water:T.Material,col:Collision){
 const pos:number[]=[],uv:number[]=[],indices:number[]=[];const banks:[T.Vector3[],T.Vector3[]]=[[],[]];
 for(let i=0;i<=80;i++){const x=-220+i*5.5,z=riverZ(x),w=.85+Math.sin(i*.23)*.12;pos.push(x,.2,z-w,x,.2,z+w);uv.push(i/12,0,i/12,1);banks[0].push(new T.Vector3(x,0,z-w-.18));banks[1].push(new T.Vector3(x,0,z+w+.18));if(i<80)indices.push(i*2,i*2+1,i*2+2,i*2+1,i*2+3,i*2+2);}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();const river=mesh(geo,water,root);river.name='Sông / kênh phía cuối khu đất';river.castShadow=false;
 for(const points of banks){const bank=curve(root,mat.grass,points,.22);bank.scale.y=.35;bank.position.y=.23;}
 const bz=riverZ(-38);box(root,mat.stone,-38,.5,bz,8,.65,15);box(root,mat.pavement,-38,.85,bz,7.8,.1,15);
 for(const s of [-1,1]){rod(root,mat.bronze,new T.Vector3(-38+s*3.8,1.9,bz-7.4),new T.Vector3(-38+s*3.8,1.9,bz+7.4),.055);for(let j=0;j<6;j++)rod(root,mat.stone,new T.Vector3(-38+s*3.8,.9,bz-7+j*2.8),new T.Vector3(-38+s*3.8,1.95,bz-7+j*2.8),.07);}
 col.add(0,-83,400,1.7,'river');
}
