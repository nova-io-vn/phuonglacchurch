import * as T from 'three';
export class Sky {
 mesh:T.Mesh;material:T.ShaderMaterial;
 constructor(scene:T.Scene){
  this.material=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{top:{value:new T.Color('#659bc1')},bottom:{value:new T.Color('#d8dfd5')},time:{value:0},night:{value:0}},vertexShader:'varying vec3 v; void main(){v=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`
   varying vec3 v; uniform vec3 top; uniform vec3 bottom; uniform float time; uniform float night;
   float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
   float noise(vec2 p){vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
   float fbm(vec2 p){return noise(p)*.5+noise(p*2.03)*.25+noise(p*4.1)*.125+noise(p*8.1)*.0625;}
   void main(){vec3 d=normalize(v);float h=max(d.y,0.);vec3 c=mix(bottom,top,pow(smoothstep(-.06,.65,h),.65));
    vec2 p=d.xz/(h+.25)*2.+vec2(time*.004,0.);float clouds=smoothstep(.43,.73,fbm(p))*smoothstep(.01,.18,h)*(1.-night)*.62;c=mix(c,vec3(.86,.88,.86),clouds);
    float sun=pow(max(0.,dot(d,normalize(vec3(32.,44.,-48.)))),900.);c+=vec3(1.,.8,.45)*sun*(1.-night)*1.4;
    float stars=step(.9984,hash(floor(d.xz/(h+.2)*850.)))*smoothstep(.1,.5,h);c+=vec3(.3,.36,.43)*stars*night;
    float moon=smoothstep(.9991,.9995,dot(d,normalize(vec3(-.4,.65,.3))));c+=vec3(.8,.83,.9)*moon*night;
    gl_FragColor=vec4(c,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
   }`});
  this.mesh=new T.Mesh(new T.SphereGeometry(900,32,16),this.material);this.mesh.frustumCulled=false;scene.add(this.mesh);
 }
 set(night:boolean){this.material.uniforms.night.value=night?1:0;this.material.uniforms.top.value.set(night?'#050d21':'#659bc1');this.material.uniforms.bottom.value.set(night?'#182330':'#d8dfd5');}
 update(time:number){this.material.uniforms.time.value=time;}
}
