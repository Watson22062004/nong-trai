Z.kitchen={bg:mkBg(b=>{
  for(let y=0;y<150;y+=8)for(let x=0;x<W;x+=16){const off=(y/8%2)*8;rr(b,x+off,y,15,7,['#c07050','#b06040','#d08060'][hs(x,y)%3]);rr(b,x+off,y+7,15,1,'#8a4a30')}
  // Cửa sổ sông
  rr(b,18,16,54,48,'#2a1a10');rr(b,21,19,48,42,'#6cb6dd');rr(b,21,40,48,8,'#3f8fc4');
  rr(b,34,19,3,42,'#5a3a20');rr(b,48,19,3,42,'#5a3a20');
  rr(b,248,14,8,22,'#5a3a20');rr(b,236,16,32,10,'#f2d04a'); // đèn lồng
  // Kệ hũ
  rr(b,286,28,92,7,'#8b5a2b');rr(b,286,64,92,7,'#8b5a2b');
  for(let i=0;i<5;i++){rr(b,292+i*16,16,12,14,'#2a1a10');rr(b,293+i*16,17,10,12,['#c8462e','#8fc8e0','#d9a066','#6fb04e','#e8d27a'][i])}
  for(let i=0;i<4;i++){rr(b,296+i*18,52,14,14,'#2a1a10');rr(b,297+i*18,53,12,12,['#a8573a','#5a3a20','#c08a4c','#3b6ea5'][i])}
  // Bệ bếp
  rr(b,118,78,150,36,'#5a3a20');rr(b,122,82,142,28,'#8a4a30');
  rr(b,128,58,40,22,'#a0a8b0');rr(b,132,54,32,10,'#c0c8d0');rr(b,140,48,16,8,'#9098a0');
  rr(b,186,56,36,24,'#8a9098');rr(b,190,52,28,8,'#b0b8c0');
  // Củi + lu
  for(let i=0;i<5;i++)rr(b,24+i*12,132,14,8,'#8b5a2b');
  for(let i=0;i<4;i++)rr(b,30+i*12,124,14,8,'#a07040');
  rr(b,330,112,42,46,'#2a1a10');rr(b,333,115,36,40,'#8b5a2b');rr(b,340,122,22,22,'#a07040');
  // Sàn gỗ
  rr(b,0,156,W,H-156,'#6b4423');
  for(let x=0;x<W;x+=18)rr(b,x,156,1,H-156,'#5a3a20');
  rr(b,0,156,W,4,'#8b5a2b');
},400,230),
 draw(t){const S=G.S;
  for(let i=0;i<3;i++){const h=5+Math.sin(t/80+i)*4;R(146+i*10,70-h,5,h,'#e8892a');R(147+i*10,70-h/2,3,h/2,'#f2d04a')}
  for(let i=0;i<3;i++){const x=132+i*40,y=62,q=S.cooking[i];
   R(x,y+16,30,16,'#2a1a10');R(x+2,y+18,26,12,'#c0c8d0');R(x+10,y+10,8,8,'#8a9098');
   if(q){const r=G.RECIPES[q.r],f=i?0:q.t/r.time;R(x,y+4,30,4,'#2a1a10');R(x+1,y+5,28*f,2,'#4f9a45');BUB(x+3,y-16,q.r);
    if(!i)for(let k=0;k<3;k++){const yy=(t/28+k*9)%16;R(x+6+k*6,y+8-yy,2,2,'#fff8')}}
   else R(x+8,y+8,12,4,'#e8d27a')}
  HOT(124,48,140,70,()=>{G.ui.modal='cook'},{sx:190,sy:130,anim:'stir',dur:.8});
  // Mẹ lá chuối để món chín
  R(250,168,120,28,'#3f7a32');R(252,170,116,24,'#4a9a3c');
  Object.keys(G.RECIPES).forEach((k,i)=>{const n=S.inv[k]||0,x=258+i*28;IM(k,x,174,18,n?1:.35);TS('×'+n,x+9,198,'#fff6e4',7)});
  if(!S.cooking.length)TS('Chạm chõ để nấu',200,146,'#fff6e4',9);
  G.drawDoor(46,188,'farm',46,196);
  G.P.draw(t)}};
