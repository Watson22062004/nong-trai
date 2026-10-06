// GIAO DIỆN HTML (HUD, thanh chọn khu, bảng mua/bán/nấu) + VÒNG LẶP
const $=s=>document.querySelector(s);
const L=(id,n)=>`<span class="name">${G.ic(id)}<span><b>${G.ITEMS[id].n}</b>${n!=null?` <b class="n">×${n}</b>`:''}</span></span>`;
const bar=(v,m,w)=>`<div class="bar ${w?'warn':''}"><i style="width:${Math.min(100,v/m*100)}%"></i></div>`;
const B=(a,id,t,c='')=>`<button class="btn ${c}" data-act="${a}" data-id="${id}">${t}</button>`;
const price=p=>`${G.ic('coin')}${p}`;
const need=r=>`<div class="ing">${Object.entries(G.RECIPES[r].need).map(([k,n])=>`<span class="${G.has(k,n)?'':'lack'}">${G.ic(k)}×${n}</span>`).join('')}</div>`;
const buyList=ids=>ids.map(k=>`<div class="row">${L(k,G.S.inv[k]||0)}${B('buy',k,price(G.ITEMS[k].buy),'gold')}</div>`).join('');
const TITLE={seeds:'Hạt giống',ing:'Nguyên liệu',animals:'Vật nuôi',sell:'Thu mua',cook:'Bếp',bag:'Túi đồ'};
const SUB={seeds:'Gieo ở ô đất trên trại',ing:'Dùng khi nấu xôi',animals:'Dẫn về chuồng bên phải',sell:'Bán nông sản và món',cook:'Chạm Nấu khi đủ nguyên liệu',bag:'Cầm đồ hoặc gắn vào 8 ô'};
const M={
 seeds:()=>buyList(Object.keys(G.CROPS).map(k=>'hat_'+k)),
 ing:()=>buyList(['cam','duong','muoi']),
 animals:()=>Object.keys(G.ANIMALS).map(k=>{const a=G.ANIMALS[k];return `<div class="row"><span class="name">${G.ic(k)}<span>${a.n}<small>${a.time} giây ra ${G.ITEMS[a.make].n.toLowerCase()}</small></span></span>${B('animal',k,price(a.cost),'gold')}</div>`}).join('')+`<p class="hint">Đang nuôi ${G.S.animals.length}/${G.CFG.maxAnimals}</p>`,
 sell:()=>{const inv=Object.entries(G.S.inv);return inv.length?inv.map(([k,n])=>`<div class="row">${L(k,n)}<span class="acts">${B('sell',k,'Bán 1 · '+price(G.ITEMS[k].sell),'gold')} ${B('sellall',k,'Bán hết')}</span></div>`).join(''):'<p class="empty">Kho trống, đi thu hoạch trước đã.</p>'},
 cook:()=>{const S=G.S;let h='';S.cooking.forEach((q,i)=>h+=`<div class="row">${L(q.r)}${i?'<small>Đang chờ</small>':bar(q.t,G.RECIPES[q.r].time)}</div>`);
  if(h)h='<h3>Đang nấu</h3>'+h+'<h3>Công thức</h3>';
  for(const k in G.RECIPES){const r=G.RECIPES[k];h+=`<div class="row"><span><span class="name">${G.ic(k)}<span>${r.n}<small>Bán ${r.price} đồng · ${r.time} giây</small></span></span>${need(k)}</span>${B('cook',k,'Nấu',G.canCook(k)?'':'red')}</div>`}return h},
 bag:()=>{const inv=Object.entries(G.S.inv);
  let h=inv.length?inv.map(([k,n])=>{
    const inHot=G.ui.hotbar.indexOf(k);
    return `<div class="row">${L(k,n)}<span class="acts">${B('hold',k,G.ui.held===k?'Đang cầm':'Cầm')} ${B('tohot',k,inHot>=0?'Ô '+(inHot+1):'Gắn ô')} ${G.ITEMS[k]?.sell!=null?B('sell',k,'Bán','gold'):''}</span></div>`;
  }).join(''):'<p class="empty">Túi trống.</p>';
  if(G.ui.held)h=`<p class="hint">Đang cầm: ${G.ic(G.ui.held)} ${G.ITEMS[G.ui.held]?.n||G.ui.held} — ${B('unhold','','Bỏ tay')}</p>`+h;
  h+='<p class="hint">Ô dưới để trống — bấm Gắn ô để tự trang bị</p>';
  return h+`<p>${B('reset','','Chơi lại từ đầu','red')}</p>`}
};
const acts={seed:id=>{G.ui.seed=id;G.hold('hat_'+id)},hold:id=>G.hold(id),unhold:()=>G.unhold(),sethot:i=>G.setHot(+i),
 tohot:id=>{const hb=G.ui.hotbar;const i=hb.indexOf(id);if(i>=0){hb[i]=null;G.msg('Gỡ khỏi ô '+(i+1));return}
  let e=hb.findIndex(x=>!x);if(e<0)e=0;hb[e]=id;G.msg('Gắn ô '+(e+1)+': '+(G.ITEMS[id]?.n||id));G.hold(id)},
 animal:G.buyAnimal,feed:i=>G.feed(+i),collect:i=>G.collect(+i),buy:G.buy,
 sell:id=>G.sell(id),sellall:id=>G.sell(id,1),cook:id=>{G.cook(id);G.P.work('stir',.6)},serve:i=>G.serve(+i),reset:()=>confirm('Xoá toàn bộ tiến trình?')&&(G.reset(),G.ui.modal=null)};
const ZN={farm:'Trang trại',market:'Chợ',kitchen:'Bếp',shop:'Quán xôi',hub:'Bến Dừa',pets:'Thú cưng'};
function shortName(id){const n=G.ITEMS[id]?.n||id;return n.length>8?n.slice(0,7)+'…':n}
function ui(){const S=G.S,z=G.ui.zone;
 const phase=['Sáng sớm','Trưa','Chiều','Tối'][Math.min(3,(S.clock/120*4)|0)];
 $('#hud').innerHTML=`<div class="left"><span class="stat"><span class="well">${G.ic('coin')}</span><span><em>Đồng</em><b>${S.money}</b></span></span><span class="stat"><span class="well">${G.ic('sun')}</span><span><em>${phase}</em><b>Ngày ${S.day}</b></span></span><span class="stat"><span class="well">${G.ic('face')}</span><span><em>Đã bán</em><b>${S.served}</b></span></span></div><span class="zonepill"><em>Đang ở</em><b>${ZN[z]||z}</b></span>`;
 $('#toast').textContent=G.msgText;
 const ripe=S.plots.filter(p=>p&&p.t>=G.CROPS[p.crop].time).length;
 const animalReady=S.animals.filter(a=>a.ready).length;
 const ready=ripe+animalReady;
 const rb=$('#readybd'); if(rb) rb.textContent=ready||'';
 const q=$('#quest');
 if(q){
   const bits=[];
   if(ripe)bits.push(ripe+' luống chín');
   if(animalReady)bits.push(animalReady+' chuồng có đồ');
   if(S.cooking.length)bits.push('đang nấu '+S.cooking.length);
   if(S.customers.length)bits.push(S.customers.length+' khách chờ');
   q.innerHTML=bits.length?`<i>Việc</i>${bits.join(' · ')}`:'<i>Gợi ý</i>Gieo nếp, nấu xôi, mang ra quán';
 }
 const held=G.ui.held;
 $('#held').innerHTML=held?`${G.ic(held)}<span><b>Đang cầm</b>${G.ITEMS[held]?.n||held}</span>`:'<span><b>Tay không</b>gắn đồ từ túi</span>';
 G.fillHot();
 $('#tool').innerHTML=G.ui.hotbar.map((id,i)=>{
   const sel=id&&G.ui.held===id?'sel':'';
   if(!id)return `<button class="chip empty" data-act="sethot" data-id="${i}"><span class="slotn">${i+1}</span><span class="sn">Trống</span></button>`;
   const n=S.inv[id]||0;
   return `<button class="chip ${sel}" data-act="hold" data-id="${id}"><span class="slotn">${i+1}</span>${n?`<span class="qty">${n}</span>`:''}${G.ic(id)}<span class="sn">${shortName(id)}</span></button>`;
 }).join('');
 const mo=$('#modal'),mb=$('#mbody'),m=G.ui.modal;
 if(m){const st=mb.scrollTop;$('#mtitle').textContent=TITLE[m];$('#msub').textContent=SUB[m]||'';mb.innerHTML=M[m]();mb.scrollTop=st;mo.style.display='flex'}else mo.style.display='none'}
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=t.dataset;
 if(d.zone){G.ui.zone=d.zone;G.P.enter(d.zone)}else if(d.modal!==undefined)G.ui.modal=d.modal||null;else if(acts[d.act])acts[d.act](d.id);
 ui();G.save()});
G.refreshUI=()=>{ui();G.save()};
cv.addEventListener('click',e=>{if(G.ui.modal||G.P.st==='work')return;const r=cv.getBoundingClientRect(),sx=(e.clientX-r.left)*W/r.width,sy=(e.clientY-r.top)*H/r.height;
 const x=sx+G.cam.x,y=sy+G.cam.y; // convert to world coords
 for(let i=G.hot.length-1;i>=0;i--){const h=G.hot[i];if(x>=h.x&&x<h.x+h.w&&y>=h.y&&y<h.y+h.h){G.fxTap(h.sx,h.sy);G.P.act(h);return}}
 G.fxTap(x,y);G.P.go(x,y)});
let last=performance.now(),acc=0;
(function loop(now){const dt=Math.min((now-last)/1000,1);last=now;
 G.updateFarm(dt);G.updateKitchen(dt);G.draw(now);
 acc+=dt;if(acc>.5){acc=0;ui();G.save()}
 requestAnimationFrame(loop)})(last);
G.P.enter(G.ui.zone);G.fillIcons(document);ui();
addEventListener('pointerdown',()=>{if(matchMedia('(pointer:coarse)').matches)try{const e=document.documentElement;(e.requestFullscreen||e.webkitRequestFullscreen).call(e);screen.orientation.lock('landscape').catch(()=>{})}catch(x){}},{once:true});

