// menu.js — MÀN HÌNH MỞ GAME (Chơi tiếp · Chơi lại · Cài đặt) + nút bánh răng và bảng CÀI ĐẶT trong game.
// Game tạm dừng (G.paused) khi màn hình đầu đang mở. "Chơi lại" xoá save rồi tải lại trang để mọi thứ bắt đầu sạch.
// Cài đặt âm thanh lưu ở G.audio.cfg (audio.js). Muốn thêm mục cài đặt: thêm 1 hàng vào HTML của #set bên dưới.
(()=>{
const game=document.getElementById('game'),SKIP='xoiBenDua_skipTitle';
const css=document.createElement('style');
css.textContent=`
#title{position:absolute;inset:0;z-index:60;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#9bd0ec;transition:opacity .45s}
#title.out{opacity:0;pointer-events:none}
#title canvas{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated}
#title .box{position:relative;display:flex;flex-direction:column;align-items:center;gap:calc(var(--u)*1.1)}
#title h1{margin:0 0 calc(var(--u)*.2);font-weight:900;font-size:calc(var(--u)*9.5);line-height:1;color:#fff6e4;letter-spacing:.02em;-webkit-text-stroke:calc(var(--u)*.4) #2a1a10;paint-order:stroke fill;text-shadow:0 calc(var(--u)*.7) 0 #6b4423;animation:ttfloat 3.2s ease-in-out infinite}
#title .sub{margin:0 0 calc(var(--u)*1.2);font-weight:800;font-size:calc(var(--u)*2.1);color:#fff6e4;text-shadow:0 2px 0 #2a1a10,0 0 8px #2a1a10aa}
@keyframes ttfloat{50%{transform:translateY(calc(var(--u)*-.8))}}
.tb{width:calc(var(--u)*27);padding:calc(var(--u)*1) calc(var(--u)*1.4);border-radius:calc(var(--u)*1.5);border:3px solid var(--ink);font-weight:800;font-size:calc(var(--u)*2.5);color:#fff;cursor:pointer;line-height:1.15;box-shadow:0 calc(var(--u)*.55) 0 var(--sh)}
.tb small{display:block;font-weight:600;font-size:calc(var(--u)*1.35);opacity:.92;margin-top:calc(var(--u)*.2)}
.tb:active{transform:translateY(calc(var(--u)*.4));box-shadow:0 calc(var(--u)*.15) 0 var(--sh)}
.tb:disabled{opacity:.5;filter:grayscale(.7);cursor:default}
.tb.go{background:linear-gradient(#5cb356,#3b8a40);--sh:#245c2c}
.tb.new{background:linear-gradient(#ea6a52,#c8462e);--sh:#8a2d1c}
.tb.cfg{background:linear-gradient(#fffaf2,#f4e4c4);color:var(--ink);--sh:#b8841c}
#set,#cf{position:absolute;inset:0;z-index:70;display:none;align-items:center;justify-content:center;background:#000a}
#cf{z-index:80}
.sc{width:calc(var(--u)*52);max-width:94%;background:var(--paper);border:3px solid var(--ink);border-radius:calc(var(--u)*2);padding:calc(var(--u)*2) calc(var(--u)*2.4);box-shadow:var(--shadow);display:flex;flex-direction:column;gap:calc(var(--u)*1.3)}
.sc h2{margin:0;text-align:center;font-weight:900;font-size:calc(var(--u)*3);color:var(--ink)}
.sc p{margin:0;text-align:center;font-weight:600;font-size:calc(var(--u)*1.9);line-height:1.4}
.sr{display:flex;align-items:center;gap:calc(var(--u)*1.2);background:var(--paper2);border:2px solid var(--ink);border-radius:calc(var(--u)*1.2);padding:calc(var(--u)*.9) calc(var(--u)*1.3)}
.sr .sl{flex:1;font-weight:800;font-size:calc(var(--u)*2.1)}
.sr input[type=range]{width:calc(var(--u)*17);height:calc(var(--u)*2.4);accent-color:var(--leaf);margin:0}
.sw{min-width:calc(var(--u)*6.6);padding:calc(var(--u)*.55) calc(var(--u)*1);border-radius:99px;border:2px solid var(--ink);font-weight:800;font-size:calc(var(--u)*1.8);cursor:pointer;color:#fff;background:linear-gradient(#5cb356,#3b8a40)}
.sw.off{background:linear-gradient(#b8b0a0,#968e7e)}
.sb{display:flex;gap:calc(var(--u)*1);justify-content:center;flex-wrap:wrap}
.sb button{padding:calc(var(--u)*.9) calc(var(--u)*1.8);border-radius:calc(var(--u)*1.2);border:2px solid var(--ink);font-weight:800;font-size:calc(var(--u)*1.9);cursor:pointer;background:linear-gradient(#fffaf2,#f4e4c4);color:var(--ink);box-shadow:0 2px 0 #1a100866}
.sb button.red{background:linear-gradient(#ea6a52,#c8462e);color:#fff}
.sb button.grn{background:linear-gradient(#5cb356,#3b8a40);color:#fff}
.sb button:active{transform:translateY(2px);box-shadow:none}
#setbtn{position:absolute;top:calc(var(--u)*10.4);right:calc(var(--u)*1.1);z-index:4;width:calc(var(--u)*3.8);height:calc(var(--u)*3.8);padding:0;border-radius:50%;border:2px solid var(--ink);background:linear-gradient(#fffaf2,#f4e4c4);box-shadow:0 2px 0 #1a100866;cursor:pointer;opacity:.88;display:flex;align-items:center;justify-content:center}
#setbtn svg{width:62%;height:62%}
#setbtn:active{transform:translateY(2px);box-shadow:none}`;
document.head.appendChild(css);
const el=(html)=>{const d=document.createElement('div');d.innerHTML=html.trim();return d.firstChild};

// ---- hình nền màn hình đầu: vẽ bằng bộ dựng cảnh quan của game (384×216 rồi phóng to) ----
const art=mkBg(b=>{
 A.sky(b,384,124);A.sun(b,312,42,14);
 A.cloud(b,24,26,1.3);A.cloud(b,150,52,.9);A.cloud(b,232,16,1.1);A.cloud(b,330,76,.8);
 A.hills(b,0,68,384,50,'#a6c4d8',1);A.hills(b,0,84,384,40,'#86b4a2',2);A.hills(b,0,98,384,30,'#6aa86a',3);
 grass(b,112);
 rr(b,0,176,384,24,'#c49a60');for(let x=0;x<384;x+=3)rr(b,x,176+hs(x,1)%3,3,1,'#d8b078');for(let i=0;i<60;i++)rr(b,hs(i,2)%384,180+hs(i,3)%18,2,1,'#a8803e');rr(b,0,176,384,1,'#8a5a30');
 A.tree(b,18,120,'#4a9a3c');A.tree(b,350,126,'#5fb04a');A.tree(b,90,112,'#5fb04a');
 A.hut(b,32,104,52,'#e8c888','#c89a4a');A.hut(b,282,100,58,'#c8e0a8','#c89a4a');
 [['rau_muong',4],['ca_chua',4],['chanh',4],['ca_rot',3]].forEach(([k,st],i)=>{const x=10+i*28,y=154;rr(b,x,y,24,24,'#3a2a1c');rr(b,x+1,y+1,22,22,'#5a3a20');const sp=G.plantSprite(k,st);b.drawImage(sp,x+12-sp.width/2,y+23-sp.height)});
 [[128,150],[256,132],[60,196],[320,164]].forEach(([x,y],i)=>A.bush(b,x,y,i%2?'#5fb04a':'#4a9a3c'));
 for(let i=0;i<22;i++)A.flower(b,hs(i,7)%380,118+hs(i,8)%90,['#f2d04a','#f6b0c0','#fff','#b8a0e8'][i%4]);
 A.lantern(b,98,120,'#f2a82a');
},384,216);

const prog=()=>{const S=G.S;return S.day>1||S.served>0||S.plotsOpen>10||S.tier>0||S.money!==80||(S.stat&&S.stat.plant>0)||S.plots.some(Boolean)};
const sum=()=>{const S=G.S;return `Ngày ${S.day} · ${S.money} xu`};

const title=el(`<div id="title"><div class="box"><h1>Xóm Chanh</h1><div class="sub">Trồng trọt · Nấu ăn · Bán hàng rong</div>
 <button class="tb go" data-a="go">Chơi tiếp<small></small></button>
 <button class="tb new" data-a="new">Chơi lại<small>Bắt đầu một ván mới</small></button>
 <button class="tb cfg" data-a="cfg">Cài đặt</button></div></div>`);
title.insertBefore(art,title.firstChild);
const goBtn=title.querySelector('[data-a=go]');
const refreshTitle=()=>{const p=prog();goBtn.disabled=!p;goBtn.querySelector('small').textContent=p?sum():'Chưa có ván nào được lưu'};

// ---- bảng cài đặt ----
const set=el(`<div id="set"><div class="sc"><h2>Cài đặt</h2>
 <div class="sr"><span class="sl">Nhạc nền</span><input type="range" min="0" max="100" data-v="mVol"><button class="sw" data-t="mOn"></button></div>
 <div class="sr"><span class="sl">Hiệu ứng</span><input type="range" min="0" max="100" data-v="sVol"><button class="sw" data-t="sOn"></button></div>
 <div class="sb"><button data-a="home">Màn hình chính</button><button class="red" data-a="new">Chơi lại</button><button class="grn" data-a="close">Đóng</button></div></div></div>`);
const cf=el(`<div id="cf"><div class="sc"><h2>Chơi lại từ đầu?</h2><p>Toàn bộ tiến trình hiện tại (tiền, ruộng, công thức, quán…) sẽ bị xoá và không lấy lại được.</p>
 <div class="sb"><button data-a="no">Giữ ván này</button><button class="red" data-a="yes">Xoá và chơi lại</button></div></div></div>`);
const cfg=()=>G.audio.cfg;
const syncSet=()=>{set.querySelectorAll('[data-v]').forEach(i=>{i.value=Math.round(cfg()[i.dataset.v]*100)});
 set.querySelectorAll('[data-t]').forEach(b=>{const on=cfg()[b.dataset.t];b.textContent=on?'Bật':'Tắt';b.classList.toggle('off',!on)})};
set.addEventListener('input',e=>{const i=e.target.closest('[data-v]');if(!i)return;G.audio.ensure();cfg()[i.dataset.v]=i.value/100;G.audio.apply()});
set.addEventListener('change',e=>{if(e.target.closest('[data-v]'))G.audio.save()});
const openSet=()=>{syncSet();set.style.display='flex'};
const closeSet=()=>{set.style.display='none'};

// ---- hành động ----
const hideTitle=()=>{title.classList.add('out');G.paused=false;setTimeout(()=>{title.style.display='none'},500)};
const showTitle=()=>{closeSet();refreshTitle();title.style.display='flex';void title.offsetWidth;title.classList.remove('out');G.paused=true};
const resetAll=()=>{G.save=()=>{};try{localStorage.removeItem(G.KEY)}catch(e){}try{sessionStorage.setItem(SKIP,'1')}catch(e){}location.reload()};
const askNew=()=>{if(!prog()){hideTitle();closeSet();return}cf.style.display='flex'};
const act=a=>{G.audio.ensure();
 if(a==='go'&&prog())hideTitle();
 else if(a==='new')askNew();
 else if(a==='cfg')openSet();
 else if(a==='close')closeSet();
 else if(a==='home')showTitle();
 else if(a==='yes')resetAll();
 else if(a==='no')cf.style.display='none'};
[title,set,cf].forEach(root=>root.addEventListener('click',e=>{const t=e.target.closest('[data-t]');if(t){G.audio.ensure();cfg()[t.dataset.t]=!cfg()[t.dataset.t];G.audio.apply();G.audio.save();syncSet();return}
 const b=e.target.closest('[data-a]');if(b)act(b.dataset.a);else if(root!==title&&e.target===root)root.style.display='none'}));

// ---- nút bánh răng ----
const gear=el(`<button id="setbtn" type="button" title="Cài đặt" aria-label="Cài đặt"><svg viewBox="0 0 24 24" fill="none" stroke="#2a1a10" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button>`);
gear.addEventListener('click',()=>{G.audio.ensure();openSet()});

game.appendChild(gear);game.appendChild(title);game.appendChild(set);game.appendChild(cf);
let skip=false;try{skip=sessionStorage.getItem(SKIP)==='1';sessionStorage.removeItem(SKIP)}catch(e){}
if(skip){title.style.display='none'}else{refreshTitle();G.paused=true}
})();
