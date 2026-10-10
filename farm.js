Z.farm={bg:mkBg(b=>{
  grass(b);
  // Bản đồ 700×400. Khung đã có công trình: nhà bếp, luống rau (10×6), chuồng, giếng, hàng rào, đường, cổng, sông.
  // Cây (cao hơn nhà một chút), bụi, đá, hoa chỉ được đặt vào chỗ trống nên không đè lên nhà hay luống.
  const K=[[4,10,118,112],[150,14,284,166],[452,0,214,208],[292,184,46,50],[146,176,294,18],[262,196,30,26],[0,258,700,34],[606,232,90,60],[0,322,700,80]];
  let n=0;for(let i=0;i<500&&n<12;i++){const x=hs(i,7)%650,y=14+hs(i,8)%270,s=1.3+(i%3)*.1,w=Math.round(24*s),h=Math.round(33*s)+6;
   if(!roomFor(K,x,y-5,w,h,6))continue;A.tree(b,x,y,i%2?'#5fb04a':'#4a9a3c',s);K.push([x,y-5,w,h]);n++}
  n=0;for(let i=0;i<400&&n<16;i++){const x=hs(i,17)%680,y=14+hs(i,18)%290;if(!roomFor(K,x,y,20,14,3))continue;A.bush(b,x,y,i%2?'#5fb04a':'#4a9a3c');K.push([x,y,20,14]);n++}
  n=0;for(let i=0;i<70&&n<6;i++){const x=hs(i,27)%680,y=14+hs(i,28)%290;if(!roomFor(K,x,y,10,7,3))continue;A.stone(b,x,y,8);K.push([x,y,10,7]);n++}
  for(let i=0;i<90;i++){const x=hs(i,41)%690,y=10+hs(i,42)%300;if(roomFor(K,x,y,6,8,1))A.flower(b,x,y,['#f2d04a','#f6b0c0','#fff','#b8a0e8'][i%4])}
  // Chuồng mái lá (x 456–638): nền rơm, vách ván phía sau, mái rơm, 2 cột lớn, máng nước, bó rơm
  rr(b,476,34,148,158,'#d4b27a');
  for(let i=0;i<64;i++){const x=478+hs(i,3)%144,y=38+hs(i,4)%150;rr(b,x,y,5+hs(i,5)%4,1,i%3?'#e8cd6e':'#b88a4a')}
  [[500,110,16,6],[560,84,14,5],[520,152,18,5],[590,130,16,5]].forEach(([x,y,w,h])=>{rr(b,x,y,w,h,'#c49a60');rr(b,x+1,y,w-2,1,'#b88a4a')});
  A.walls(b,464,28,170,30,'#a8733a',0);rr(b,468,56,162,2,'#8a5a30');
  A.thatch(b,456,8,186,26,'#d8b56a');
  blk(b,468,30,6,164,'#6b4423');blk(b,624,30,6,164,'#6b4423');for(let y=36;y<190;y+=9){rr(b,469,y,1,5,'#8b5a2b');rr(b,625,y,1,5,'#8b5a2b')}
  blk(b,486,170,110,10,'#8b5a2b');rr(b,490,172,102,4,'#6cb6dd');rr(b,492,172,34,1,'#a8d8f0');rr(b,486,170,110,1,'#a8733a');
  A.hay(b,482,192,7);A.hay(b,618,192,7);
  // Đường đất ra cổng làng
  rr(b,0,262,700,26,'#c4a06a');rr(b,0,262,700,3,'#a8844a');rr(b,0,285,700,3,'#a8844a');
  river(b,330);
  // Giếng
  A.well(b,314,230);
  // Hàng rào trước ruộng (ngay dưới hàng luống cuối)
  for(let x=150;x<430;x+=14){rr(b,x,178,3,12,'#8b5a2b');rr(b,x,178,12,2,'#c4a06a')}
},700,400),
 draw(t){const S=G.S,SP=G.SP;rip(t,336,700);
  S.plots.forEach((p,i)=>{const{x,y}=G.plotPos(i);
   if(!G.plotOpen(i)){ // ô chưa mở: chỉ vẽ đúng 1 ô khoá kế tiếp (chạm để mua), các ô sau ẩn đi
    if(G.plotOrder(i)!==S.plotsOpen)return;
    R(x+1,y+2,24,24,'#0003');R(x,y,24,24,'#3a2a1c');R(x+1,y+1,22,22,'#6b5a48');R(x+2,y+2,20,20,'#7d6a55');
    R(x+9,y+6,6,1,'#2a1a10');R(x+9,y+7,1,4,'#2a1a10');R(x+14,y+7,1,4,'#2a1a10');R(x+8,y+10,8,7,'#f2b632');R(x+11,y+12,2,3,'#2a1a10');
    TS(G.shortNum(G.plotCost()),x+12,y+23,'#ffe27a',7);
    HOT(x,y,24,24,()=>G.buyPlot(),{sx:x+12,sy:y+28});return}
   R(x+1,y+2,24,24,'#0003');
   R(x,y,24,24,'#5a3a20');
   R(x+1,y+1,22,22,'#b07a42');R(x+2,y+2,20,20,'#c48a52');
   R(x+3,y+6,18,1,'#9a6a38');R(x+3,y+12,18,1,'#9a6a38');R(x+3,y+18,18,1,'#9a6a38');
   if(p){const s=G.plantSprite(p.crop,G.plantStage(p));D(s,x+12-s.width/2,y+23-s.height)}
   HOT(x,y,24,24,()=>G.plotClick(i),{sx:x+12,sy:y+28,anim:'dig'})});
  S.plots.forEach((p,i)=>{if(p&&p.t>=G.CROPS[p.crop].time){const{x,y}=G.plotPos(i),by=y-8+Math.sin(t/200+i)*2;BUB(x+1,by,p.crop)}});
  S.animals.forEach((a,i)=>{const bx=486+(i%2)*62,by=46+Math.floor(i/2)*34,wk=Math.sin(t/900+i*2)*4;
   R(bx+wk+4,by+26,20,4,'#0003');
   if(a.type==='ga'){const ci=G.loadImg(G.ASSETS.chicken);if(ci.complete)cx.drawImage(ci,bx+wk,by+Math.abs(Math.sin(t/180+i))*2,32,16);else D(SP.ga,bx+wk,by,2)}
   else{D(SP[a.type],bx+wk,by,2,Math.cos(t/900+i*2)<0)}
   if(a.ready||!a.fed)BUB(bx+6,by-16+(a.ready?Math.sin(t/200)*2:0),a.ready?G.ANIMALS[a.type].make:'cam',a.ready?'#3ba56e':'#c8462e');
   HOT(bx-4,by-16,48,44,()=>a.ready?G.collect(i):a.fed?G.msg('Đang lớn…'):G.feed(i),{sx:bx+20,sy:by+34,anim:a.ready?'dig':'feed'})});
  // Nhà bếp lá dừa — vào bếp bằng cửa, không biển tên
  const hx=18,hy=48;
  const b=cx,L=hx-6,y=hy+70;
  R(L+2,y-2,96,6,'#0004');
  blk(b,L+4,y-38,88,38,'#f3e2c0');for(let i=0;i<10;i++)rr(b,L+9+i*8,y-34,1,32,'#e0cba0');
  rr(b,L+4,y-8,88,8,'#c4a06a');rr(b,L+4,y-8,88,1,'#8b5a2b');
  blk(b,L-4,y-54,104,16,'#c0402a');blk(b,L+6,y-64,84,12,'#d8553a');blk(b,L+20,y-71,56,8,'#e86848');
  for(let i=0;i<26;i++){rr(b,L-2+i*4,y-52,1,12,'#8a2d1c');if(i>3&&i<22)rr(b,L-2+i*4,y-62,1,8,'#a8301e')}
  blk(b,L+68,y-84,10,18,'#8a9098');rr(b,L+66,y-86,14,3,'#6a7078');
  for(let i=0;i<2;i++){const yy=(t/40+i*8)%14;R(L+71,y-90-yy,3,3,'#fff8')}
  blk(b,L+38,y-24,20,24,'#6b4423');rr(b,L+40,y-22,16,20,'#8b5a2b');rr(b,L+47,y-22,2,20,'#6b4423');rr(b,L+52,y-12,2,2,'#f2d04a');
  blk(b,L+10,y-28,16,14,'#9bd0e8');blk(b,L+70,y-28,16,14,'#9bd0e8');rr(b,L+17,y-27,1,12,'#7a4a24');rr(b,L+77,y-27,1,12,'#7a4a24');
  rr(b,L+8,y-14,20,3,'#8b5a2b');A.flower(b,L+11,y-18,'#f6b0c0');A.flower(b,L+18,y-18,'#f2d04a');
  poiSign(hx+42,y-44,58,'Nhà bếp');
  A.lantern(b,L,y-36,'#d8402e');A.lantern(b,L+88,y-36,'#f2a82a');
  A.pot(b,L+72,y-14,'#c8643a');for(let r=0;r<2;r++)for(let i=0;i<3-r;i++)orb(b,L+98+i*8+r*4,y-6-r*7,4,'#a8733a');
  
  HOT(hx,hy,90,70,()=>G.goZone('kitchen'),{sx:hx+42,sy:hy+66});
  D(G.SP.barrel,264,198,1.4);
  G.drawPOI(650,288,'Về làng','hub',630,276);
  G.P.draw(t);
  palm(24,328,t);palm(170,332,t+200);palm(340,330,t+500);palm(520,328,t+700);palm(672,330,t+300)}
};
