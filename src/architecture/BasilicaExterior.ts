import * as T from 'three';
import {mat} from '../materials/palette';
import {box,column,cross,curve,extrude,mesh,panel,ring} from '../utils/geometry';
import {BAYS} from './config';
import {windows} from './GothicWindow';
import {basilicaRoof,gable,roof} from './RoofBuilder';
import {transept} from './TranseptBuilder';
import {Collision} from '../controls/Collision';
function balustrade(root:T.Group,length:number,y:number,z:number){
 box(root,mat.ivory,0,y,z,length,.14,.23);box(root,mat.ivory,0,y+.85,z,length,.13,.25);
 for(let x=-length/2;x<length/2;x+=.42)column(root,mat.ivory,x,z,.65,y+.1,.035);
}
export function basilicaExterior(root:T.Group,col:Collision){
 box(root,mat.stone,0,.22,-9,22.5,.44,54.4);box(root,mat.floor,0,.53,-9,21.3,.14,53.9);
 const front=new T.Group();front.position.set(0,.6,18);root.add(front);
 panel(front,mat.wall,22,10.8,.65,[{x:-8,y:0,w:2.5,h:4.5},{x:0,y:0,w:3.8,h:6},{x:8,y:0,w:2.5,h:4.5}]);
 for(const [a,b] of [[-11,-9.25],[-6.75,-1.9],[1.9,6.75],[9.25,11]])col.add((a+b)/2,18.3,b-a,.7,'façade');
 for(const x of [-10.7,-5.8,-3.3,3.3,5.8,10.7])column(root,mat.ivory,x,18.85,10.4,.6,.19);
 for(const x of [-8,8]){const r=windows.rose(.65);r.position.set(x,7.2,18.72);root.add(r);}
 const niche=new T.Group();niche.position.set(0,7.4,18.72);root.add(niche);ring(niche,mat.ivory,1.3,2.5,.18,0);box(niche,mat.stone,0,-.08,.1,1.7,.2,.7);
 for(const [a,b] of [[-11.35,-9.35],[-6.65,-2.05],[2.05,6.65],[9.35,11.35]])box(root,mat.ivory,(a+b)/2,1.1,18.76,b-a,.18,.4);
 for(const side of [-1,1])box(root,mat.ivory,side*6.7,5.7,18.76,9.3,.18,.4);
 box(root,mat.archLight,0,10.7,18.76,22.7,.12,.45);balustrade(root,22.5,10.95,18.7);
 for(const x of [-8,8]){const g=new T.Group();g.position.x=x;root.add(g);gable(g,5.1,9.6,13,18);roof(g,5.2,5,10,13,15.7);cross(g,mat.ivory,0,13.6,18.15,.6);}
 for(const side of [-1,1]){
  for(const z of BAYS){
   if(z===-27||z===-21)continue;
   const p=new T.Group();p.position.set(side*11,.6,z);p.rotation.y=side*Math.PI/2;root.add(p);
   const doorway=z===3||z===-9;panel(p,mat.wall,6,8.8,.65,[{x:0,y:doorway?0:1.1,w:2.6,h:doorway?5.5:4.4}]);if(!doorway){const w=windows.create(2.6,4.4);w.position.set(0,1.1,.3);p.add(w);}
   const rose=windows.rose(.54);rose.position.set(0,6.6,.72);p.add(rose);
   // An applied pointed arcade gives the lower nave its tall rhythm in the gold reference.
   const arcade=new T.Group();arcade.position.set(0,.3,.65);p.add(arcade);ring(arcade,mat.ivory,5.2,8.2,.09,0);
   if(doorway){col.add(side*11.2,z-2.15,.85,1.7,'side portal pier');col.add(side*11.2,z+2.15,.85,1.7,'side portal pier');}else col.add(side*11.2,z,.85,6,'side wall');
   const upper=new T.Group();upper.position.set(side*6,12.9,z);upper.rotation.y=side*Math.PI/2;root.add(upper);
   panel(upper,mat.wall,6,5.7,.65,[-1.65,0,1.65].map(x=>({x,y:1,w:1.05,h:3.6})));
   for(const x of [-1.65,0,1.65]){const window=windows.create(1.05,3.6);window.position.set(x,1,.3);upper.add(window);}
   for(const y of [0,5.5])box(upper,mat.archLight,0,y,.75,6.25,.12,.38);
   for(const x of [-2.8,2.8])column(upper,mat.ivory,x,.75,5.5,0,.07);
   const rail=new T.Group();rail.position.set(side*6.45,18.75,z);rail.rotation.y=side*Math.PI/2;root.add(rail);balustrade(rail,6,0,0);
  }
  for(let i=0;i<=9;i++){
   const z=-36+i*6;if(z>-30&&z< -18)continue;
   box(root,mat.wall,side*11.55,4.7,z,.8,8.2,.75);box(root,mat.ivory,side*11.65,8.9,z,1.1,.25,.9);box(root,mat.ivory,side*11.6,1,z,1.3,.5,1.2);
   column(root,mat.ivory,side*11.8,z,1.35,9.05,.11);cross(root,mat.ivory,side*11.8,10.65,z,.25);col.add(side*11.6,z,1.2,1,'buttress');
  }
  for(const [a,b] of [[-36,-30],[-18,18]])box(root,mat.archLight,side*11.45,9.25,(a+b)/2,.35,.1,b-a);
 }
 transept(root,col);
 const rear=new T.Group();rear.position.set(0,.6,-36.5);root.add(rear);panel(rear,mat.wall,22,8.8,.65,[{x:-7.8,y:0,w:2.5,h:4.3},{x:0,y:1.4,w:2.7,h:5},{x:7.8,y:0,w:2.5,h:4.3}]);
 const rearWindow=windows.create(2.7,5);rearWindow.position.set(0,1.4,.3);rear.add(rearWindow);
 const rearUpper=new T.Group();rearUpper.position.set(0,9.4,-36.5);root.add(rearUpper);panel(rearUpper,mat.wall,12,9.2,.65,[{x:0,y:1.2,w:3,h:6.3}]);const rw=windows.create(3,6.3);rw.position.set(0,1.2,.3);rearUpper.add(rw);col.add(0,-36.2,22,.9,'apse wall');
 gable(root,12,18.6,22.3,-36.5);gable(root,12,18.6,22.3,11.8);box(root,mat.wall,0,14.6,12.05,12,7.6,.5);
 // Close the sloping aisle end walls, leaving no view through the roof from the rear.
 for(const z of [-36.5,11.8])for(const side of [-1,1]){const s=new T.Shape();s.moveTo(side*6,9.4);s.lineTo(side*11.9,9.4);s.lineTo(side*6,13.35);s.closePath();mesh(extrude(s,.65),mat.wall,root,0,0,z);}
 for(const side of [-1,1])curve(root,mat.ivory,[new T.Vector3(side*6,18.6,-36.65),new T.Vector3(0,22.3,-36.65)],.1);
 basilicaRoof(root);roof(root,22.6,6,10.9,13.2,15);
}
