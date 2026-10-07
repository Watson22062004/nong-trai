Z.shop={bg:mkBg(b=>{
  rr(b,0,0,400,118,'#ecd29a');
  for(let x=0;x<400;x+=10){rr(b,x,0,1,66,'#dcbc7c');if(x%30==0)rr(b,x+4,0,1,66,'#f6e2b4')}
  rr(b,0,66,400,5,'#8b5a2b');rr(b,0,71,400,47,'#a8573a');
  for(let x=0;x<400;x+=16){rr(b,x,72,1,46,'#8a4228');rr(b,x+1,72,1,46,'#c0704a')}
  awn(b,8,6,384,'#c8462e','#fffaf0');
  for(let x=30;x<380;x+=64)A.lantern(b,x,22,['#d8402e','#f2a82a'][(x/64|0)%2]);
  [[22,26],[330,26]].forEach(([x,y])=>{blk(b,x,y,52,36,'#3a2412');rr(b,x+4,y+4,44,28,'#2a1a10');for(let k=0;k<4;k++){rr(b,x+8,y+8+k*6,22,2,'#f2d04a');rr(b,x+34,y+8+k*6,10,2,'#e8e0c8')}});
  blk(b,104,26,208,46,'#3a2412');rr(b,108,30,200,38,'#5a3a20');rr(b,108,64,200,3,'#8b5a2b');
  blk(b,10,76,380,32,'#7a4a24');blk(b,6,72,388,8,'#d8b88a');
  for(let x=14;x<380;x+=22){rr(b,x,84,18,20,'#8b5a2b');rr(b,x+1,85,16,1,'#a87848');rr(b,x+7,92,4,2,'#f2d04a')}
  A.boards(b,0,118,400,36,'#a8733a','#946030');
  river(b,168);
  A.lamp(b,22,112);A.lamp(b,368,112);
  A.pot(b,2,130,'#3b8a8a');A.pot(b,384,130,'#c8643a');A.bush(b,60,128);A.bush(b,320,128,'#5fb04a');
},400,230),
 draw(t){const S=G.S;rip(t,174,400);
  
  Object.keys(G.RECIPES).forEach((k,i)=>{
    const x=118+i*46;
    blk(cx,x,32,36,28,'#a8733a');rr(cx,x+3,35,30,22,'#f6ecd2');
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
