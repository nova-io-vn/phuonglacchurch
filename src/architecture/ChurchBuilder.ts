import * as T from 'three';
import {exterior} from './ExteriorWalls';
import {interior} from './InteriorBuilder';
import {tower} from './MainTower';
import {sideTowers} from './SideTowers';
import {GothicDoor} from './GothicDoor';
import {Collision} from '../controls/Collision';
export function buildChurch(root:T.Group,dynamic:T.Group,col:Collision){
 exterior(root,col);tower(root,0,16);sideTowers(root);interior(root,col);
 const doors=[new GothicDoor(0,18.7,3.8,6,root,dynamic),new GothicDoor(-8,18.7,2.5,4.5,root,dynamic),new GothicDoor(8,18.7,2.5,4.5,root,dynamic)];
 for(const side of [-1,1]){for(const z of [3,-9])doors.push(new GothicDoor(side*11.7,z,2.6,5.5,root,dynamic,side*Math.PI/2));doors.push(new GothicDoor(side*19.2,-24,2.2,5.5,root,dynamic,side*Math.PI/2));doors.push(new GothicDoor(side*7.8,-36.65,2.5,4.3,root,dynamic,Math.PI));}
 col.doors=doors;return doors;
}
