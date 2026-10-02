import { readFile } from 'node:fs/promises';
import { createGameServer } from './dev-game.mjs';
import { installFixture, createArtworkFixture } from './browser-fixture.mjs';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import {decodeFunctionData,encodeFunctionResult,parseAbi} from 'viem';
const server = createGameServer(new URL('../../../outputs/site/',import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1'));
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});
try {
  for(const width of [1100,390]) {
    const page=await browser.newPage({viewport:{width,height:850},hasTouch:width<500,reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const fixture=await installFixture(page,origin,{artworkCall:await createArtworkFixture()});
    const profileAbi=parseAbi(['function activationManager() view returns (address)','function positions(address collection,uint256 tokenId) view returns (uint8 tier,uint256 weight)']);
    await page.route('https://rpc.mainnet.chain.robinhood.com/**',async route=>{
      const req=route.request().postDataJSON();
      let decoded;try {if(req?.method!=='eth_call')return route.fallback();decoded=decodeFunctionData({abi:profileAbi,data:req.params[0].data});}catch{return route.fallback();}
      const result=decoded.functionName==='positions'?[0,1n]:'0xD4A35e11318E3679168d409184B788bcF9F283Ac';
      await route.fulfill({json:{jsonrpc:'2.0',id:req.id,result:encodeFunctionResult({abi:profileAbi,functionName:decoded.functionName,result})}});
    });
    await page.goto(origin);
    await page.getByRole('button',{name:/^Connect (wallet|Browser wallet)$/}).click();
    await page.getByRole('button',{name:/^Friend #7730\b/}).click();
    await page.frameLocator('iframe').locator('#root > *').first().waitFor();
    await page.frameLocator('iframe').getByText('Waiting for your Friend…',{exact:true}).waitFor({state:'hidden'});
    assert(fixture.ownerReads>=2);
    assert.equal(await page.locator('iframe').getAttribute('sandbox'),'allow-scripts');
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');
    assert.equal(await page.locator('.race-fullscreen').count(),1);
    await page.locator('.race-fullscreen').click();
    assert.equal(await page.locator('.race-focus').count(),1);
    assert.deepEqual([...errors,...fixture.errors],[]);
    console.log(`PASS public files ${width}px: owner discovery, fresh eligibility, sandbox, fullscreen retained.`);
    await page.close();
  }
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
