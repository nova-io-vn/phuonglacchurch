import * as T from 'three';
import {mat} from '../materials/palette';
import {box,cross,rod} from '../utils/geometry';
import {pew} from './PewBuilder';
import {Collision} from '../controls/Collision';
export function choirAndPrayer(root:T.Group,col:Collision){
 // -X is left when looking from the entrance toward the sanctuary.
 box(root,mat.wood,-14.9,.68,-24,6.6,.16,10.5);
 for(const x of [-16.8,-14.7])for(const z of [-27.4,-23.8,-20.2]){const g=new T.Group();g.position.set(x,.16,z);g.rotation.y=-Math.PI/2;root.add(g);pew(g,2.6);col.add(x,z,1.25,2.8,'choir pew');}
 for(const z of [-26.3,-22]){rod(root,mat.dark,new T.Vector3(-12.8,.78,z),new T.Vector3(-12.8,1.95,z),.026);box(root,mat.dark,-12.8,.8,z,.7,.05,.5);const desk=box(root,mat.dark,-12.8,2,z,.07,.65,.88);desk.rotation.z=-.3;col.add(-12.8,z,.7,1,'music stand');}
 const keyboard=new T.Group();keyboard.position.set(-15.2,.16,-19.1);root.add(keyboard);
 box(keyboard,mat.wood,0,1.37,0,2.3,.45,.8);box(keyboard,mat.wood,0,1.95,.31,2.3,.75,.15);
 for(let i=0;i<28;i++){box(keyboard,mat.ivory,-1.05+i*.077,1.62,-.13,.07,.055,.48);if(![2,6].includes(i%7))box(keyboard,mat.dark,-1.01+i*.077,1.66,.02,.038,.055,.28);}
 for(const x of [-.85,.85])box(keyboard,mat.wood,x,1.03,.2,.18,.65,.4);box(keyboard,mat.wood,0,.8,-.8,1.2,.14,.45);col.add(-15.2,-19.1,2.6,1.8,'organ');
 cross(root,mat.bronze,-18.2,5,-24,.9);
 box(root,mat.ivory,17.4,1.3,-24,1.2,1.4,3);cross(root,mat.wood,18,5,-24,1.4);col.add(17.4,-24,1.5,3.3,'prayer altar');
 for(const z of [-27.2,-20.8]){const g=new T.Group();g.position.set(14,0,z);g.rotation.y=Math.PI/2;root.add(g);pew(g,2.5);col.add(14,z,1.25,2.7,'prayer pew');}
}
