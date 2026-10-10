import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../dist/sticker-studio.js',import.meta.url),'utf8');
function studio(){
 const ctx={window:{addEventListener(){}},document:{addEventListener(){},fonts:{ready:{then(){}}}},setInterval(){},setTimeout(){},clearTimeout(){},clearInterval(){}};
 vm.runInNewContext(source,ctx);return {ui:ctx.window.StickerStudio,window:ctx.window};
}
test('Discover sections are independent routes with a single current section',()=>{
 const {ui}=studio();for(const active of ['home','ask','mall','community']){const html=ui.subnav(active);assert.equal((html.match(/aria-current="page"/g)||[]).length,1);for(const hash of ['#discover','#discover/ask','#discover/mall','#discover/community'])assert.ok(html.includes(`href="${hash}"`));}
});
test('welcome uses available account actions and escapes server errors',()=>{
 const {ui}=studio();let html=ui.welcome({google:true,preview:false,busy:false,error:'<script>bad</script>'});assert.ok(html.includes('/api/auth/google'));assert.ok(!html.includes('data-ob="preview"'));assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>'));
 html=ui.welcome({google:false,preview:true,busy:true,error:''});assert.match(html,/data-ob="preview" disabled/);assert.ok(!html.includes('/api/auth/google'));
});
test('passport shows actual visits without inventing server rewards',()=>{
 const {ui}=studio();const html=ui.passport(['Everyday','Streetwear'],new Set(['Streetwear']));assert.match(html,/1 of 2 districts explored/);assert.match(html,/Streetwear: visited/);assert.match(html,/Everyday: not visited/);assert.match(html,/Visits saved on this device/);assert.doesNotMatch(html,/badge|XP|credits/);
});
test('home escapes profile names and reuses existing saved-chat renderer',()=>{
 const {ui,window}=studio();window.TBWAccount={profile:{name:'<img>'}};window.DiscoverConversation={homeChats:()=>'<nav>Saved search</nav>'};const html=ui.home();assert.match(html,/&lt;img&gt;/);assert.match(html,/<nav>Saved search<\/nav>/);assert.doesNotMatch(html,/<img>/);
});
test('look photo loading never uses an unrelated static placeholder',()=>{
 const {ui}=studio();const html=ui.lookArt({who:'Actor',label:'A gold aviator look'});assert.match(html,/Finding a web photo/);assert.doesNotMatch(html,/assets\/|<img/);
});

test('Mall map uses the interior floor plan and keeps all district entrances, visits and list view',()=>{
 const {ui}=studio();const categories=['Everyday','Graphics','Streetwear'];
 const brands=[{category:'Everyday'},{category:'Graphics'},{category:'Streetwear'}];
 const html=ui.mallMap(categories,categories,brands,new Set(['Graphics']),new Set(['Streetwear']),'<span class="mall-avatar">walker</span>');
 assert.match(html,/mall-scene ss-mall-scene/);assert.match(html,/mall-lane-floor ss-district-floor/);
 assert.equal((html.match(/data-mall="category"/g)||[]).length,3);
 assert.equal((html.match(/mall-lane-entry/g)||[]).length,3);
 assert.match(html,/mall-avatar/);assert.match(html,/MEETING POINT/);assert.match(html,/Visited/);assert.match(html,/For you/);
 assert.match(html,/aria-label="Enter Graphics, 1 stores"/);assert.match(html,/data-studio="mall-view" data-value="list"/);
 assert.doesNotMatch(html,/data-tilt/);
});

test('fashion thumbnails respect gender-specific districts and show both ethnic traditions',()=>{
 const {ui}=studio();
 const mens=ui.fashionArt('Menswear and smart casual');
 assert.equal((mens.match(/data-fashion-gender="male"/g)||[]).length,2);
 assert.doesNotMatch(mens,/data-fashion-gender="female"/);
 const women=ui.fashionArt('Contemporary and womenswear');
 assert.equal((women.match(/data-fashion-gender="female"/g)||[]).length,2);
 assert.doesNotMatch(women,/data-fashion-gender="male"/);
 const ethnic=ui.fashionArt('Ethnic and craft');
 assert.match(ethnic,/data-fashion-gender="male" data-fashion-outfit="kurta"/);
 assert.match(ethnic,/data-fashion-gender="female" data-fashion-outfit="saree"/);
 assert.doesNotMatch(ui.fashionArt('Ethnic and craft','Sarees'),/data-fashion-gender="male"/);
 assert.equal((ui.fashionArt('Ethnic and craft','Kurtas & sets').match(/data-fashion-outfit="kurta"/g)||[]).length,2);
 assert.match(ethnic,/aria-hidden="true"/);assert.doesNotMatch(ethnic,/<img|https?:/);
 assert.match(ui.fashionArt('Fandom and graphics'),/data-fashion-outfit="graphic"/);
 assert.match(ui.fashionArt('Streetwear and denim'),/data-fashion-outfit="hoodie"/);
 assert.match(ui.fashionArt('Activewear and inclusive fits'),/data-fashion-outfit="sport"/);
});
