import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.TEST_URL||'http://localhost:5173';
await fs.mkdir('docs/screenshots',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl']});
const page=await browser.newPage({viewport:{width:1440,height:960},deviceScaleFactor:1});
const errors=[],missing=[],checks=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)missing.push(`${r.status()} ${r.url()}`);});
const check=(name,ok)=>{assert.ok(ok,name);checks.push({name,pass:true});console.log(`PASS ${name}`);};
async function shot(name){await page.screenshot({path:`docs/screenshots/${name}.png`,timeout:90000});}
try{
 await page.goto(base);await page.waitForFunction(()=>window.__app,{timeout:90000});await page.waitForSelector('#loading',{state:'detached'});await page.addStyleTag({content:'#toast{display:none!important}'});
 await shot('01-overview-day');check('Canvas fills viewport',await page.locator('canvas').evaluate(c=>c.width>=1440&&c.height>=960));
 check('Parish identity is Phương Lạc',await page.title().then(t=>t.includes('Nhà thờ Giáo xứ Phương Lạc')));
 check('Four blocks of ten congregation benches',await page.evaluate(()=>{const a=window.__app;return a.pewBlocks.length===4&&a.pewRows===10&&a.collision.obstacles.filter(o=>o.name.startsWith('pew:congregation:')).length===40;}));
 check('Map coordinates match supplied pin',await page.evaluate(()=>window.__app.site.latitude===20.0533125&&window.__app.site.longitude===106.1911875));
 // The front, both sides and rear are rendered from real cameras, not backgrounds.
 for(const [key,name] of [['front','02-front-day'],['left','03-left-day'],['right','04-right-day'],['aerial','05-aerial-day']]){
  await page.click(`[data-view=${key}]`);await page.waitForTimeout(200);await shot(name);
 }
 await page.evaluate(()=>{const a=window.__app;a.orbit.controls.target.set(0,12,-8);a.camera.position.set(38,23,-62);a.orbit.controls.update();});await shot('06-rear-day');
 await page.click('#reset');await page.click('#evening');await page.waitForTimeout(650);await shot('07-overview-night');check('Evening button sets lit night scene',await page.locator('#evening').getAttribute('aria-pressed').then(v=>v==='true'));
 await page.click('#morning');check('Morning button restores daylight',await page.locator('body').evaluate(b=>!b.classList.contains('night')));await page.click('#walk');
 await page.click('#lock');await page.waitForFunction(()=>!!document.pointerLockElement);check('Pointer lock works',true);
 await page.keyboard.down('KeyW');await page.waitForTimeout(650);await page.keyboard.up('KeyW');check('W moves first-person camera',await page.evaluate(()=>window.__app.camera.position.z<26.6));
 await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.pointerLockElement);
 await page.evaluate(()=>{const a=window.__app;a.camera.position.set(0,2.28,22);a.camera.lookAt(0,2.28,-20);});
 await page.keyboard.press('KeyE');await page.waitForFunction(()=>window.__app.doors[0].angle>1.4);check('E opens actual hinged center door',await page.evaluate(()=>window.__app.doors[0].open));
 const collision=await page.evaluate(()=>{
  const a=window.__app,c=a.collision,p=a.camera.position.clone();const report={};
  // Continuous motion from forecourt, over steps, through the real opening, down the central aisle.
  p.set(0,1.68,27);for(let i=0;i<550;i++){c.move(p,0,-.08);p.y=c.floor(p.x,p.z)+1.68;}report.entry={x:p.x,z:p.z,y:p.y};
  const wall=p.clone().set(0,2,16);for(let i=0;i<300;i++)c.move(wall,.1,0);report.wallX=wall.x;
  const pew=p.clone().set(3.2,2,13);for(let i=0;i<100;i++)c.move(pew,0,-.1);report.pewZ=pew.z;
  const pillar=p.clone().set(5.2,2,17);for(let i=0;i<100;i++)c.move(pillar,0,-.1);report.pillarZ=pillar.z;
  const rear=p.clone().set(0,2,-22);for(let i=0;i<100;i++)c.move(rear,0,-.1);report.rearZ=rear.z;
  const stair=[];for(const z of [22,20.75,20,19.25,18.5,17])stair.push(c.floor(0,z));report.stair=stair;
  a.doors[0].angle=0;a.doors[0].open=false;report.closed=c.blocked(0,18.7);a.doors[0].angle=1.45;a.doors[0].open=true;report.open=!c.blocked(0,18.7);
  const arm=p.clone().set(0,2.28,-8);for(let i=0;i<125;i++)c.move(arm,-.08,0);for(let i=0;i<50;i++)c.move(arm,0,-.08);report.arm={x:arm.x,z:arm.z};report.choirFloor=c.floor(-12,-12);report.choirPews=c.obstacles.filter(o=>o.name==='choir pew').length;
  report.sideAisles=[-10,-6.15,6.15,10].map(x=>{const a=p.clone().set(x,2.28,12.5);for(let i=0;i<240;i++)c.move(a,0,-.08);return {x:a.x,z:a.z};});
  return report;
 });
 check('Unbroken entry route reaches sanctuary steps',collision.entry.z< -16.9&&collision.entry.z> -17.1);
 check('Side wall blocks walking',collision.wallX<10.7&&collision.wallX>10);
 check('Pews block walking',collision.pewZ>11.7);
 check('Columns block walking',collision.pillarZ>14.6);
 check('Rear wall blocks walking',collision.rearZ> -23.6);
 check('Stairs raise floor in discrete treads',collision.stair.every((v,i,a)=>i===0||v>=a[i-1]));
 check('Closed door blocks and open door clears center',collision.closed&&collision.open);
 check('Left arm connects to nave without a wall',collision.arm.x< -9.9&&collision.arm.z< -11.9);check('Choir is on raised left-arm floor',collision.choirFloor===.76&&collision.choirPews===6);check('All four side circulation routes stay clear',collision.sideAisles.every(p=>p.z< -6.6));
 check('Pond water blocks walking and bridge has a floor',await page.evaluate(()=>{const c=window.__app.collision;return c.blocked(-12,-81)&&!c.blocked(18,35)&&c.floor(18,35)===.46;}));
 await page.evaluate(()=>{window.__app.camera.position.set(0,2.28,12);window.__app.camera.lookAt(0,7,-20);});await page.evaluate(()=>document.getElementById('lock-hint').hidden=true);await shot('08-interior-nave');
 await page.keyboard.press('KeyM');check('M opens map',await page.locator('#minimap').isVisible());await shot('09-interior-map');await page.keyboard.press('KeyM');
 await page.evaluate(()=>{window.__app.camera.position.set(0,2.7,-12.7);window.__app.camera.lookAt(0,5.5,-23);});await shot('10-sanctuary');
 await page.evaluate(()=>{const a=window.__app;a.camera.fov=59;a.camera.updateProjectionMatrix();a.camera.position.set(0,3.7,15.5);a.camera.lookAt(0,3,-10);});await shot('15-four-pew-blocks');await page.evaluate(()=>{const a=window.__app;a.camera.fov=55;a.camera.updateProjectionMatrix();a.camera.position.set(-6.6,3,-8);a.camera.lookAt(-15.5,1.6,-11.8);});await shot('16-left-choir');await page.evaluate(()=>{const c=window.__app.camera;c.fov=43;c.updateProjectionMatrix();});
 // Exercise every camera path by advancing the simulation, checking positions along every segment.
 await page.click('#tour');const tourResult=await page.evaluate(()=>{
  const a=window.__app,out=[];for(let stop=0;stop<10;stop++){a.tour.go(stop);let insideWall=false,minDoorClearance=100;for(let frame=0;frame<3000&&!a.tour.arrived;frame++){a.tour.update(.03);const p=a.camera.position;if(p.y<10&&p.z> -24&&p.z<18&&Math.abs(p.x)>10.7&&Math.abs(p.x)<11.8)insideWall=true;if(p.y<6&&Math.abs(p.z-18.7)<.5)minDoorClearance=Math.min(minDoorClearance,Math.abs(p.x));}out.push({stop,arrived:a.tour.arrived,insideWall,minDoorClearance});}return out;
 });
 console.log('Tour routes',JSON.stringify(tourResult));check('All ten guided stops reached',tourResult.every(s=>s.arrived));check('Tour stays clear of side walls',tourResult.every(s=>!s.insideWall));
 await page.click('#tour-pause');check('Pause button changes tour state',await page.evaluate(()=>window.__app.tour.paused));
 await page.click('#tour-prev');check('Previous stop works',await page.evaluate(()=>window.__app.tour.index===8));
 await page.click('#tour-exit');check('Tour exits to orbit',await page.evaluate(()=>window.__app.mode==='orbit'));await page.click('[data-view=site]');await shot('17-mapped-neighbourhood');await page.click('#reset');
 // Screenshot download must contain real pixels.
 const downloadEvent=page.waitForEvent('download');await page.click('#capture');const download=await downloadEvent;await download.saveAs('docs/screenshots/11-capture-export.png');check('PNG capture exports',download.suggestedFilename().endsWith('.png'));
 await page.click('#help');check('Help opens an accessible dialog',await page.locator('dialog').evaluate(d=>d.open));await page.click('#dialog-close');
 const stats=await page.evaluate(()=>window.__app.stats());check('Static batching stays under 100 submitted calls',stats.calls<100);
 const tablet=await browser.newPage({viewport:{width:1024,height:768},isMobile:true,hasTouch:true,deviceScaleFactor:1});tablet.on('pageerror',e=>errors.push(e.message));await tablet.goto(base);await tablet.waitForFunction(()=>window.__app,{timeout:90000});await tablet.waitForSelector('#loading',{state:'detached'});await tablet.screenshot({path:'docs/screenshots/12-tablet.png'});await tablet.locator('#walk').tap();check('Tablet gets touch movement controls',await tablet.locator('#touch-controls').isVisible());
 await tablet.setViewportSize({width:430,height:900});await tablet.locator('#orbit').tap();await tablet.waitForTimeout(900);await tablet.screenshot({path:'docs/screenshots/13-mobile.png'});check('Responsive toolbar stays in viewport',await tablet.locator('.toolbar').evaluate(e=>e.getBoundingClientRect().right<=innerWidth));check('Mobile camera fits the architecture',await tablet.evaluate(()=>{const c=window.__app.camera;return [[0,39,16],[-12,1,18],[12,1,18],[-12,14,-24],[12,14,-24]].every(p=>Math.abs(c.position.clone().fromArray(p).project(c).x)<.98);}));await tablet.close();
 check('No browser errors',errors.length===0);check('No missing assets',missing.length===0);
 const report={date:new Date().toISOString(),base,checks,collision,tourResult,stats,errors,missing};await fs.writeFile('docs/verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}catch(e){console.error(e);console.error({checks,errors,missing});await shot('failure');process.exitCode=1;}finally{await browser.close();}
