import * as T from 'three';
import {tower} from './MainTower';
export function sideTowers(root:T.Group){tower(root,-8,16,true);tower(root,8,16,true);}
