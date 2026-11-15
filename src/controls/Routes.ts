import * as T from 'three';
import {isInterior} from '../architecture/config';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
export function cameraRoute(from:T.Vector3,to:T.Vector3){
 const points:T.Vector3[]=[],inside=(p:T.Vector3)=>isInterior(p.x,p.z)&&p.y<22,fi=inside(from),ti=inside(to);
 if(fi&&!ti){if(Math.abs(from.x)>6)points.push(v(from.x,3.05,-20),v(0,3.05,-20));points.push(v(0,3.05,17),v(0,3.05,27));}
 if(!fi&&ti){if(from.z<23&&from.y<42)points.push(v(36,Math.max(from.y,8),from.z),v(36,8,30));points.push(v(0,3.05,27),v(0,3.05,17));}
 if(fi&&ti&&Math.abs(from.x)>6)points.push(v(from.x,3.05,-20),v(0,3.05,-20));
 if(ti&&Math.abs(to.x)>6)points.push(v(0,3.05,-20),v(to.x,3.05,-20));
 if(!ti&&to.z<22&&to.y<42){const current=points.at(-1)||from;if(current.z<22&&Math.abs(current.x)<23&&current.y<42)points.push(v(36,Math.max(8,current.y),current.z));points.push(v(36,Math.max(8,to.y),30),v(36,Math.max(8,to.y),to.z));}
 points.push(to.clone());return points;
}
