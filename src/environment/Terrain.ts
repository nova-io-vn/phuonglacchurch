import * as T from 'three';
import {mat} from '../materials/palette';
import {box,mesh} from '../utils/geometry';
export function terrain(root:T.Group){
 const ground=mesh(new T.PlaneGeometry(1600,1600),mat.grass,root,0,-.13,0);ground.rotation.x=-Math.PI/2;
 box(root,mat.pavement,.5,-.035,3,61,.16,104);
 // Broad stone forecourt and modest planting strips, fitted to the mapped parish footprint.
 for(const side of [-1,1]){box(root,mat.grass,side*26,.12,6,3,.16,30);box(root,mat.ivory,side*24.4,.15,6,.18,.25,30);}
 for(const x of [-13,13])box(root,mat.stone,x,.06,8,.1,.04,69);
 const medallion=mesh(new T.RingGeometry(4.1,4.24,96),mat.stone,root,0,.052,33);medallion.rotation.x=-Math.PI/2;
 for(let i=0;i<8;i++){const a=i*Math.PI/4,b=box(root,mat.stone,Math.sin(a)*2.4,.06,33+Math.cos(a)*2.4,.06,.02,2.9);b.rotation.y=a;}
}
