// Làng (tên hiển thị lấy từ G.VILLAGE): nhà lá, kênh sen, đường lát đá, vườn rau, cổng chibi dẫn vào từng khu.
Z.hub={bg:mkBg(b=>{
  const Wd=640;
  [['#7fc0ea',0,30],['#9ccfee',30,24],['#bfe2f4',54,16],['#dff2f8',70,10]].forEach(([c,y,h])=>rr(b,0,y,Wd,h,c));
  disc(b,560,30,13,'#fff2a8');disc(b,560,30,10,'#ffe27a');
  A.cloud(b,60,14);A.cloud(b,290,8);A.cloud(b,450,24);
  [[60,86,48,'#8fb4cc'],[170,88,40,'#9cbfd4'],[330,86,52,'#8fb4cc'],[470,88,44,'#9cbfd4'],[590,86,46,'#8fb4cc']].forEach(([x,y,r,c])=>disc(b,x,y,r,c));
  grass(b);
  rr(b,0,70,Wd,16,'#7ec85e');
  [[0,92,60],[150,96,54],[300,94,62],[470,96,56],[620,92,50]].forEach(([x,y,r])=>disc(b,x,y,r,'#68b048'));
  rr(b,0,86,Wd,12,'#72bc52');
  for(let x=4;x<Wd;x+=34)A.tree(b,x,48+hs(x,1)%6,'#4a9a3c');
  // kênh nhánh + bờ + sen
  rr(b,90,92,60,5,'#9a6a3a');rr(b,90,92,60,1,'#c08a52');
  rr(b,90,96,60,28,OL);rr(b,90,99,60,22,'#3f8fc4');rr(b,90,99,60,3,'#6cb6dd');rr(b,90,121,60,4,'#9a6a3a');
  [[98,108],[112,114],[128,104],[140,113]].forEach(([x,y],i)=>A.lily(b,x,y,i%2));
  [88,152,96,148].forEach(x=>{rr(b,x,84,1,10,'#4a7a32');blk(b,x-1,82,3,5,'#8b5a2b')});
  // cầu gỗ
  blk(b,104,94,36,8,'#a07040');for(let i=0;i<6;i++)rr(b,108+i*5,95,1,6,'#6b4423');
  blk(b,106,86,4,12,'#6b4423');blk(b,134,86,4,12,'#6b4423');rr(b,106,88,30,2,'#8b5a2b');
  // đường làng lát đá
  rr(b,0,166,Wd,32,'#a8844a');
  for(let y=168;y<196;y+=7)for(let x=-4;x<Wd;x+=10){const o=(y/7%2)*5;rr(b,x+o,y,9,6,['#dcc08a','#d2b37c','#e4cc9c'][hs(x,y)%3]);rr(b,x+o,y+5,9,1,'#b8955a')}
  rr(b,292,60,28,240,'#a8844a');rr(b,230,58,152,40,'#a8844a');
  for(let y=60;y<300;y+=7)for(let x=292;x<320;x+=9){const o=(y/7%2)*4;rr(b,x+o,y,8,6,['#dcc08a','#d2b37c','#e4cc9c'][hs(x,y)%3]);rr(b,x+o,y+5,8,1,'#b8955a')}
  river(b,300);
  blk(b,294,296,32,44,'#a07040');for(let i=0;i<7;i++)rr(b,296,300+i*6,28,1,'#6b4423');blk(b,290,296,5,8,'#5a3a20');blk(b,325,296,5,8,'#5a3a20');
  for(let y=60;y<98;y+=7)for(let x=232;x<380;x+=10){const o=(y/7%2)*5;rr(b,x+o,y,9,6,['#dcc08a','#d2b37c','#e4cc9c'][hs(x,y)%3]);rr(b,x+o,y+5,9,1,'#b8955a')}
  // nhà lá hai bên
  A.hut(b,156,66,44);A.hut(b,452,60,56,'#c8e0a8','#c89a4a');A.hut(b,580,50,46,'#f0d8a0','#b88a3c');
  A.bush(b,204,98,'#5fb04a');A.bush(b,392,98);A.bush(b,512,92,'#5fb04a');A.flower(b,146,106,'#f6b0c0');
  // đèn đường + biển chỉ đường
  [186,400].forEach(x=>A.lamp(b,x,128));A.sign(b,326,134);
  // trâu gặm cỏ
  blk(b,108,130,28,15,'#5a5a62');blk(b,130,124,14,11,'#6a6a72');rr(b,131,122,3,4,'#e8e0c8');rr(b,141,122,3,4,'#e8e0c8');rr(b,140,130,2,2,OL);
  rr(b,112,145,4,7,'#3a3a42');rr(b,128,145,4,7,'#3a3a42');rr(b,104,132,4,10,'#3a3a42');
  // vườn rau trang trí
  A.fence(b,10,204,10);
  for(let i=0;i<4;i++){blk(b,14,220+i*13,72,10,'#6b4423');rr(b,16,222+i*13,68,5,'#4a3018');
   for(let k=0;k<6;k++){const x=20+k*11;orb(b,x,219+i*13,3,['#7bc653','#e8483a','#4a9a3c','#f2a82a'][(i+k)%4]);rr(b,x,221+i*13,1,2,'#3f7a32')}}
  // nhà đối diện + sân
  A.hut(b,440,206,56,'#e8c888','#c0502e');A.crate(b,500,236,16,12);A.crate(b,504,226,14,11,'#c49050');A.barrel(b,424,236);A.basket(b,438,252,'#f2a82a');
  // ao sen
  ell(b,208,244,38,17,OL);ell(b,208,244,36,15,'#3f8fc4');ell(b,208,241,34,10,'#5fa8d8');
  [[188,240,1],[206,246,0],[226,238,1],[216,252,0],[196,252,1]].forEach(([x,y,f])=>A.lily(b,x,y,f));
  for(let a=0;a<12;a++)A.stone(b,208+Math.cos(a/12*6.283)*40|0,244+Math.sin(a/12*6.283)*20|0,8);
  // cây + bụi + hoa
  A.tree(b,120,226);A.tree(b,560,214,'#4a9a3c');A.tree(b,360,222,'#5fb04a');A.bush(b,310,262);A.bush(b,90,282,'#5fb04a');A.bush(b,520,262);A.bush(b,600,230,'#5fb04a');
  for(let x=14;x<Wd;x+=24){const y=200+hs(x,3)%4;A.flower(b,x,y,['#f2d04a','#f6b0c0','#fff','#b8a0e8'][hs(x,5)%4])}
},640,360),
 draw(t){
  rip(t,306,640);
  for(let i=0;i<6;i++)R(92+(t/50+i*24)%48,110+(i%2)*4,8,1,'#b4e1f4');
  for(let i=0;i<2;i++){const x=((t/40+i*300)%700)-30,y=22+i*18+Math.sin(t/200+i)*3,w=Math.sin(t/110+i)>0?2:-1;R(x,y,4,1,OL);R(x-2,y+w,2,1,OL);R(x+4,y+w,2,1,OL)}
  palm(36,292,t);palm(150,292,t+200);palm(600,292,t+80);
  banana(188,132,t);banana(540,140,t+300);
  const bx=((t/70)%720)-50;blk(cx,bx,314,40,9,'#a8733a');blk(cx,bx+10,306,18,9,'#e8d27a');rr(cx,bx+30,300,10,3,'#f2d9a0');rr(cx,bx+33,297,4,3,'#f2d9a0');
  dog(150+Math.sin(t/700)*40,158,t);cat(380,152,t);
  G.drawPOI(44,170,'Ruộng nhà','farm',44,184);
  G.drawPOI(598,170,'Xe đẩy','stall',598,184);
  G.drawPOI(250,66,'Chợ đầu mối','market',250,82);
  G.drawPOI(358,66,'Thú cưng','pets',358,82);
  G.P.draw(t)}};
