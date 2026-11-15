import * as T from 'three';
import {animateWater} from './ParishSite';
/** Subtle moving flock and animated water normals; all geometry, no billboard people. */
export class Life {
 bird:T.Mesh;geometry:T.BufferGeometry;material=new T.MeshStandardMaterial({color:'#46504b',side:T.DoubleSide,roughness:1});
 constructor(root:T.Group){this.geometry=new T.BufferGeometry();this.geometry.setAttribute('position',new T.Float32BufferAttribute(new Float32Array(5*18),3));this.geometry.setAttribute('normal',new T.Float32BufferAttribute(new Float32Array(5*18),3));this.bird=new T.Mesh(this.geometry,this.material);this.bird.frustumCulled=false;root.add(this.bird);}
 update(time:number,night:boolean){animateWater(time);this.bird.visible=!night;if(night)return;const p=this.geometry.getAttribute('position');for(let i=0;i<5;i++){const x=30+Math.sin(time*.06+i*.15)*28,z=-25+Math.cos(time*.06+i*.15)*34,y=29+i*.8,flap=Math.sin(time*5+i)*.32;const verts=[[x,y,z],[x-.8,y+flap,z+.2],[x,y,z+.28],[x,y,z],[x+.8,y+flap,z+.2],[x,y,z+.28]];verts.forEach((v,j)=>p.setXYZ(i*6+j,...v as [number,number,number]));}p.needsUpdate=true;this.geometry.computeVertexNormals();}
}
