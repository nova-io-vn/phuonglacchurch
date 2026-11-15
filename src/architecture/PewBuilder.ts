import * as T from 'three';
import {mat} from '../materials/palette';
import {box,mesh} from '../utils/geometry';
export function pew(root:T.Object3D,width=2.5){
 box(root,mat.wood,0,1.09,0,width,.17,.72);box(root,mat.wood,0,1.55,.34,width,.85,.13);
 for(const x of [-width*.43,width*.43]){box(root,mat.wood,x,.85,0,.15,.55,.7);box(root,mat.wood,x,1.36,0,.15,.13,.87);mesh(new T.SphereGeometry(.095,8,6),mat.wood,root,x,1.73,.34);}
 box(root,mat.wood,0,.85,-.5,width*.87,.13,.28);for(const x of [-width*.2,width*.2])box(root,mat.wood,x,1.54,.425,.035,.66,.018);
}
