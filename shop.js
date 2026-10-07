// Nhà hàng: đứng sau quầy nhìn ra phòng ăn. Khách vào cửa → ra quầy gọi món → ngồi bàn → chờ món → ăn → trả tiền → ra về.
const SKINS=['char2_walk','char3_walk','char5_walk','char1_walk'];
Z.shop={bg:mkBg(b=>{
  // tường ván + ốp gỗ đỏ + xà nhà
  rr(b,0,0,384,46,'#ecd29a');for(let x=0;x<384;x+=10){rr(b,x,0,1,34,'#dcbc7c');if(x%30==0)rr(b,x+4,0,1,34,'#f6e2b4')}
  rr(b,0,33,384,2,'#6b3a22');rr(b,0,35,384,11,'#a8573a');for(let x=0;x<384;x+=16){rr(b,x,36,1,10,'#8a4228');rr(b,x+1,36,1,10,'#c0704a')}
  rr(b,0,0,384,6,'#6b4423');rr(b,0,0,384,1,'#8b5a2b');rr(b,0,5,384,1,'#3a2412');
  [22,326].forEach(x=>{blk(b,x,10,38,26,'#7a4a24');rr(b,x+3,13,32,20,'#8ed0ee');rr(b,x+3,13,32,7,'#a8dcf2');rr(b,x+18,13,2,20,'#7a4a24');rr(b,x+3,22,32,2,'#7a4a24');
    blk(b,x-2,8,9,22,'#d8553a');blk(b,x+31,8,9,22,'#d8553a');rr(b,x-4,34,46,4,'#a8733a')});
  [84,262].forEach(x=>{blk(b,x,10,40,22,'#2a1a10');rr(b,x+3,13,34,16,'#3a2a1c');for(let k=0;k<4;k++){rr(b,x+6,16+k*4,18,1,'#f2d04a');rr(b,x+28,16+k*4,6,1,'#e8e0c8')}});
  // cửa chính
  blk(b,172,16,40,32,'#7a4a24');rr(b,176,19,32,29,'#bfe6a0');rr(b,176,19,32,12,'#8ed0ee');orb(b,192,38,6,'#4a9a3c');rr(b,176,44,32,4,'#a8844a');
  for(let i=0;i<5;i++)rr(b,177+i*6,19,5,11,i%2?'#d8402e':'#f2c23a');
  // sàn phòng ăn + thảm
  A.boards(b,0,46,384,62,'#a8733a','#946030');
  rr(b,174,46,36,62,'#6a1c10');rr(b,176,46,32,62,'#c8462e');rr(b,178,46,28,62,'#a8301e');rr(b,176,46,1,62,'#f2d04a');rr(b,207,46,1,62,'#f2d04a');
  for(let y=54;y<104;y+=14){rr(b,190,y,4,4,'#f2d04a');rr(b,188,y+2,8,1,'#f2d04a')}
  A.pot(b,2,52,'#c8643a');A.pot(b,368,52,'#3b8a8a');
  // bàn + ghế
  G.REST.tables.forEach(t=>{rr(b,t.x-13,t.y+10,26,3,'#0003');rr(b,t.x-10,t.y+2,3,9,'#6b4423');rr(b,t.x+7,t.y+2,3,9,'#6b4423');
    blk(b,t.x-14,t.y-8,28,11,'#fff6e4');for(let i=0;i<6;i++)for(let j=0;j<2;j++)if((i+j)%2)rr(b,t.x-12+i*4,t.y-6+j*4,4,4,'#e8a0a0');
    rr(b,t.x-1,t.y-14,3,6,'#8ec8e0');orb(b,t.x,t.y-16,3,'#f6b0c0')});
  G.REST.seats.forEach(s=>{rr(b,s.x-4,s.y+2,2,6,'#5a3a20');rr(b,s.x+2,s.y+2,2,6,'#5a3a20');blk(b,s.x-5,s.y-18,10,14,'#8b5a2b');blk(b,s.x-6,s.y-5,12,7,'#c4803a')});
  // quầy
  blk(b,6,102,312,9,'#d8b88a');blk(b,352,102,26,9,'#d8b88a');blk(b,10,110,304,18,'#7a4a24');blk(b,354,110,20,18,'#7a4a24');
  for(let x=16;x<306;x+=38){blk(b,x,113,32,12,'#8b5a2b');rr(b,x+14,118,4,2,'#f2d04a')}
  blk(b,314,100,5,30,'#5a3a20');blk(b,350,100,5,30,'#5a3a20');rr(b,320,112,14,3,'#a8733a');rr(b,320,112,14,1,'#c4905a');
  blk(b,22,90,26,16,'#c0c8d0');rr(b,25,93,20,6,'#6fb04e');rr(b,27,101,16,3,'#8a929c');
  A.jar(b,60,96,'#c8462e');A.jar(b,72,96,'#d9a066');blk(b,88,98,14,8,'#fff6e4');blk(b,90,94,10,6,'#fff6e4');
  orb(b,176,102,4,'#f2c23a');rr(b,172,105,8,2,'#8b5a2b');
  // khu sau quầy: sàn caro, bếp, kho, tủ lạnh
  for(let y=130;y<192;y+=12)for(let x=0;x<384;x+=12){rr(b,x,y,12,12,((x+y)/12)%2?'#e8dcc0':'#d6c8a4');rr(b,x,y,12,1,'#f4ecd8')}
  rr(b,0,128,384,4,'#0003');
  blk(b,20,152,122,8,'#d8b88a');blk(b,22,160,118,28,'#9a5a3c');for(let y=163;y<186;y+=5)for(let x=24+(y%2)*5;x<138;x+=10)rr(b,x,y,9,1,'#6a3a24');
  for(let i=0;i<3;i++){const x=30+i*38;rr(b,x,166,24,18,OL);rr(b,x+1,167,22,17,'#1a0e08');rr(b,x+4,176,16,6,'#e8892a');rr(b,x+7,178,10,3,'#ffd86a')}
  A.sack(b,152,136);A.sack(b,166,140,'#d8c090');A.barrel(b,262,134);A.crate(b,282,142,16,12);A.basket(b,298,144,'#f2d04a');
  blk(b,356,132,24,54,'#eef3f6');rr(b,357,156,22,2,OL);rr(b,372,140,2,10,'#9098a0');rr(b,372,162,2,14,'#9098a0');rr(b,360,142,4,4,'#d8553a');
  A.pot(b,2,170,'#c8643a');
},384,216),
 draw(t){const S=G.S,RS=G.REST,dt=Math.min((t-(G._st||t))/1000,.1);G._st=t;
  const pop=(x,y,age,fn)=>{const k=eb(age/.35);cx.save();cx.translate(x+12,y+22);cx.scale(k,k);cx.translate(-x-12,-y-22);fn();cx.restore()};
  // ánh nắng cửa sổ + bụi bay + đèn lồng đung đưa có quầng sáng
  for(let j=0;j<40;j++){R(40+j*.8+Math.sin(t/2500)*3,46+j,16,1,'rgba(255,240,180,.06)');R(344-j*.8-Math.sin(t/2500)*3,46+j,16,1,'rgba(255,240,180,.06)')}
  for(let i=0;i<14;i++){const x=(i*61+t/35*(.4+i%3*.2))%384,y=50+((i*37+Math.sin(t/900+i)*8+t/90)%56);R(x,y,1,1,'rgba(255,255,230,.55)')}
  [[146,'#d8402e'],[236,'#f2a82a']].forEach(([x,c],i)=>{const sw=Math.sin(t/600+i*2)*1.6;
    ell(cx,Math.round(x+4+sw),20,22,16,'rgba(255,200,90,'+(.06+Math.sin(t/300+i)*.015).toFixed(3)+')');A.lantern(cx,x+Math.round(sw),14,c)});
  poiSign(192,3,64,'Nhà hàng');
  // cửa: hai cánh mở ra khi có khách qua, rèm noren đung đưa
  const near=S.customers.some(c=>(c.st==='in'||c.st==='leave')&&c.y<72);
  G._do=(G._do||0)+((near?1:0)-(G._do||0))*Math.min(1,dt*7);const o=G._do;
  R(176,19,32,29,'#bfe6a0');R(176,19,32,12,'#8ed0ee');orb(cx,192,38,6,'#4a9a3c');R(176,44,32,4,'#a8844a');
  const lw=Math.round(14*(1-o))+2;blk(cx,176,19,lw,29,'#8b5a2b');blk(cx,208-lw,19,lw,29,'#8b5a2b');
  if(lw>7){R(179,23,lw-6,9,'#9bd0e8');R(209-lw+3,23,lw-6,9,'#9bd0e8')}
  for(let i=0;i<5;i++){const sw=Math.sin(t/400+i*.6)*(1+o*2.5);R(177+i*6+sw,19,5,11-o*4,i%2?'#d8402e':'#f2c23a')}
  // bếp: lửa, chõ rung nắp khi nấu, tàn lửa
  for(let i=0;i<3;i++){const x=30+i*38,h=4+Math.sin(t/80+i*2)*3,on=S.cooking.length>i;
   for(let k=0;k<3;k++){const hh=(h+(k==1?3:0))*(on?1.4:1);R(x+6+k*6,182-hh,4,hh,'#e8892a');R(x+7+k*6,182-hh/2,2,hh/2,'#ffe27a')}
   if(on)for(let k=0;k<4;k++)R(x+4+((t/50+k*37)%18),176-(t/28+k*11)%22,1,1,'#ffb040')}
  for(let i=0;i<3;i++){const x=28+i*38,y=128,q=S.cooking[i],rat=q&&!i&&Math.sin(t/55)>.55?-1:0;
   blk(cx,x,y+14,28,10,'#8a929c');blk(cx,x+2,y+6,24,9,'#d9a860');for(let k=0;k<4;k++)R(x+5+k*5,y+8,1,5,'#a87838');
   blk(cx,x+5,y+1+rat,18,6,'#e8c878');R(x+12,y-2+rat,4,3,'#8b5a2b');
   if(q){const r=G.RECIPES[q.r],f=i?0:q.t/r.time;R(x,y-8,28,4,OL);R(x+1,y-7,26*f,2,f>.8?'#f2d04a':'#4f9a45');BUB(x+2,y-34+Math.sin(t/300+i)*1.5,q.r);
    if(!i)for(let k=0;k<4;k++){const yy=(t/26+k*7)%16,w=Math.sin(t/180+k)*2;R(x+7+k*4+w,y-yy,2,2,'rgba(255,255,255,'+(.8-yy/22).toFixed(2)+')')}}}
  if(S.customers.some(c=>c.st==='wait'&&!G.has(c.want))&&!S.cooking.length)TS('▼ Chạm bếp để nấu',80,112+Math.sin(t/200)*2,'#ffe27a',8);
  HOT(20,124,124,64,()=>{const o=S.customers.find(c=>c.st==='wait'||c.st==='toseat');if(!G.RECIPES[G.ui.rec]&&o)G.ui.rec=o.want;G.ui.pot={};G.ui.modal='cook'},{sx:80,sy:172,anim:'stir',dur:.6});
  // món sẵn trên quầy: nảy khi có món mới + bay từ nồi ra
  G._pc=G._pc||{};G._pb=G._pb||{};const pd=G.potDone;
  const have=Object.keys(G.RECIPES).filter(k=>S.inv[k]>0),shown=have.slice(0,6);
  Object.keys(G.RECIPES).forEach(k=>{const n=S.inv[k]||0;if(G._pc[k]!=null&&n>G._pc[k])G._pb[k]=t+1000;G._pc[k]=n});
  TS(shown.length?'Món sẵn':'Chưa có món sẵn',257,84,'#fff6e4',7);
  shown.forEach((k,i)=>{const x=200+i*19,bt=(t-(G._pb[k]||-1e9))/450,dy=bt>0&&bt<1?-7*Math.sin(bt*Math.PI):0;IM(k,x,88+dy,16);TS('×'+S.inv[k],x+8,108,'#2a1a10',7)});
  if(have.length>6)TS('+'+(have.length-6),316,96,'#fff6e4',8);
  if(pd&&t-pd.t<1100){const a=(t-pd.t)/1100,ix=Math.max(0,shown.indexOf(pd.r)),x=38+(200+ix*19-38)*eo(a),y=116+(88-116)*eo(a)-Math.sin(a*Math.PI)*28;
   IM(pd.r,x,y,16);TS('✦',x-5+Math.sin(t/60)*3,y-2,'#ffe27a',9);if(a<.35)TS('Xong!',56,110-a*20,'#ffe27a',9)}
  // khách
  S.customers.slice().sort((a,b)=>a.y-b.y).forEach(c=>{
   const ci=G.loadImg(G.ASSETS[SKINS[c.sk%4]]),mvg=c.path&&c.path.length>0,sit=c.st==='wait'||c.st==='serving'||c.st==='eat',
     fr=mvg?((t/120+c.sk*2)|0)%4:0,row=sit?0:(c.dir||0);
   let bob=mvg?-Math.abs(Math.sin(t/110+c.sk))*1.6:0,sq=mvg?1+Math.sin(t/110+c.sk)*.04:1,ox=0;
   if(sit)bob=3*(c.st==='wait'?eb(c.age/.3):1);
   if(c.st==='eat')bob=3+Math.abs(Math.sin(t/230+c.sk))*1.4;
   if(c.mad&&c.age<.9)ox=Math.sin(t/32)*1.6;
   const fade=Math.min(1,c.life/.4)*(c.st==='leave'&&c.y<62?Math.max(0,(c.y-50)/12):1);
   cx.globalAlpha=fade;R(c.x-8,c.y-1,16,3,'#0003');
   if(ci&&ci.complete){const dw=Math.round(26/sq),dh=Math.round(26*sq);cx.imageSmoothingEnabled=false;cx.drawImage(ci,fr*16,row*16,16,16,c.x-dw/2+ox,c.y-dh+bob,dw,dh)}
   cx.globalAlpha=1;
   const top=c.y-30;
   if(c.st==='order'||c.st==='queue'||c.st==='wait'){const f=Math.max(0,c.p/(c.st==='wait'?G.CFG.patience:G.CFG.patienceOrder));
     R(c.x-13,top-2,26,3,OL);R(c.x-12,top-1,24*f,1,f>.5?'#7bc96f':f>.25?'#f2a82a':(Math.sin(t/90)>0?'#e2674a':'#ffb0a0'))}
   if(c.st==='order'){pop(c.x-12,top-30,c.age,()=>BUB(c.x-12,top-30+Math.sin(t/200)*2,'face','#c8803a'));TS('Chạm nhận món',c.x,top-34,'#fff6e4',7);
     HOT(c.x-14,c.y-30,28,32,()=>G.takeOrder(c),{sx:192,sy:134,anim:'serve',dur:.35})}
   else if(c.st==='wait'){pop(c.x-12,top-30,c.age,()=>BUB(c.x-12,top-30,c.want,G.has(c.want)?'#3ba56e':'#c8462e'));
     HOT(c.x-14,c.y-30,28,36,()=>G.deliver(c),{sx:G.P.x,sy:G.P.y})}
   else if(c.st==='eat'){const sd=RS.seats[c.seat],tb=RS.tables[sd?sd.t:0],side=sd?sd.side:0,left=Math.max(0,c.eatT/G.CFG.eatTime),sc=.45+.55*left,sz=14*sc,
       dx=tb.x-7+side*5+(14-sz)/2,dy=-(1-eb(c.age/.4))*14,base=tb.y-24+(14-sz);
     IM(c.want,dx,base+dy,sz);
     for(let k=0;k<2;k++){const yy=(t/45+k*7)%12;R(tb.x-2+side*5+Math.sin(t/200+k*2)*2,base-yy,2,2,'rgba(255,255,255,'+(.6-yy/24).toFixed(2)+')')}
     TS('♥',c.x+Math.sin(t/200)*3,c.y-34-(t/60)%8,'#e2674a',8)}
   else if(c.st==='leave'){if(c.mad)TS('!',c.x,top-4+Math.sin(t/60)*1.5,'#e2674a',12);else if(c.age<1.2)TS('♥',c.x,top-4-c.age*14,'#e2674a',9)}});
  if(!S.customers.length)TS('Chờ khách…',192,86+Math.sin(t/500)*1.5,'#fff6e4',8);
  HOT(172,14,40,34,()=>G.walk([[RS.gateOut.x,RS.gateOut.y],[RS.gateIn.x,RS.gateIn.y],[192,60]],()=>G.goZone('hub')),{sx:G.P.x,sy:G.P.y});
  G.P.draw(t);
  if(G.carry){const bob=Math.sin(t/120)*1.5;IM(G.carry,G.P.x-8,G.P.y-48+bob,16);TS('✦',G.P.x+8+Math.sin(t/90)*3,G.P.y-46+Math.cos(t/110)*3,'#ffe27a',7)}}};
