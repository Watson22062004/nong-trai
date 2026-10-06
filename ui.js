// GIAO DIỆN HTML (HUD, thanh chọn khu, bảng mua/bán/nấu) + VÒNG LẶP
const $=s=>document.querySelector(s);
const L=(id,n)=>`<span class="name">${G.ic(id)}<span>${G.ITEMS[id].n}${n!=null?` <b class="n">×${n}</b>`:''}</span></span>`;
const bar=(v,m,w)=>`<div class="bar ${w?'warn':''}"><i style="width:${Math.min(100,v/m*100)}%"></i></div>`;
const B=(a,id,t,c='')=>`<button class="btn ${c}" data-act="${a}" data-id="${id}">${t}</button>`;
const price=p=>`${G.ic('coin')}${p}`;
const need=r=>`<div class="ing">${Object.entries(G.RECIPES[r].need).map(([k,n])=>`<span class="${G.has(k,n)?'':'lack'}">${G.ic(k)}×${n}</span>`).join('')}</div>`;
const buyList=ids=>ids.map(k=>`<div class="row">${L(k,G.S.inv[k]||0)}${B('buy',k,price(G.ITEMS[k].buy),'gold')}</div>`).join('');
const TITLE={seeds:'Hạt giống',ing:'Nguyên liệu',animals:'Vật nuôi',sell:'Thu mua',cook:'Bếp',bag:'Túi đồ'};
const M={
 seeds:()=>buyList(Object.keys(G.CROPS).map(k=>'hat_'+k)),
 ing:()=>buyList(['cam','duong','muoi']),
 animals:()=>Object.keys(G.ANIMALS).map(k=>{const a=G.ANIMALS[k];return `<div class="row"><span class="name">${G.ic(k)}<span>${a.n}<small>${a.time} giây ra ${G.ITEMS[a.make].n.toLowerCase()}</small></span></span>${B('animal',k,price(a.cost),'gold')}</div>`}).join('')+`<p class="hint">Đang nuôi ${G.S.animals.length}/${G.CFG.maxAnimals}</p>`,
 sell:()=>{const inv=Object.entries(G.S.inv);return inv.length?inv.map(([k,n])=>`<div class="row">${L(k,n)}<span>${B('sell',k,'Bán 1 · '+price(G.ITEMS[k].sell),'gold')} ${B('sellall',k,'Bán hết')}</span></div>`).join(''):'<p class="empty">Kho trống, đi thu hoạch trước đã.</p>'},
 cook:()=>{const S=G.S;let h='';S.cooking.forEach((q,i)=>h+=`<div class="row">${L(q.r)}${i?'<small>Đang chờ</small>':bar(q.t,G.RECIPES[q.r].time)}</div>`);
  if(h)h='<h3>Đang nấu</h3>'+h+'<h3>Công thức</h3>';
  for(const k in G.RECIPES){const r=G.RECIPES[k];h+=`<div class="row"><span><span class="name">${G.ic(k)}<span>${r.n}<small>Bán ${r.price} đồng · ${r.time} giây</small></span></span>${need(k)}</span>${B('cook',k,'Nấu',G.canCook(k)?'':'red')}</div>`}return h},
 bag:()=>{const ks=Object.keys(G.ITEMS),inv=Object.entries(G.S.inv).sort((a,b)=>ks.indexOf(a[0])-ks.indexOf(b[0])),
  sel=G.ui.sel&&G.S.inv[G.ui.sel]?G.ui.sel:(G.ui.sel=null),hb=G.ui.hotbar,total=Math.max(24,Math.ceil(inv.length/6)*6);
  let cells='';
  for(let i=0;i<total;i++){const e=inv[i];if(!e){cells+='<div class="cell void"></div>';continue}
   const[k,n]=e,h=hb.indexOf(k);
   cells+=`<button class="cell ${sel===k?'on':''} ${G.ui.held===k?'held':''}" data-act="sel" data-id="${k}">${G.ic(k)}<span class="q">${n}</span>${h>=0?`<span class="hk">${h+1}</span>`:''}</button>`}
  let side;
  if(sel){const it=G.ITEMS[sel],h=hb.indexOf(sel);
   side=`<div class="big">${G.ic(sel)}</div><b class="nm">${it.n}</b><small>Có ${G.S.inv[sel]} · ${h>=0?'Đang ở ô '+(h+1):'Chưa gắn ô nhanh'}</small>`+
    (it.sell!=null?`<small>Giá bán ${price(it.sell)}</small>`:'')+
    `<p class="hint tip">Bấm một ô nhanh bên dưới để gắn. Ô đã có đồ sẽ hoán đổi.</p>`+
    B('hold',sel,G.ui.held===sel?'Bỏ tay':'Cầm')+(h>=0?B('unslot',sel,'Gỡ khỏi ô '+(h+1),'red'):'')+
    (it.sell!=null?B('sell',sel,'Bán 1 · '+price(it.sell),'gold')+B('sellall',sel,'Bán hết','gold'):'')}
  else side=`<p class="hint tip">${inv.length?'Chọn một vật phẩm trong túi, rồi bấm vào ô nhanh bên dưới để gắn. Ô đã có đồ sẽ hoán đổi vị trí.':'Túi trống, ra ruộng thu hoạch trước đã.'}</p>`+
    (G.ui.held?`<small>Đang cầm: ${G.ic(G.ui.held)} ${G.ITEMS[G.ui.held]?.n||''}</small>`+B('unhold','','Bỏ tay'):'');
  side+=`<span class="grow"></span>`+B('reset','','Chơi lại','red');
  return `<div class="bag"><div class="bgrid">${cells}</div><div class="side">${side}</div></div>`}
};
const acts={seed:id=>{G.ui.seed=id;G.hold('hat_'+id)},hold:id=>G.hold(id),unhold:()=>G.unhold(),sel:id=>{G.ui.sel=G.ui.sel===id?null:id},unslot:id=>{const hb=G.ui.hotbar,i=hb.indexOf(id);if(i>=0){hb[i]=null;G.msg('Gỡ khỏi ô '+(i+1))}},
 slot:i=>{i=+i;const hb=G.ui.hotbar,id=hb[i],bag=G.ui.modal==='bag';
  if(bag&&G.ui.sel){G.putHot(i,G.ui.sel);G.ui.sel=null;return}
  if(bag&&id&&G.S.inv[id]){G.ui.sel=id;return} // chọn từ ô nhanh → chạm ô khác để hoán đổi
  if(!id){G.unhold();return}
  if(!G.S.inv[id]&&!id.startsWith('hat_')){G.msg('Hết '+(G.ITEMS[id]?.n||id));return}
  G.hold(id)},
 animal:G.buyAnimal,feed:i=>G.feed(+i),collect:i=>G.collect(+i),buy:G.buy,
 sell:id=>G.sell(id),sellall:id=>G.sell(id,1),cook:id=>{G.cook(id);G.P.work('stir',.6)},serve:i=>G.serve(+i),reset:()=>confirm('Xoá toàn bộ tiến trình?')&&(G.reset(),G.ui.modal=null)};
const ZN={farm:'Trang trại',market:'Chợ',kitchen:'Bếp',shop:'Quán xôi',hub:'Bến Dừa',pets:'Thú cưng'};
function ui(){const S=G.S,z=G.ui.zone;
 $('#hud').innerHTML=`<div class="left"><span class="stat">${G.ic('coin')}<b>${S.money}</b></span><span class="stat">${G.ic('sun')}<b>Ngày ${S.day}</b></span><span class="stat">${G.ic('face')}<b>${S.served}</b></span></div><span class="zonepill">${ZN[z]||z}</span>`;
 $('#toast').textContent=G.msgText;
 const ready=S.plots.filter(p=>p&&p.t>=G.CROPS[p.crop].time).length+S.animals.filter(a=>a.ready).length;
 const rb=$('#readybd'); if(rb) rb.textContent=ready||'';
 // Thanh 8 ô cùng kích thước — chỉ 1 ô được chọn
 G.fillHot();
 const bm=G.ui.modal==='bag',ps=G.ui.sel;
 const th=G.ui.hotbar.map((id,i)=>{
   if(!id)return `<button class="chip empty ${bm&&ps?'tgt':''}" data-act="slot" data-id="${i}"><span class="slotn">${i+1}</span></button>`;
   const n=S.inv[id]||0,cl=[G.ui.held===id?'sel':'',n||id.startsWith('hat_')?'':'dim',bm&&ps?(ps===id?'pick':'tgt'):''].join(' ');
   return `<button class="chip ${cl}" data-act="slot" data-id="${i}"><span class="slotn">${i+1}</span>${G.ic(id)}${n?`<span class="qty">×${n}</span>`:''}</button>`;
 }).join('');
 const tl=$('#tool');if(tl._h!==th){tl.innerHTML=th;tl._h=th}
 const mo=$('#modal'),mb=$('#mbody'),m=G.ui.modal;
 if(m){$('#mtitle').textContent=TITLE[m];mo.classList.toggle('bagmode',m==='bag');const h=M[m](); if(mb._h!==h){const st=mb.scrollTop;mb.innerHTML=h;mb.scrollTop=st;mb._h=h}mo.style.display='flex'}else mo.style.display='none'}
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=t.dataset;
 if(d.zone){G.ui.zone=d.zone;G.P.enter(d.zone)}else if(d.modal!==undefined){G.ui.modal=d.modal&&G.ui.modal!==d.modal?d.modal:null;G.ui.sel=null}else if(acts[d.act])acts[d.act](d.id);
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

