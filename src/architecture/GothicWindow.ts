import * as T from 'three';
import {mat} from '../materials/palette';
import {arch,box,mesh,ring,rod} from '../utils/geometry';
export class GothicWindowGenerator {
 create(w=2.5,h=6.5){
  const g=new T.Group();
  for(const side of [-1,1]){const z=side*.39;ring(g,mat.ivory,w,h,.13,z);ring(g,mat.stone,w+.32,h+.2,.1,z-side*.08);
   box(g,mat.ivory,0,-.1,z,w+.6,.2,.45);ring(g,mat.archLight,w+.35,h+.2,.025,z+side*.03);
  }
  mesh(new T.ShapeGeometry(arch(w-.12,h-.08),20),mat.glass[0],g,0,.04,0);
  // Real colored panes and raised leadwork, constrained to the pointed opening.
  const paneW=(w-.2)/4, rowH=(h*.6)/7;
  for(let row=0;row<7;row++)for(let c=0;c<4;c++){
   box(g,mat.glass[(row+c*2)%5],-w/2+.1+paneW*(c+.5),.09+rowH*(row+.5),0,paneW-.035,rowH-.035,.045);
  }
  for(let i=-1;i<=1;i++)box(g,mat.bronze,i*w/4,h*.32,0,.045,h*.62,.11);
  for(let i=1;i<=7;i++)box(g,mat.bronze,0,i*rowH,0,w-.1,.035,.1);
  const rose=this.rose(w*.26);rose.position.set(0,h*.77,.04);g.add(rose);
  for(const s of [-1,1])rod(g,mat.ivory,new T.Vector3(s*w*.24,h*.59,0),new T.Vector3(0,h*.98,0),.045);
  return g;
 }
 rose(r=1.5){
  const g=new T.Group();const disk=mesh(new T.CircleGeometry(r,48),mat.glass[0],g);disk.material=mat.glass[0];
  for(const side of [-1,1]){const t=mesh(new T.TorusGeometry(r,.1,8,64),mat.ivory,g,0,0,side*.05);t.rotation.z=Math.PI/8;}
  for(let i=0;i<12;i++){const a=i*Math.PI/6;const petal=new T.Shape();petal.moveTo(0,0);petal.quadraticCurveTo(r*.5,-r*.23,r*.9,0);petal.quadraticCurveTo(r*.5,r*.23,0,0);const o=mesh(new T.ShapeGeometry(petal),mat.glass[i%5],g,0,0,.02);o.rotation.z=a;
   rod(g,mat.bronze,new T.Vector3(0,0,.08),new T.Vector3(Math.cos(a)*r,Math.sin(a)*r,.08),.025);}
  mesh(new T.TorusGeometry(r*.32,.055,8,32),mat.ivory,g,0,0,.1);return g;
 }
}
export const windows=new GothicWindowGenerator();
