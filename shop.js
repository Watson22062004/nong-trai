Z.shop={bg:mkBg(b=>{
  rr(b,0,0,W,100,'#d9b36a');for(let x=0;x<W;x+=6)rr(b,x,0,1,100,'#bf9650');
  rr(b,112,22,160,60,'#2a1a10');rr(b,115,25,154,54,'#5a3a20');rr(b,118,28,148,48,'#3a2412');
  awn(b,0,0,W+14,'#c8462e','#fffaf0');
  rr(b,12,92,360,36,'#2a1a10');rr(b,14,94,356,32,'#8b5a2b');rr(b,14,94,356,5,'#c08a4c');for(let x=26;x<370;x+=24)rr(b,x,100,1,26,'#6b4423');
  planks(b,0,128,W,48,'#a8733a','#8b5a2b');river(b,176)}),
 draw(t){const S=G.S;rip(t,181);
  Object.keys(G.RECIPES).forEach((k,i)=>{const x=122+i*36;IM(k,x+4,34,20);TS(G.RECIPES[k].price,x+14,70,'#f2d04a',8)});
  Object.keys(G.RECIPES).forEach((k,i)=>{const n=S.inv[k]||0,x=36+i*88;IM(k,x,74,22,n?1:.3);TS('×'+n,x+26,90,'#fff3d6',9,'left')});
  S.customers.forEach((c,i)=>{const x=34+i*88,f=c.p/G.CFG.patience,ok=G.has(c.want);
   R(x+3,164,22,3,'#0003');
   const keys=['char2_walk','char3_walk','char5_walk','char1_walk'];
   const ci=G.loadImg(G.ASSETS[keys[i%4]]);
   const fr=((t/140+i*3)|0)%4;
   // Khách đứng quay xuống (row 0)
   if(ci&&ci.complete){cx.imageSmoothingEnabled=false;cx.drawImage(ci,fr*16,0,16,16,x,128+(Math.sin(t/280+i)>.7?-1:0),32,32)}
   else D(G.SP.cust[i%4],x,132,2);
   BUB(x+1,104,c.want,ok?'#3ba56e':'#c8462e');R(x,98,26,4,'#2a1a10');R(x+1,99,24*f,2,f>.5?'#7bc96f':'#e2674a');
   HOT(x-6,100,40,70,()=>G.serve(i),{sx:x+40,sy:162,anim:'serve',dur:.8})});
  if(!S.customers.length)TS('Chưa có khách, chuẩn bị món nhé…',W/2,150,'#fff3d6',9);
  // POI
  G.drawPOI(50,200,'Làng','hub',50,200,1);
  G.P.draw(t);palm(14,178,t);palm(372,178,t+400)}};
