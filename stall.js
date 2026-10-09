// stall.js — XE ĐẨY: màn bán góc nhìn thứ nhất (kiểu Papa's / Good Pizza).
// Khách đứng trước quầy gọi món → bạn tự chạm khay nguyên liệu để đặt lên đĩa → bấm Giao.
// PHẠT THẬT: đặt sai nguyên liệu (không thuộc món / thừa) → món HỎNG, chỉ còn cách Đổ đi và MẤT hết nguyên liệu đã đặt.
// Nguyên liệu lấy thẳng từ kho (ruộng + chợ) nên làm nông có ý nghĩa trực tiếp. Công thức dùng chung G.RECIPES.
(()=>{
const MENU=G.STALL_MENU=['tra_chanh','ca_phe_sua','banh_mi','goi_cuon']; // món bán được ở xe đẩy (mở khoá theo số khách đã phục vụ: G.unlocked)
const ORD=['tra','chanh','duong','da','ca_phe','sua_dac','bot_mi','thit_heo','ca_rot','rau_thom','banh_trang','tom','bun']; // thứ tự khay
const SK=['char2_walk','char3_walk','char5_walk','char1_walk'];
const st=()=>G.S.stall||(G.S.stall={open:false,q:0,cur:null,plate:[],bad:false,spawn:0,gap:0});
G.stallState=st;
const menu=()=>MENU.filter(k=>G.RECIPES[k]&&G.unlocked(k));
const canMake=k=>Object.entries(G.RECIPES[k].need).every(([i,n])=>G.has(i,n));
const nm=i=>(G.ITEMS[i]&&G.ITEMS[i].n)||i;
const cnt=(a,i)=>a.filter(x=>x===i).length;
const sn=(f,...a)=>{try{G.snd&&G.snd[f]&&G.snd[f](...a)}catch(e){}};
const flash={};

// ===== HÌNH MÓN: vẽ pixel-art bằng code, lên dần theo từng nguyên liệu đặt, đủ nguyên liệu = món hoàn chỉnh =====
const DW=24,DH=22,artCache={};
const disc=(b,x,y,r,c)=>{for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(i*i+j*j<=r*r+r*.6)rr(b,x+i,y+j,1,1,c)};
const glass=b=>{rr(b,5,3,14,18,OL);rr(b,6,4,12,16,'#e6f6fa');rr(b,6,4,1,16,'#ffffff')};
const liq=(b,y,c,hi)=>{rr(b,6,y,12,20-y,c);if(hi)rr(b,6,y,12,1,hi)};
const ice=(b,x,y)=>{rr(b,x,y,4,4,'#d4f0fa');rr(b,x,y,4,1,'#ffffff');rr(b,x+3,y+1,1,3,'#9fd0e2')};
const straw=(b,c)=>{rr(b,9,0,2,12,c);rr(b,9,2,2,2,'#ffffff');rr(b,9,6,2,2,'#ffffff')};
const DISH={
  tra_chanh(b,n,fin){const t=n('tra'),c=n('chanh');glass(b);
    if(t||c)liq(b,t?8:11,t?(c?'#d9a52e':'#c97f26'):'#ece27e',t?(c?'#f0c85a':'#e8a850'):'#f6f0a8');
    if(fin)straw(b,'#e2492f');
    if(n('da'))[[7,9],[12,8],[9,13],[13,13]].forEach(([x,y])=>ice(b,x,y));
    if(n('duong'))[[8,18],[11,17],[14,18],[16,17]].forEach(([x,y])=>rr(b,x,y,1,1,'#ffffff'));
    if(c){disc(b,17,5,4,OL);disc(b,17,5,3,'#f6d84a');rr(b,17,3,1,5,'#fff6b0');rr(b,15,5,5,1,'#fff6b0')}},
  ca_phe_sua(b,n,fin){const cf=n('ca_phe'),sd=n('sua_dac');glass(b);
    if(sd)liq(b,cf?14:11,'#f4e6c4','#fff6dc');
    if(cf){rr(b,6,8,12,sd?6:12,'#4a2c1a');rr(b,6,8,12,1,'#6e4428');if(sd)rr(b,6,14,12,1,'#8a5a34')}
    if(fin)straw(b,'#3a2a20');
    if(n('da'))[[7,9],[12,9],[9,12]].forEach(([x,y])=>ice(b,x,y))},
  banh_mi(b,n,fin){const bm=n('bot_mi'),th=n('thit_heo'),cr=n('ca_rot'),rt=n('rau_thom');
    if(bm){blk(b,1,11,22,9,'#e8b060');rr(b,2,12,20,2,'#f6d088');rr(b,2,17,20,2,'#c8883a');
      [4,8,12,16].forEach(x=>rr(b,x,13,2,1,'#c8883a'));
      [[1,11],[22,11],[1,19],[22,19]].forEach(([x,y])=>b.clearRect(x,y,1,1))}
    if(bm){
      if(th){rr(b,3,9,18,4,OL);rr(b,4,10,16,2,'#e8928a');rr(b,4,10,16,1,'#f6b0a8')}
      if(cr)[5,9,13,17].forEach(x=>{rr(b,x,10,3,2,'#ee8a2a');rr(b,x,10,3,1,'#ffb050')}); // lát cà rốt nằm trên thịt
      if(rt)for(let x=2;x<=19;x+=3){const h=(x/3|0)%2?4:5;rr(b,x,11-h,4,h,'#4fa84a');rr(b,x+1,10-h,2,1,'#7cd070');rr(b,x+2,12-h,1,2,'#3a8a3a')} // rau thơm xoè như tán lá
      if(fin)[7,12,17].forEach(x=>rr(b,x,12,1,1,'#fff6dc'));
    }else{ // chưa có bánh mì: nhân nằm tạm trên đĩa
      if(th){rr(b,5,16,14,3,OL);rr(b,6,16,12,2,'#e8928a')}
      if(cr)[7,10,13].forEach(x=>rr(b,x,13,2,3,'#ee8a2a'));
      if(rt){rr(b,10,11,6,4,'#4fa84a');rr(b,11,10,4,1,'#7cd070')}}},
  goi_cuon(b,n,fin){const bt=n('banh_trang'),tm=n('tom'),bu=n('bun'),rt=n('rau_thom');
    const roll=(x,y,w)=>{
      if(bt){blk(b,x,y,w,7,'#f4efe0');rr(b,x+1,y+5,w-2,1,'#d8d0b8');[[x,y],[x+w-1,y],[x,y+6],[x+w-1,y+6]].forEach(([a,c])=>b.clearRect(a,c,1,1))}
      const iy=y+2;
      if(bu){rr(b,x+(bt?0:1),iy,2,3,'#fffaf0');rr(b,x+w-(bt?2:3),iy,2,3,'#fffaf0')}
      if(rt)rr(b,x+3,iy,w-6,1,'#5fb04a');
      if(tm)[x+5,x+w-9].forEach(sx=>{rr(b,sx,iy+1,4,2,'#f0905e');rr(b,sx+3,iy+2,1,1,'#ffb890')})};
    roll(1,5,20);roll(3,13,20);
    if(fin){rr(b,16,0,8,5,OL);rr(b,17,1,6,3,'#f4efe0');rr(b,18,1,4,2,'#b8601e');rr(b,18,1,4,1,'#d88a3a');rr(b,22,0,1,1,'#5fb04a')}} // chén nước chấm
};
const fullPlate=id=>Object.entries(G.RECIPES[id].need).flatMap(([i,k])=>Array(k).fill(i));
function dishCanvas(id,plate){
  if(!DISH[id])return null;
  const m={};plate.forEach(i=>m[i]=(m[i]||0)+1);const need=G.RECIPES[id].need,keys=Object.keys(need);
  const fin=keys.every(i=>(m[i]||0)===need[i]),key=id+'|'+keys.map(i=>Math.min(m[i]||0,need[i])).join('')+(fin?'F':'');
  if(artCache[key])return artCache[key];
  const c=document.createElement('canvas');c.width=DW;c.height=DH;DISH[id](c.getContext('2d'),i=>m[i]||0,fin);
  return artCache[key]=c;
}
G.dishCanvas=dishCanvas;G.dishFull=id=>dishCanvas(id,fullPlate(id));
let fly=null; // món bay từ đĩa sang khách khi giao
// Khay hiển thị: đủ nguyên liệu cho các món đã mở khoá, nếu < 8 khay thì thêm khay "gây nhiễu" để việc chọn có ý nghĩa
const trays=()=>{const need=new Set();menu().forEach(k=>Object.keys(G.RECIPES[k].need).forEach(i=>need.add(i)));
  const list=ORD.filter(i=>need.has(i));for(const i of ORD){if(list.length>=8)break;if(!list.includes(i))list.push(i)}
  return ORD.filter(i=>list.includes(i))};
const layout=n=>{const cols=n<=8?n:Math.ceil(n/2),rows=n<=8?1:2,gap=4,w=Math.min(46,Math.floor((356-(cols-1)*gap)/cols)),h=rows===1?34:18,
  x0=Math.round((384-(cols*w+(cols-1)*gap))/2),y0=rows===1?125:123;
  return Array.from({length:n},(_,i)=>{const r=rows===1||i<cols?0:1,c=rows===1||i<cols?i:i-cols;return{x:x0+c*(w+gap),y:y0+r*(h+4),w,h}})};
const complete=s=>{const c=s.cur;if(!c)return false;return Object.entries(G.RECIPES[c.want].need).every(([i,n])=>cnt(s.plate,i)===n)};

// ===== Luật chơi =====
function pick(it){
  const s=st(),c=s.cur;
  if(!c||c.out||c.age<.7)return G.msg('Chờ khách ra quầy đã');
  if(s.bad)return G.msg('Món hỏng rồi — bấm Đổ đi');
  if(!G.has(it))return G.msg('Hết '+nm(it)+' — ra Chợ mua thêm');
  const need=G.RECIPES[c.want].need[it]||0,have=cnt(s.plate,it);
  G.add(it,-1);s.plate.push(it);flash[it]={t:performance.now(),ok:have<need};
  if(have>=need){s.bad=true;s.shake=performance.now();G.msg('Sai rồi! '+nm(it)+' làm hỏng món — Đổ đi (mất nguyên liệu)');sn('nope');sn('clank')}
  else sn('ingredient',it);
}
function trash(){
  const s=st();if(!s.plate.length)return;
  const n=s.plate.length;s.plate=[];s.bad=false;G.msg('Đổ đi '+n+' nguyên liệu');sn('pourAway');
}
function serve(){
  const S=G.S,s=st(),c=s.cur;if(!c||c.out||c.age<.7)return;
  if(s.bad)return G.msg('Món hỏng rồi — bấm Đổ đi');
  if(!complete(s))return G.msg('Chưa đủ nguyên liệu cho món này');
  const r=G.RECIPES[c.want],fast=c.p/c.pmax>.5,pay=Math.round(r.price*(fast?1.2:1)*(1+.05*Math.max(0,G.stars()-3)));
  fly={c:dishCanvas(c.want,s.plate),t:performance.now()};
  G.earn(pay,'stall');S.served++;G.addRep(fast?3:2);s.plate=[];c.out='happy';c.ot=0;
  G.float('+'+pay,192,64,'#f2d04a');G.spark(192,90,'#f2d04a',10,100);sn('plate');
  const nw=MENU.filter(k=>G.RECIPES[k].unlock===S.served).map(k=>G.RECIPES[k].n);
  if(nw.length)G.msg('Mở khoá món mới: '+nw.join(', ')+'!');
}
function decline(){const s=st(),c=s.cur;if(!c||c.out)return;c.out='decline';c.ot=0;G.addRep(-1);G.msg('Đã từ chối khách')}
function newCustomer(s){
  const ks=menu();if(!ks.length)return;const mk=ks.filter(canMake),pool=mk.length&&Math.random()<.85?mk:ks,want=pool[Math.random()*pool.length|0];
  const n=Object.values(G.RECIPES[want].need).reduce((a,b)=>a+b,0),pmax=18+7*n;
  s.cur={want,p:pmax,pmax,sk:Math.random()*4|0,age:0};sn('bell');
}
G.updateStall=dt=>{
  if(G.ui.zone!=='stall')return; // không ở xe đẩy → khách đứng yên (không đến thêm, không bực)
  const s=st(),F=G.CFG,c=s.cur;
  if(s.open&&s.q<3){s.spawn+=dt;if(s.spawn>=F.customerEvery*(1.3-.1*G.stars())){s.spawn=0;s.q++}}
  if(c){c.age=(c.age||0)+dt;
    if(c.out){c.ot=(c.ot||0)+dt;if(c.ot>.9){s.cur=null;s.gap=1.1}}
    else if(c.age>.7){c.p-=dt;if(c.p<=0){c.out='mad';c.ot=0;G.addRep(-5);G.msg('Khách bực bỏ về! (−5 uy tín)')}}
  }else if(s.q>0){s.gap=(s.gap||0)-dt;if(s.gap<=0){s.q--;newCustomer(s)}}
};
// Mở/đóng bán (cờ s.open riêng của xe đẩy, không dính tới quán cũ)
G.openStall=()=>{const s=st();if(s.open)return;s.open=true;s.spawn=0;if(!s.cur&&s.q<1)s.q=1;
  G.msg(menu().some(canMake)?'Mở bán! Làm đúng món khách gọi nhé':'Mở bán — chưa đủ nguyên liệu, nhớ trồng chanh và ra Chợ mua nhé!');sn('bell')};
G.closeStall=()=>{const s=st();if(!s.open)return;s.open=false;s.q=0;
  G.msg(s.cur&&!s.cur.out?'Đóng cửa — phục vụ nốt khách này':'Đã đóng cửa')};

// ===== Vẽ =====
const bg=mkBg(b=>{
  rr(b,0,0,384,98,'#a8dcf2');rr(b,0,0,384,24,'#8ed0ee');
  [[-4,36,72,'#e8c888'],[64,46,58,'#d8a878'],[118,32,78,'#f0d8a0'],[192,44,62,'#c8d8a0'],[250,38,74,'#e8b8a0'],[320,48,70,'#d8c090']].forEach(([x,y,w,c])=>{
    blk(b,x,y,w,82-y,c);for(let wx=x+9;wx<x+w-14;wx+=19)for(let wy=y+9;wy<68;wy+=21)blk(b,wx,wy,10,12,'#8ec8e0')});
  rr(b,0,82,384,16,'#cdb27c');for(let y=84;y<98;y+=6)for(let x=(y/6%2)*7;x<384;x+=14)rr(b,x,y,13,5,['#d8c090','#c4a870','#dcc898'][(x+y)%3]);
  // mái hiên
  for(let i=0;i<24;i++){const c=i%2?'#fffaf0':'#c8462e';rr(b,i*16,0,16,16,c);rr(b,i*16+2,16,12,4,c);rr(b,i*16+4,20,8,2,c)}
  rr(b,0,0,384,1,OL);rr(b,0,22,384,5,'rgba(0,0,0,.12)');
  // quầy: mặt quầy, thanh khay, mặt trước
  rr(b,0,96,384,4,'#6b4423');rr(b,0,100,384,18,'#e2c496');for(let x=0;x<384;x+=48)rr(b,x,100,1,18,'#cfae7c');rr(b,0,100,384,1,'#f2dcb4');
  rr(b,0,118,384,3,'#a8733a');rr(b,0,121,384,42,'#8b5a2b');for(let x=0;x<384;x+=12)rr(b,x,121,1,42,'#7a4a24');
  rr(b,0,163,384,3,'#5a3a20');rr(b,0,166,384,50,'#a8733a');for(let x=0;x<384;x+=24){rr(b,x,166,1,50,'#8a5a30');rr(b,x+1,166,1,50,'#c4905a')}
  blk(b,0,0,7,166,'#8b5a2b');blk(b,377,0,7,166,'#8b5a2b');
},384,216);

const drawCust=(c,x,feet,k,t,al,mv,ox=0)=>{const ci=G.loadImg(G.ASSETS[SK[c.sk&3]]);if(!ci||!ci.complete)return;
  const sz=16*k,fr=mv?((t/110)|0)%4:0,row=mv?1:0,bob=mv?-Math.abs(Math.sin(t/110))*2:0;
  cx.globalAlpha=al*.3;R(x-sz/2.6,feet-2,sz/1.3,3,'#000');cx.globalAlpha=al;
  cx.imageSmoothingEnabled=false;cx.drawImage(ci,fr*16,row*16,16,16,Math.round(x-sz/2+ox),Math.round(feet-sz+bob),sz,sz);cx.globalAlpha=1};
const btn=(x,y,w,h,label,col,en,fn,pulse)=>{const t=performance.now(),k=pulse?Math.round(Math.sin(t/140)*1.5):0;
  blk(cx,x-k,y-k,w+k*2,h+k*2,en?col:'#9a9a9a');TS(label,x+w/2,y+h/2+3,en?'#fff':'#e4e4e4',8);HOT(x,y,w,h,fn)};

Z.stall={fp:true,bg,draw(t){
  const S=G.S,s=st(),c=s.cur,open=!!s.open;
  // khách xếp hàng phía sau (mờ)
  for(let i=0;i<Math.min(s.q,2);i++)drawCust({sk:i+1},i?262:128,90,3,t,.5,false);
  // khách đang ở quầy: bước tới từ bên phải, ra về bên trái
  if(c){const arr=c.age<.7&&!c.out,x=c.out?192-eo(c.ot/.9)*200:192+(1-eo(c.age/.7))*170,
      al=c.out?Math.max(0,Math.min(1,(.9-c.ot)/.4)):1,shake=c.out==='mad'&&c.ot<.6?Math.sin(t/30)*1.6:0;
    drawCust(c,x,98,4,t,al,arr||!!c.out,shake);
    if(!c.out&&!arr){const f=Math.max(0,c.p/c.pmax);R(x-21,27,42,5,OL);R(x-20,28,40*f,3,f>.5?'#7bc96f':f>.25?'#f2a82a':(Math.sin(t/90)>0?'#e2674a':'#ffb0a0'));
      const bx=x+26,by=28,da=G.dishFull(c.want);R(bx,by,30,28,OL);R(bx+1,by+1,28,26,'#fffaf0');R(bx+12,by+28,4,3,OL);R(bx+13,by+28,2,2,'#fffaf0');
      if(da)cx.drawImage(da,bx+3,by+3,DW,DH);else IM(c.want,bx+6,by+5,18)}
    if(c.out==='happy')TS('♥',x,34-c.ot*22,'#e2674a',13);
    if(c.out==='mad')TS('!',x,34,'#e2674a',15);
    // phiếu gọi món
    if(!c.out){const r=G.RECIPES[c.want],X=8,Y=28,Wd=92,Ht=58;
      blk(cx,X,Y,Wd,Ht,'#fffaf0');R(X+2,Y+2,Wd-4,11,'#c8462e');TS(r.n,X+Wd/2,Y+11,'#fff',7);
      const es=Object.entries(r.need),cw=Math.min(23,Math.floor((Wd-4)/es.length)),x0=X+Math.round((Wd-cw*es.length)/2);
      es.forEach(([it,n],i)=>{const rem=n-cnt(s.plate,it),ix=x0+i*cw+Math.round((cw-16)/2);IM(it,ix,Y+16,16);
        TS(rem<=0?'✓':'×'+rem,x0+i*cw+cw/2,Y+43,rem<=0?'#9be08a':(G.S.inv[it]||0)<rem?'#ff8a70':'#fff6e4',7)});
      IM('coin',X+Wd/2-14,Y+46,10);T(String(r.price),X+Wd/2+6,Y+55,'#2a1a10',7)}
  }
  // đĩa trên quầy
  const px=192,py=108,bad=s.bad,sh=bad&&performance.now()-(s.shake||0)<400?Math.sin(t/25)*2:0;
  ell(cx,px,py+3,42,7,'rgba(0,0,0,.25)');ell(cx,px,py,41,7,OL);ell(cx,px,py,39,6,bad?'#f2b0a0':'#fffaf0');ell(cx,px,py,31,4,bad?'#e89080':'#efe6d0');
  const n=s.plate.length,sp=Math.min(14,66/Math.max(1,n));
  if(n&&!bad&&c){const da=dishCanvas(c.want,s.plate);
    if(da){cx.drawImage(da,px-DW,py+4-DH*2,DW*2,DH*2);
      if(complete(s))for(let i=0;i<4;i++){const a=t/300+i*1.6,sx=px+Math.cos(a)*30,sy=py-22+Math.sin(a*1.3)*16;R(sx-1,sy,3,1,'#fff6a0');R(sx,sy-1,1,3,'#fff6a0')}}
    else s.plate.forEach((it,i)=>IM(it,Math.round(px-(n-1)*sp/2-7),py-13+(i%2?-1:1),14))}
  else s.plate.forEach((it,i)=>IM(it,Math.round(px-(n-1)*sp/2-7+sh),py-13+(i%2?-1:1),14,bad?.6:1));
  if(bad)TS('HỎNG! Bấm Đổ đi',px,92,'#ff7a60',8);
  else if(c&&!c.out&&!n&&c.age>.7)TS('Chạm khay bên dưới để lấy nguyên liệu',px,116,'#fff6e4',6);
  if(fly){const k=(performance.now()-fly.t)/380;if(k>=1||!fly.c)fly=null;else{cx.globalAlpha=1-k*.7;cx.drawImage(fly.c,px-DW,py+4-DH*2-eo(k)*40,DW*2,DH*2);cx.globalAlpha=1}}
  // khay nguyên liệu
  const tl=trays(),ly=layout(tl.length),now=performance.now();
  tl.forEach((it,i)=>{const b=ly[i],have=S.inv[it]||0,f=flash[it],on=f&&now-f.t<380;
    blk(cx,b.x,b.y,b.w,b.h,on?(f.ok?'#bff0b8':'#f6a898'):'#efe6cc');
    if(b.h>=30){IM(it,b.x+Math.round(b.w/2)-10,b.y+2,20,have?1:.35);T(nm(it).slice(0,9),b.x+b.w/2,b.y+b.h-3,have?'#5a3a20':'#a09078',6);
      R(b.x+b.w-15,b.y+2,13,9,have?'#c8462e':'#8a8a8a');T('×'+have,b.x+b.w-8.5,b.y+9,'#fff',6)}
    else{IM(it,b.x+3,b.y+3,12,have?1:.35);T(nm(it).slice(0,8),b.x+17,b.y+8,have?'#5a3a20':'#a09078',6,'left');T('×'+have,b.x+17,b.y+16,have?'#c8462e':'#8a8a8a',7,'left')}
    HOT(b.x,b.y,b.w,b.h,()=>pick(it))});
  // nút thao tác
  const live=!!c&&!c.out&&c.age>.7;
  btn(14,170,66,20,'Đổ đi','#c8462e',n>0,trash);
  btn(136,168,112,24,'Giao món','#3b8a40',live&&!bad&&complete(s),serve,live&&!bad&&complete(s));
  btn(304,170,66,20,'Từ chối','#6a6a7a',live,decline);
  // bảng mở/đóng bán + về làng
  blk(cx,322,40,58,18,open?'#3b8a40':'#a8301e');TS(open?'ĐANG BÁN':'ĐÓNG CỬA',351,52,'#fff',7);
  HOT(322,40,58,18,()=>open?G.closeStall():G.openStall());
  blk(cx,322,62,58,14,'#6b4423');TS('← Về làng',351,72,'#ffe7a8',7);
  HOT(322,62,58,14,()=>{G.goZone('hub');Object.assign(G.P,{x:598,y:188,tx:598,ty:188});G.updateCam()});
  // trạng thái
  if(!open&&!c){TS('Xe đang đóng cửa',211,56,'#fff6e4',8);TS('Bấm bảng bên phải để mở bán',211,67,'#ffe27a',7)}
  else if(open&&!c)TS('Chờ khách…',192,60+Math.sin(t/500)*1.5,'#fff6e4',8);
}};
})();
