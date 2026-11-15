/** Optional tools now live in the closed More sheet on all viewport sizes. */
export async function clickUI(page,selector,options){
 const element=page.locator(selector).first();
 if(await element.count()&&!await element.isVisible()&&await element.evaluate(e=>!!e.closest('#more-panel')))await page.click('#more');
 return page.click(selector,options);
}
