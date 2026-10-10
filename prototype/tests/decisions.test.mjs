import test from 'node:test';
import assert from 'node:assert/strict';
import {createDecisions,garmentQuestions} from '../lib/decisions.mjs';
import {createOpenAI} from '../lib/openai.mjs';
import {createSpend} from '../lib/spend.mjs';

const memory=()=>{let reserved=0,total=0,rows=[];return {async reserve(v){if(total+reserved+v>45)return false;reserved+=v;return true;},async settle(r,a,row){reserved-=r;total+=a;rows.push(row);},async summary(){return {totalUsd:total,requests:rows.length}}};};

test('garment decision parameters cover category, requested color and closeness',()=>{
 const q=garmentQuestions({category:'Blazer',subtype:'linen blazer',department:'menswear',features:'notched lapel',colour:'olive'});
 assert.deepEqual(q.map(x=>x.name),['same_category','department_ok','has_essentials','colour','closeness']);
 assert.equal(q.at(-1).type,'score');assert.equal(q.at(-1).levels.length,4);
});

test('OpenAI Decisions calls stay server-side, use the fixed model and meter reported token usage',async()=>{
 let sent;const spend=createSpend({env:{},store:memory()});const d=createDecisions({env:{OPENAI_API_KEY:'test-only',DECISIONS_MODEL:'gpt-6-luna'},spend,client:{decide:async(body)=>{sent=body;return {model:body.model,answers:[{name:'closeness',type:'score',score:2.5}],usage:{input_tokens:1000,output_tokens:0}};}}});
 const out=await d.evaluate({input:'A blue linen blazer, product 1 is at https://img.example/1.jpg',questions:[{name:'closeness',type:'score',instructions:'Compare garment',levels:[{label:'low'},{label:'high'}]}]});
 assert.equal(sent.model,'gpt-6-luna');assert.equal(out.answers[0].score,2.5);assert.equal((await spend.summary()).requests,1);
});

test('the Vercel spend guard fails closed without a durable database',async()=>{
 const guard=createSpend({env:{VERCEL:'1'}});let called=false;
 await assert.rejects(guard.run({endpoint:'decisions'},async()=>{called=true;}),e=>e.status===503&&/durable hackathon database/.test(e.message));
 assert.equal(called,false);
});

test('failed model calls release their reservation and never retain request content',async()=>{
 const store=memory(),guard=createSpend({env:{},store});
 await assert.rejects(guard.run({endpoint:'decisions'},async()=>{throw Error('provider error');}));
 assert.equal((await store.summary()).totalUsd,0);
});

test('OpenAI request wrapper keeps the key in the authorization header and parses API JSON',async()=>{
 let request;const client=createOpenAI({apiKey:'secret-test',fetcher:async(url,opts)=>{request={url,opts};return {ok:true,json:async()=>({answers:[],usage:{input_tokens:12}})};}});
 const out=await client.decide({model:'gpt-6-luna',input:'test',questions:[{name:'ok',type:'predicate',instructions:'Is this test?'}]});
 assert.equal(request.url,'https://api.openai.com/v1/decisions');assert.equal(request.opts.headers.Authorization,'Bearer secret-test');assert.equal(out.usage.input_tokens,12);
});
