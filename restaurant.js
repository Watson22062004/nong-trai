// restaurant.js — logic nhà hàng: khách vào cửa → ra quầy gọi món → ngồi bàn → chờ món → ăn → trả tiền → ra về
G.REST={door:{x:192,y:50},q:{x:192,y:96},home:{x:192,y:142},gateIn:{x:335,y:98},gateOut:{x:335,y:134},
  tables:[72,140,244,312].map(x=>({x,y:70}))};
G.REST.seats=[];G.REST.tables.forEach((t,i)=>[-1,1].forEach(s=>G.REST.seats.push({x:t.x+s*19,y:76,t:i,side:s})));
Object.assign(G.CFG,{patience:60,patienceOrder:30,eatTime:6,maxQueue:3,customerEvery:9});
G.S.customers=[];G.carry=null;G.delivering=null;
// UY TÍN: S.rep 0–100 → 1–5 sao. Khách vui +, khách bực bỏ về −. Nhiều sao → khách đến nhanh hơn, 4–5 sao có tiền thưởng.
G.stars=()=>Math.min(5,1+Math.floor(G.S.rep/20));
G.addRep=d=>{const S=G.S,s0=G.stars();S.rep=Math.max(0,Math.min(100,S.rep+d));if(G.stars()>s0)G.msg('Quán lên '+G.stars()+' sao!')};
// đi qua nhiều điểm liên tiếp
G.walk=(pts,done)=>{const[p,...r]=pts;G.P.go(p[0],p[1],()=>r.length?G.walk(r,done):done&&done())};
const mv=(c,dt)=>{const p=c.path&&c.path[0];if(!p)return true;
  const dx=p[0]-c.x,dy=p[1]-c.y,d=Math.hypot(dx,dy),s=50*dt;
  if(d<=s){c.x=p[0];c.y=p[1];c.path.shift();return !c.path.length}
  c.x+=dx/d*s;c.y+=dy/d*s;c.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?1:3):(dy<0?2:0);return false};
const leave=c=>{const R=G.REST,p=[];if(c.y<92)p.push([c.x,96]);if(c.x!==192)p.push([192,Math.max(c.y,96)]);p.push([192,R.door.y]);
  c.st='leave';c.path=p;c.qk=null;c.seat=-1};
const mad=c=>{c.mad=true;G.addRep(-5);leave(c)};
G.updateCustomers=dt=>{const S=G.S,R=G.REST,C=S.customers,F=G.CFG;
  const d=G.delivering;if(d&&d.st==='serving'&&G.P.st==='idle'&&!G.P.task)G.cancelDeliver();
  if(G.ui.zone!=='shop')return; // không ở quán → khách đứng yên, không đến thêm, không bực (nấu/trồng trọt xong rồi hãy vào mở cửa)
  if(S.open)S.spawn+=dt;
  const qn=C.filter(c=>c.st==='in'||c.st==='queue'||c.st==='order').length;
  if(S.open&&S.spawn>=F.customerEvery*(1.3-.1*G.stars())&&C.length<F.maxCustomers&&qn<F.maxQueue){S.spawn=0;const ks=Object.keys(G.RECIPES).filter(G.unlocked);C.push({want:ks[Math.random()*ks.length|0],p:F.patienceOrder,st:'in',x:R.door.x,y:R.door.y,sk:Math.random()*4|0,seat:-1,dir:0,path:[]})}
  let qi=0;
  C.forEach(c=>{
    if(c._s!==c.st){c._s=c.st;c.age=0}else c.age+=dt;c.life=(c.life||0)+dt;
    if(c.st==='in'||c.st==='queue'||c.st==='order'){
      const tx=R.q.x-qi*26,ty=R.q.y+(qi?4:0),key=tx+','+ty;
      if(c.qk!==key){c.qk=key;c.path=[[tx,ty]]}
      c.st=mv(c,dt)?(qi?'queue':'order'):'in';qi++;
      if(c.st==='order'&&c.age>1.5)G.takeOrder(c,true); // tự nhận order sau 1,5s (chạm vào khách để nhận ngay)
      else if(c.st!=='in'){c.p-=dt;if(c.p<=0)mad(c)}}
    else if(c.st==='toseat'){if(mv(c,dt)){c.st='wait';c.p=F.patience;c.dir=0}}
    else if(c.st==='wait'){c.p-=dt;if(c.p<=0)mad(c)}
    else if(c.st==='eat'){c.eatT-=dt;if(c.eatT<=0){G.earn(c.pay,'shop');S.served++;G.addRep(c.fast?3:2);{const nw=Object.keys(G.RECIPES).filter(k=>G.RECIPES[k].unlock===S.served).map(k=>G.RECIPES[k].n);if(nw.length)G.msg('Mở khoá món mới: '+nw.join(', ')+'!')}G.float('+'+c.pay,c.x,c.y-30,'#f2d04a');G.spark(c.x,c.y-20,'#f2d04a',8,100);leave(c)}}
    else if(c.st==='leave'){if(mv(c,dt))c.dead=true}});
  S.customers=S.customers.filter(c=>!c.dead)};
// Nhận order: khách ở quầy chọn món rồi đi ngồi bàn
G.takeOrder=(c,auto)=>{if(c.st!=='order')return;
  const used=G.S.customers.filter(x=>x.seat>=0).map(x=>x.seat),free=G.REST.seats.map((s,i)=>i).filter(i=>!used.includes(i));
  if(!free.length)return auto?0:G.msg('Hết bàn rồi!');
  const i=free[Math.random()*free.length|0],s=G.REST.seats[i];
  c.seat=i;c.st='toseat';c.qk=null;c.path=[[s.x,96],[s.x,s.y]];c.p=G.CFG.patience;
  G.msg('Khách gọi '+G.RECIPES[c.want].n+' — ra bếp nấu nhé!')};
// Mang món ra bàn
G.cancelDeliver=()=>{const c=G.delivering;if(c&&c.st==='serving'){G.add(c.want);c.st='wait'}G.carry=null;G.delivering=null};
G.deliver=c=>{if(c.st!=='wait')return;const r=G.RECIPES[c.want];
  if(!G.has(c.want)){G.msg('Chưa có '+r.n+' — nấu món này nhé');G.ui.rec=c.want;G.ui.pot={};G.ui.modal='cook';G.refreshUI&&G.refreshUI();return}
  if(G.delivering)G.cancelDeliver();
  const R=G.REST,s=R.seats[c.seat];
  c.st='serving';c.fast=c.p/G.CFG.patience>.5;c.pay=Math.round(r.price*(c.fast?1.2:1)*(1+.05*Math.max(0,G.stars()-3)));G.add(c.want,-1);G.carry=c.want;G.delivering=c;
  G.walk([[R.gateOut.x,R.gateOut.y],[R.gateIn.x,R.gateIn.y],[s.x,96]],()=>{
    G.P.work('serve',.5,()=>{G.carry=null;G.delivering=null;c.st='eat';c.eatT=G.CFG.eatTime;
      G.walk([[R.gateIn.x,R.gateIn.y],[R.gateOut.x,R.gateOut.y],[R.home.x,R.home.y]])})})};

// MỞ / ĐÓNG CỬA: chỉ khi mở cửa khách mới đến. Đóng cửa → khách đang có trong quán vẫn được phục vụ nốt.
G.openShop=()=>{const S=G.S;if(S.open)return;S.open=true;S.spawn=Math.max(S.spawn,G.CFG.customerEvery*.75);
  const ready=Object.keys(G.RECIPES).filter(k=>S.inv[k]>0).length;
  G.msg(ready?'Mở cửa! Chào đón khách nhé':'Mở cửa rồi — chưa có món sẵn, nhớ nấu nhé!');G.snd&&G.snd.bell&&G.snd.bell()};
G.closeShop=()=>{const S=G.S;if(!S.open)return;S.open=false;G.msg(S.customers.length?'Đóng cửa — phục vụ nốt khách trong quán':'Đã đóng cửa')};
