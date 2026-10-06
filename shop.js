Z.shop={bg:mkBg(b=>{
  rr(b,0,0,400,116,'#f0d7a0');
  for(let x=0;x<400;x+=8)rr(b,x,0,1,116,'#e2c48a');
  awn(b,6,4,388,'#c8462e','#fffaf0');
  rr(b,14,76,372,30,'#5a3a20');rr(b,16,78,368,24,'#8b5a2b');rr(b,16,78,368,4,'#c4a06a');
  for(let x=28;x<370;x+=20)rr(b,x,84,1,16,'#6b4423');
  rr(b,104,26,206,42,'#3a2412');rr(b,108,30,198,34,'#5a3a20');
  planks(b,0,116,400,38,'#a8733a','#8b5a2b');
  river(b,168);
  rr(b,22,122,4,26,'#5a3a20');rr(b,374,122,4,26,'#5a3a20');
  rr(b,18,114,12,10,'#f2d04a');rr(b,370,114,12,10,'#f2d04a');
},400,230),
 draw(t){const S=G.S;rip(t,174,400);
  Object.keys(G.RECIPES).forEach((k,i)=>{
    const x=116+i*48;
    R(x,34,38,22,'#3f7a32');R(x+2,36,34,18,'#7bc653');
    IM(k,x+9,32,20);TS(G.RECIPES[k].price,x+19,64,'#f2d04a',8);
  });
  Object.keys(G.RECIPES).forEach((k,i)=>{const n=S.inv[k]||0,x=26+i*92;IM(k,x,82,18,n?1:.35);TS('×'+n,x+20,98,'#fff6e4',8,'left')});
  S.customers.forEach((c,i)=>{const x=34+i*88,f=c.p/G.CFG.patience,ok=G.has(c.want);
   R(x+6,154,20,3,'#0003');
   const keys=['char2_walk','char3_walk','char5_walk','char1_walk'];
   const ci=G.loadImg(G.ASSETS[keys[i%4]]);
   const fr=((t/140+i*3)|0)%4;
   if(ci&&ci.complete){cx.imageSmoothingEnabled=false;cx.drawImage(ci,fr*16,0,16,16,x,120+(Math.sin(t/280+i)>.7?-1:0),30,30)}
   else D(G.SP.cust[i%4],x,124,2);
   BUB(x+2,96,c.want,ok?'#3ba56e':'#c8462e');
   R(x,92,26,3,'#2a1a10');R(x+1,93,24*f,1,f>.5?'#7bc96f':'#e2674a');
   HOT(x-4,94,40,64,()=>G.serve(i),{sx:x+36,sy:148,anim:'serve',dur:.8})});
  if(!S.customers.length)TS('Chưa có khách',200,138,'#fff6e4',9);
  G.drawDoor(28,148,'hub',40,156);
  G.P.draw(t);
  palm(362,166,t);palm(18,166,t+260)}};
