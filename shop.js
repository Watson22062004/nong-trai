Z.shop={bg:mkBg(b=>{
  // Nền quán ven sông
  rr(b,0,0,400,118,'#e7c98a');
  for(let x=0;x<400;x+=8)rr(b,x,0,1,118,'#d2ae68');
  awn(b,8,6,384,'#c8462e','#fffaf0');
  // Quầy gỗ
  rr(b,16,78,368,28,'#5a3a20');rr(b,18,80,364,22,'#8b5a2b');rr(b,18,80,364,4,'#c4a06a');
  for(let x=28;x<370;x+=22)rr(b,x,86,1,16,'#6b4423');
  // Kệ trưng món
  rr(b,108,28,200,40,'#3a2412');rr(b,112,32,192,32,'#5a3a20');
  planks(b,0,118,400,36,'#a8733a','#8b5a2b');
  river(b,168);
  // Trụ đèn
  rr(b,24,124,4,28,'#5a3a20');rr(b,372,124,4,28,'#5a3a20');
},400,230),
 draw(t){const S=G.S;rip(t,174,400);
  R(30,118,8,10,'#f2d04a');R(376,118,8,10,'#f2d04a');
  Object.keys(G.RECIPES).forEach((k,i)=>{
    const x=118+i*46;
    R(x,36,36,22,'#3f7a32');R(x+2,38,32,18,'#7bc653');
    IM(k,x+8,34,20);
    TS(G.RECIPES[k].price,x+18,66,'#f2d04a',8);
  });
  Object.keys(G.RECIPES).forEach((k,i)=>{const n=S.inv[k]||0,x=28+i*90;IM(k,x,84,18,n?1:.35);TS('×'+n,x+20,98,'#fff6e4',8,'left')});
  S.customers.forEach((c,i)=>{const x=36+i*86,f=c.p/G.CFG.patience,ok=G.has(c.want);
   R(x+6,156,20,3,'#0003');
   const keys=['char2_walk','char3_walk','char5_walk','char1_walk'];
   const ci=G.loadImg(G.ASSETS[keys[i%4]]);
   const fr=((t/140+i*3)|0)%4;
   if(ci&&ci.complete){cx.imageSmoothingEnabled=false;cx.drawImage(ci,fr*16,0,16,16,x,122+(Math.sin(t/280+i)>.7?-1:0),30,30)}
   else D(G.SP.cust[i%4],x,126,2);
   BUB(x+2,98,c.want,ok?'#3ba56e':'#c8462e');
   R(x,94,26,3,'#2a1a10');R(x+1,95,24*f,1,f>.5?'#7bc96f':'#e2674a');
   HOT(x-4,96,40,64,()=>G.serve(i),{sx:x+36,sy:150,anim:'serve',dur:.8})});
  if(!S.customers.length)TS('Chưa có khách',200,140,'#fff6e4',9);
  G.drawDoor(24,150,'hub',36,158);
  G.P.draw(t);
  palm(360,166,t);palm(20,166,t+300)}};
