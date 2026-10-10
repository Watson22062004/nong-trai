// Làng (tên hiển thị lấy từ G.VILLAGE): nhà lá, kênh sen, đường lát đá, vườn rau, cổng chibi dẫn vào từng khu.
Z.hub={bg:mkBg(b=>{
  const Wd=640;
  // trời + mặt trời + mây, núi xa, đồi gần; cỏ bắt đầu từ đường chân trời (y=56)
  A.sky(b,Wd,60);A.sun(b,560,24,11);
  A.cloud(b,40,8,1);A.cloud(b,170,22,.7);A.cloud(b,300,4,1.2);A.cloud(b,440,18,.9);A.cloud(b,600,34,.6);
  A.hills(b,0,30,Wd,34,'#a6c4d8',1);A.hills(b,0,40,Wd,26,'#86b4a2',2);A.hills(b,0,49,Wd,16,'#6aa86a',3);
  grass(b,56);
  rr(b,0,70,Wd,16,'#7ec85e');
  [[0,92,60],[150,96,54],[300,94,62],[470,96,56],[620,92,50]].forEach(([x,y,r])=>disc(b,x,y,r,'#68b048'));
  rr(b,0,86,Wd,12,'#72bc52');
  // Khung chiếm chỗ của công trình, đường, nước: cây / bụi / hoa chỉ đặt vào chỗ trống nên không đè lên nhau
  const K=[[163,60,54,60],[449,54,66,62],[577,44,56,62],[437,200,66,60],              // 4 nhà lá
   [0,90,94,76],[564,92,70,76],[200,0,102,70],[314,0,92,70],                          // cổng Ruộng nhà, Xe đẩy, Chợ, Thú cưng
   [96,78,68,52],[220,66,172,38],[292,66,28,234],[0,166,640,32],                      // mương + cầu, quảng trường, đường dọc, đường ngang
   [152,216,116,56],[8,200,80,74],[420,224,100,38],[288,292,44,60],                   // ao sen, vườn rau, sân nhà đối diện, bến
   [184,120,14,48],[398,120,14,48],[322,130,24,30],[204,124,28,36],[528,126,28,36],[110,128,52,40]]; // đèn, biển, chuối, trâu
  for(let x=4;x<Wd;x+=38){const s=1.5,y=11+hs(x,1)%4;if(roomFor(K,x,y-5,Math.round(24*s),Math.round(33*s)+6,2))A.tree(b,x,y,hs(x,2)%2?'#4a9a3c':'#5fb04a',s)}
  // kênh nhánh + bờ + sen
  A.waterRect(b,102,97,56,24);
  [[110,109],[124,115],[138,105],[150,113]].forEach(([x,y],i)=>i%2?A.lotus(b,x,y,'#f6b0c0'):A.pad(b,x,y,4));
  A.reeds(b,104,101,3,1);A.reeds(b,156,101,3,2);
  [98,162,106,158].forEach(x=>{rr(b,x,84,1,10,'#4a7a32');blk(b,x-1,82,3,5,'#8b5a2b')});
  // cầu gỗ
  blk(b,114,94,36,8,'#a07040');for(let i=0;i<6;i++)rr(b,118+i*5,95,1,6,'#6b4423');
  blk(b,116,86,4,12,'#6b4423');blk(b,144,86,4,12,'#6b4423');rr(b,116,88,30,2,'#8b5a2b');
  // đường làng lát đá
  rr(b,0,166,Wd,32,'#a8844a');
  for(let y=168;y<196;y+=7)for(let x=-4;x<Wd;x+=10){const o=(y/7%2)*5;rr(b,x+o,y,9,6,['#dcc08a','#d2b37c','#e4cc9c'][hs(x,y)%3]);rr(b,x+o,y+5,9,1,'#b8955a')}
  rr(b,292,66,28,234,'#a8844a');rr(b,220,66,172,38,'#a8844a');
  for(let y=66;y<300;y+=7)for(let x=292;x<320;x+=9){const o=(y/7%2)*4;rr(b,x+o,y,8,6,['#dcc08a','#d2b37c','#e4cc9c'][hs(x,y)%3]);rr(b,x+o,y+5,8,1,'#b8955a')}
  river(b,300);
  blk(b,294,296,32,44,'#a07040');for(let i=0;i<7;i++)rr(b,296,300+i*6,28,1,'#6b4423');blk(b,290,296,5,8,'#5a3a20');blk(b,325,296,5,8,'#5a3a20');
  for(let y=66;y<104;y+=7)for(let x=222;x<390;x+=10){const o=(y/7%2)*5;rr(b,x+o,y,9,6,['#dcc08a','#d2b37c','#e4cc9c'][hs(x,y)%3]);rr(b,x+o,y+5,9,1,'#b8955a')}
  // nhà lá hai bên
  A.hut(b,166,66,44);A.hut(b,452,60,56,'#c8e0a8','#c89a4a');A.hut(b,580,50,46,'#f0d8a0','#b88a3c');
  A.bush(b,224,112,'#5fb04a');A.bush(b,404,108);A.bush(b,520,110,'#5fb04a');A.flower(b,164,132,'#f6b0c0');
  // đèn đường + biển chỉ đường
  [186,400].forEach(x=>A.lamp(b,x,124));A.sign(b,326,134);
  // trâu gặm cỏ (dời xuống khỏi bờ mương)
  b.save();b.translate(10,8);
  blk(b,108,130,28,15,'#5a5a62');blk(b,130,124,14,11,'#6a6a72');rr(b,131,122,3,4,'#e8e0c8');rr(b,141,122,3,4,'#e8e0c8');rr(b,140,130,2,2,OL);
  rr(b,112,145,4,7,'#3a3a42');rr(b,128,145,4,7,'#3a3a42');rr(b,104,132,4,10,'#3a3a42');b.restore();
  // vườn rau trang trí
  A.fence(b,10,204,10);
  for(let i=0;i<4;i++){blk(b,14,220+i*13,72,10,'#6b4423');rr(b,16,222+i*13,68,5,'#4a3018');
   for(let k=0;k<6;k++){const x=20+k*11;orb(b,x,219+i*13,3,['#7bc653','#e8483a','#4a9a3c','#f2a82a'][(i+k)%4]);rr(b,x,221+i*13,1,2,'#3f7a32')}}
  // nhà đối diện + sân
  A.hut(b,440,206,56,'#e8c888','#c0502e');A.crate(b,500,236,16,12);A.crate(b,504,226,14,11,'#c49050');A.barrel(b,424,236);A.basket(b,438,252,'#f2a82a');
  // ao sen
  A.pond(b,208,244,38,17,3);
  // cây + bụi + hoa
  [[112,212,'#4a9a3c'],[556,206,'#4a9a3c'],[352,216,'#5fb04a']].forEach(([x,y,c])=>{A.tree(b,x,y,c,1.35);K.push([x,y-5,32,52])});
  // thêm cây vào các khoảng trống còn lại (không đè nhà, đường, ao, vườn)
  let tn_=0;for(let i=0;i<120&&tn_<8;i++){const x=hs(i,61)%600,y=70+hs(i,62)%200,s=1.3,w=Math.round(24*s),h=Math.round(33*s)+6;
   if(!roomFor(K,x,y-5,w,h,8))continue;A.tree(b,x,y,i%2?'#4a9a3c':'#5fb04a',s);K.push([x,y-5,w,h]);tn_++}
  [[330,268,'#4a9a3c'],[90,282,'#5fb04a'],[524,268,'#4a9a3c'],[604,232,'#5fb04a']].forEach(([x,y,c])=>{A.bush(b,x,y,c);K.push([x,y,20,14])});
  for(let x=14;x<Wd;x+=24){const y=200+hs(x,3)%4;if(roomFor(K,x,y-6,8,10,0))A.flower(b,x,y,['#f2d04a','#f6b0c0','#fff','#b8a0e8'][hs(x,5)%4])}
},640,360),
 draw(t){
  rip(t,306,640);
  for(let i=0;i<6;i++)R(102+(t/50+i*24)%48,110+(i%2)*4,8,1,'#b4e1f4');
  for(let i=0;i<2;i++){const x=((t/40+i*300)%700)-30,y=22+i*18+Math.sin(t/200+i)*3,w=Math.sin(t/110+i)>0?2:-1;R(x,y,4,1,OL);R(x-2,y+w,2,1,OL);R(x+4,y+w,2,1,OL)}
  palm(36,292,t);palm(150,292,t+200);palm(600,292,t+80);
  banana(216,138,t);banana(540,140,t+300);
  A.sampan(cx,((t/70)%760)-60,310,t);
  [[0,2600,22,9,'#f08a3a'],[3.1,-2200,18,7,'#fff6e4']].forEach(([ph,sp,ax,ay,c])=>{const a=t/Math.abs(sp)*Math.sign(sp)+ph;A.koi(cx,208+Math.cos(a)*ax,246+Math.sin(a)*ay,-Math.sin(a)*Math.sign(sp)>=0?1:-1,t,c)});
  [0,1,2].forEach(i=>{const p=[[196,238],[220,241],[210,252]][i],r=((t/110)+i*5)%12;if(r<9)A.ring(cx,p[0],p[1],Math.floor(r)+2)});
  dog(150+Math.sin(t/700)*40,178,t);cat(380,152,t);
  G.drawPOI(44,162,'Ruộng nhà','farm',44,184);
  G.drawPOI(598,162,'Xe đẩy','stall',598,184);
  G.drawPOI(250,66,'Chợ đầu mối','market',250,82);
  G.drawPOI(358,66,'Thú cưng','pets',358,82);
  G.P.draw(t)}};
