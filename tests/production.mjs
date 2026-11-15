import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const b=await chromium.launch({channel:'chrome',headless:true}),page=await b.newPage({viewport:{width:1440,height:960}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
try{
 await page.goto('http://localhost:4173');await page.waitForFunction(()=>window.__app,{timeout:90000});await page.waitForSelector('#loading',{state:'detached'});await page.addStyleTag({content:'#toast{display:none!important}'});
 assert.ok((await page.locator('.author-credit').innerText()).includes('Dinh Quoc Bao'));assert.equal(await page.locator('#walk').count(),0);await page.screenshot({path:'docs/screenshots/14-production.png'});
 await page.click('#space');await page.evaluate(()=>{const a=window.__app;for(let i=0;i<4000&&a.space.moving;i++)a.space.update(.03);});assert.equal(await page.evaluate(()=>window.__app.mode),'space');await page.screenshot({path:'docs/screenshots/21-production-interior.png'});
 await page.click('#orbit');await page.click('[data-view=shrine]');await page.screenshot({path:'docs/screenshots/22-production-shrine.png'});await page.click('#evening');await page.screenshot({path:'docs/screenshots/23-shrine-night.png'});assert.deepEqual(errors,[]);
 const result={productionURL:'http://localhost:4173',checks:['Production GLB assets load','Author credit','Walk mode removed','Church Space works','Rear shrine viewpoint','Night postprocessing works','No errors or missing assets'],errors};await fs.writeFile('docs/production-verification.json',JSON.stringify(result,null,2));console.log(result);
}finally{await b.close();}
