import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1440,height:960}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
try{
 await page.goto('http://localhost:4173');await page.waitForFunction(()=>window.__app,{timeout:90000});await page.waitForSelector('#loading',{state:'detached'});await page.addStyleTag({content:'#toast{display:none!important}'});
 await page.click('#walk');await page.click('#lock');await page.keyboard.down('KeyW');await page.waitForTimeout(600);await page.keyboard.up('KeyW');assert.ok(await page.evaluate(()=>window.__app.camera.position.z<26.7));await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.pointerLockElement);await page.click('#orbit');
 await page.waitForTimeout(650);await page.screenshot({path:'docs/screenshots/14-production.png'});
 for(const [view,name] of [['left','03-left-day'],['right','04-right-day']]){await page.click(`[data-view=${view}]`);await page.waitForTimeout(400);assert.ok(await page.evaluate(()=>{const c=window.__app.camera,p=c.position.clone().set(0,39,16).project(c);return p.y<.86;}));await page.screenshot({path:`docs/screenshots/${name}.png`});}
 await page.click('#reset');await page.waitForTimeout(350);
 // Neutral material review of integrated massing, deliberately labelled as such.
 await page.evaluate(()=>{const a=window.__app;let source;a.scene.traverse(o=>{if(!source&&o.isMesh&&o.material.isMeshStandardMaterial)source=o.material;if(o.isMesh&&o.material.isShaderMaterial)o.visible=false;});const clay=source.clone();clay.map=clay.normalMap=clay.aoMap=null;clay.color.set('#d6cbb0');clay.emissive.set(0);clay.roughness=1;a.scene.overrideMaterial=clay;a.scene.background=clay.color.clone().set('#e5e7df');});
 await page.screenshot({path:'docs/screenshots/00-massing-overview.png'});await page.click('[data-view=front]');await page.screenshot({path:'docs/screenshots/00-massing-front.png'});
 assert.deepEqual(errors,[]);const result={productionURL:'http://localhost:4173',checks:['Production loads','Production WASD movement','Production ESC unlock','Overview screenshot','Neutral massing review front and 3/4','No errors or missing assets'],errors};await fs.writeFile('docs/production-verification.json',JSON.stringify(result,null,2));console.log(result);
}finally{await browser.close();}
