import * as T from 'three';
import {mat} from '../materials/palette';
import {arch,box,extrude,mesh,ring} from '../utils/geometry';
export class GothicDoor {
 group=new T.Group();leaves:T.Group[]=[];open=false;angle=0;
 constructor(public x:number,public z:number,public width:number,public height:number,staticRoot:T.Group,dynamicRoot:T.Group,public rotation=0){
  this.group.position.set(x,.6,z);this.group.rotation.y=rotation;dynamicRoot.add(this.group);
  const frame=new T.Group();frame.position.copy(this.group.position);frame.rotation.y=rotation;staticRoot.add(frame);
  for(let i=0;i<3;i++)ring(frame,mat.ivory,width+i*.3,height+i*.22,.12,.16-i*.12);
  ring(frame,mat.archLight,width+.95,height+.68,.035,-.16);
  for(const side of [-1,1]){
   const pivot=new T.Group();pivot.position.x=side*width/2;this.group.add(pivot);this.leaves.push(pivot);
   const s=arch(width-.12,height-.1);const clip=new T.Shape();
   const pts=s.getPoints(64).filter(p=>side<0?p.x<=.001:p.x>=-.001);
   // Half of the arch shape, with a straight meeting edge.
   clip.moveTo(0,0);if(side<0){clip.lineTo(-width/2+.06,0);clip.lineTo(-width/2+.06,height*.61);clip.quadraticCurveTo(-width/2+.06,height*.84,0,height-.1);}else{clip.lineTo(width/2-.06,0);clip.lineTo(width/2-.06,height*.61);clip.quadraticCurveTo(width/2-.06,height*.84,0,height-.1);}clip.closePath();void pts;
   const leaf=mesh(extrude(clip,.18),mat.wood,pivot,-side*width/2,0,0);
   leaf.name='Porte en chêne';
   for(let r=0;r<3;r++)box(pivot,mat.bronze,-side*width*.24,1+r*height*.23,.2,width*.39,.06,.06);
   for(let c=0;c<3;c++)box(pivot,mat.bronze,-side*width/2+side*(.2+c*.25),height*.32,.2,.025,height*.55,.025);
   const handle=mesh(new T.TorusGeometry(.12,.025,8,16),mat.bronze,pivot,-side*(width/2-.24),height*.4,.24);handle.name='Door handle';
  }
 }
 update(dt:number){const goal=this.open?1.45:0;this.angle=T.MathUtils.damp(this.angle,goal,7,dt);this.leaves[0].rotation.y=this.angle;this.leaves[1].rotation.y=-this.angle;}
}
