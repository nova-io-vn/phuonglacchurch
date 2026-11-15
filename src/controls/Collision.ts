import * as T from 'three';
import {isInterior} from '../architecture/config';
import type {StairSpec} from '../architecture/Staircase';
export type Obstacle={x:number,z:number,w:number,d:number,name:string};
export class Collision {
 obstacles:Obstacle[]=[];stairs:StairSpec[]=[];doors:{x:number,z:number,width:number,open:boolean,angle:number,rotation?:number}[]=[];
 add(x:number,z:number,w:number,d:number,name='architecture'){this.obstacles.push({x,z,w,d,name});}
 blocked(x:number,z:number,r=.28){
  if(Math.abs(x)>52||z>62||z< -62)return true;
  for(const b of this.obstacles){const nx=T.MathUtils.clamp(x,b.x-b.w/2,b.x+b.w/2),nz=T.MathUtils.clamp(z,b.z-b.d/2,b.z+b.d/2);if((x-nx)**2+(z-nz)**2<r*r)return true;}
  for(const d of this.doors){
   // Swing panels remain solid while moving and after opening. Capsule-segment tests in XZ.
   for(const side of [-1,1]){const px=d.x+side*d.width/2,pz=d.z;const angle=side<0?d.angle:-d.angle;const vx=-side*d.width/2*Math.cos(angle),vz=side*d.width/2*Math.sin(angle);const t=T.MathUtils.clamp(((x-px)*vx+(z-pz)*vz)/(vx*vx+vz*vz),0,1);if((x-px-t*vx)**2+(z-pz-t*vz)**2<(r+.1)**2)return true;}
  }
  return false;
 }
 move(p:T.Vector3,dx:number,dz:number){const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.12));for(let i=0;i<n;i++){if(!this.blocked(p.x+dx/n,p.z))p.x+=dx/n;if(!this.blocked(p.x,p.z+dz/n))p.z+=dz/n;}return p;}
 floor(x:number,z:number){
  for(const s of this.stairs){const a=s.rotation,dx=x-s.x,dz=z-s.z,lx=dx*Math.cos(a)-dz*Math.sin(a),lz=dx*Math.sin(a)+dz*Math.cos(a);if(Math.abs(lx)<s.width/2&&lz>=0&&lz<s.run)return s.rise-Math.floor(lz/(s.run/s.steps))*s.rise/s.steps;}
  if(isInterior(x,z)){if(z< -29&&Math.abs(x)<6)return 1.35+Math.min(3,Math.floor((-29-z)/.7)+1)*.18;if(x< -11.6&&z> -29.25&&z< -18.75)return 1.51;return 1.35;}
  // Stair treads are sampled as actual floor levels, not a camera passing through a box.
  if(z>=18.5&&z<21.125&&Math.abs(x)<11.3)return Math.max(0,.6-Math.max(0,Math.ceil((z-18.875)/.75))*.15);
  if(Math.abs(x-18)<.85&&z>31.9&&z<41||Math.abs(x-18)<1.9&&Math.abs(z-43)<2.25)return .46;
  return 0;
 }
}
