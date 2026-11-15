import {clickUI} from './ui-helpers.mjs';
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:960}}),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
const check=(name,ok)=>{assert.ok(ok,name);checks.push(name);console.log('PASS '+name);};
try{
 await page.goto(process.env.TEST_URL||'http://localhost:5173');await page.waitForFunction(()=>window.__app,{timeout:90000});await page.waitForSelector('#loading',{state:'detached'});
 check('Two distinct gates, each with two moving leaves',await page.evaluate(()=>{const g=window.__app.gates;return g.length===2&&g.every(a=>a.leaves.length===2)&&g[0].kind==='open'&&g[1].kind==='arch';}));
 check('Shrine now has a dry front forecourt setting',await page.evaluate(()=>{const s=window.__app.shrine;return s.columns===3&&s.sideStatues===2&&s.x===18&&s.z===47&&s.onWater===false;}));
 check('Rear spire belongs to rear central block',await page.evaluate(()=>{const s=window.__app.rearSpire;return s.x===0&&s.z< -34&&s.top>34;}));
 await clickUI(page,'#details');check('Dedicated detailed visit panel',await page.locator('#detail-panel').isVisible());
 const visits=[];
 for(let i=0;i<8;i++){
  await clickUI(page,`[data-detail="${i}"]`);visits.push(await page.evaluate(()=>{const a=window.__app;for(let j=0;j<8000&&a.details.moving;j++)a.details.update(.03);return{index:a.details.index,arrived:!a.details.moving,p:a.camera.position.toArray()};}));
  await page.waitForTimeout(300);await page.screenshot({path:`docs/screenshots/${24+i}-detail-${i+1}.png`});
  if(i===1){await clickUI(page,'#detail-gate');await page.evaluate(()=>{const a=window.__app;for(let j=0;j<100;j++)a.gates[1].update(.04);});check('Gate opens from detailed visit controls',await page.evaluate(()=>window.__app.gates[1].angle>1.2));await page.screenshot({path:'docs/screenshots/32-arch-gate-open.png'});}
  if(i===3){await clickUI(page,'#evening');await page.waitForTimeout(500);await page.screenshot({path:'docs/screenshots/33-island-night.png'});await clickUI(page,'#morning');}
 }
 check('All eight detailed viewpoints reached',visits.every(a=>a.arrived));await clickUI(page,'#detail-prev');check('Previous detail works',await page.evaluate(()=>window.__app.details.index===6));await clickUI(page,'#detail-next');check('Next detail works',await page.evaluate(()=>window.__app.details.index===7));await clickUI(page,'#detail-exit');check('Exit returns to overview',await page.evaluate(()=>window.__app.mode==='orbit'));
 await clickUI(page,'[data-view=site]');await page.waitForTimeout(400);await page.screenshot({path:'docs/screenshots/34-expanded-site.png'});
 await page.setViewportSize({width:430,height:900});await clickUI(page,'#details');await page.evaluate(()=>{const a=window.__app;for(let i=0;i<8000&&a.details.moving;i++)a.details.update(.03);});check('Mobile detail panel fits screen',await page.locator('#detail-panel').evaluate(e=>e.getBoundingClientRect().right<=innerWidth));await page.screenshot({path:'docs/screenshots/35-mobile-details.png'});
 check('No runtime or missing asset errors',errors.length===0);await fs.writeFile('docs/details-verification.json',JSON.stringify({date:new Date().toISOString(),checks,visits,errors},null,2));console.log(checks.length+' checks passed');
}catch(e){console.error(e,errors);await page.screenshot({path:'docs/screenshots/details-failure.png'});process.exitCode=1;}finally{await browser.close();}
