import * as T from 'three';
let seed=29;
function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
function texture(kind:'stone'|'plaster'|'wood'|'tile', repeat:number){
 const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d')!;
 x.fillStyle=kind==='tile'?'#a45239':kind==='wood'?'#67432e':kind==='stone'?'#b4b0a2':'#ede0b9';x.fillRect(0,0,512,512);
 for(let i=0;i<14000;i++){const n=random();x.fillStyle=`rgba(${n>.5?'255,250,225':'50,40,25'},${random()*.1})`;x.fillRect(random()*512,random()*512,1+random()*3,kind==='wood'?random()*90:1+random()*3);}
 x.strokeStyle=kind==='tile'?'#6b3025':'#8e8a7e';x.lineWidth=kind==='tile'?4:2;
 if(kind==='stone'||kind==='tile')for(let y=0;y<512;y+=kind==='tile'?64:128){x.beginPath();x.moveTo(0,y);x.lineTo(512,y);x.stroke();for(let xx=(y%256?64:0);xx<512;xx+=128){x.beginPath();x.moveTo(xx,y);x.lineTo(xx,y+128);x.stroke();}}
 const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(repeat,repeat);t.anisotropy=8;
 const pixels=x.getImageData(0,0,512,512),normal=document.createElement('canvas'),ao=document.createElement('canvas');normal.width=normal.height=ao.width=ao.height=512;
 const nx=normal.getContext('2d')!,ax=ao.getContext('2d')!,nd=nx.createImageData(512,512),ad=ax.createImageData(512,512);
 const sample=(xx:number,yy:number)=>pixels.data[(((yy+512)%512)*512+(xx+512)%512)*4]/255;
 for(let yy=0;yy<512;yy++)for(let xx=0;xx<512;xx++){const i=(yy*512+xx)*4,dx=(sample(xx-1,yy)-sample(xx+1,yy))*2,dy=(sample(xx,yy-1)-sample(xx,yy+1))*2,v=new T.Vector3(dx,dy,1).normalize();nd.data[i]=(v.x*.5+.5)*255;nd.data[i+1]=(v.y*.5+.5)*255;nd.data[i+2]=(v.z*.5+.5)*255;nd.data[i+3]=255;const shade=Math.min(255,225+sample(xx,yy)*30);ad.data[i]=ad.data[i+1]=ad.data[i+2]=shade;ad.data[i+3]=255;}
 nx.putImageData(nd,0,0);ax.putImageData(ad,0,0);const n=new T.CanvasTexture(normal),a=new T.CanvasTexture(ao);for(const tex of [n,a]){tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(repeat,repeat);tex.anisotropy=8;tex.colorSpace=T.NoColorSpace;}
 return {map:t,normalMap:n,normalScale:new T.Vector2(.45,.45),aoMap:a,aoMapIntensity:.35};
}
export const mat={
 wall:new T.MeshStandardMaterial({color:'#efd79f',...texture('plaster',1),roughness:.93}),
 ivory:new T.MeshStandardMaterial({color:'#f7edda',roughness:.82}),
 dome:new T.MeshStandardMaterial({color:'#b6a16b',roughness:.62,metalness:.18}),
 archLight:new T.MeshStandardMaterial({color:'#e8dbbc',emissive:'#ffd095',emissiveIntensity:.02,roughness:.8}),
 stone:new T.MeshStandardMaterial({color:'#96978e',...texture('stone',1),roughness:.94}),
 pavement:new T.MeshStandardMaterial({color:'#d4cbb8',...texture('stone',18),roughness:.98}),
 floor:new T.MeshPhysicalMaterial({color:'#f4efe2',...texture('stone',12),roughness:.26,metalness:.04,clearcoat:.55,clearcoatRoughness:.2}),
 red:new T.MeshStandardMaterial({color:'#ba654b',...texture('tile',5),roughness:.84,side:T.DoubleSide}),
 wood:new T.MeshStandardMaterial({color:'#79543a',...texture('wood',1),roughness:.65}),
 bronze:new T.MeshStandardMaterial({color:'#9c8050',metalness:.72,roughness:.4}),
 dark:new T.MeshStandardMaterial({color:'#283535',roughness:.88}),
 grass:new T.MeshStandardMaterial({color:'#637a47',roughness:1}),
 leaf:new T.MeshStandardMaterial({color:'#466747',roughness:.95}),
 flower:new T.MeshStandardMaterial({color:'#ba9a93',roughness:.85}),
 glow:new T.MeshStandardMaterial({color:'#ffdf9e',emissive:'#ffc777',emissiveIntensity:.8}),
 glass:['#295f77','#a75239','#c29d48','#527a70','#725b8c'].map(color=>new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.35,metalness:.22,roughness:.3,side:T.DoubleSide})),
};
mat.glass.forEach(m=>m.userData.transmitsLight=true);
export function setGlassNight(night:boolean){mat.glass.forEach(m=>m.emissiveIntensity=night?1.2:.16);mat.glow.emissiveIntensity=night?3:.2;mat.archLight.emissiveIntensity=night?3.5:.02;}
