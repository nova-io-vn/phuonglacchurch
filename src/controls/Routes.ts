import * as T from 'three';
import {isInterior} from '../architecture/config';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
export function cameraRoute(from:T.Vector3,to:T.Vector3){
 const points:T.Vector3[]=[],inside=(p:T.Vector3)=>isInterior(p.x,p.z)&&p.y<22,fi=inside(from),ti=inside(to);
 if(fi&&!ti){if(Math.abs(from.x)>6)points.push(v(from.x,3.05,-20),v(0,3.05,-20));points.push(v(0,3.05,17),v(0,3.05,27));}
 if(!fi&&ti){points.push(v(from.x,48,from.z),v(0,48,27),v(0,3.05,27),v(0,3.05,17));}
 if(fi&&ti&&Math.abs(from.x)>6)points.push(v(from.x,3.05,-20),v(0,3.05,-20));
 if(ti&&Math.abs(to.x)>6)points.push(v(0,3.05,-20),v(to.x,3.05,-20));
 if(!ti){const current=points.at(-1)||from;points.push(v(current.x,Math.max(48,current.y),current.z),v(to.x,Math.max(48,to.y),to.z));}
 points.push(to.clone());return points;
}
