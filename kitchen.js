// Bếp nhà: tường ván tre + ốp gạch, cửa sổ nhìn sông, bếp củi 3 chõ, kệ hũ, tủ lạnh, củi, bao gạo.
Z.kitchen={bg:mkBg(b=>{
  const W=400,H=230;
  // tường ván tre + gờ gỗ + ốp gạch xanh
  rr(b,0,0,W,148,'#ecd29a');
  for(let x=0;x<W;x+=10){rr(b,x,0,1,96,'#dcbc7c');if(x%30==0)rr(b,x+4,0,1,96,'#f6e2b4')}
  rr(b,0,96,W,6,'#8b5a2b');rr(b,0,96,W,1,'#c4905a');rr(b,0,101,W,1,'#4a2c16');
  for(let y=102;y<148;y+=9)for(let x=0;x<W;x+=10){const o=(y%2?0:5);rr(b,x,y,9,8,((x/10|0)+(y/9|0))%2?'#5bb5ae':'#4aa3a0');rr(b,x,y,9,1,'#8fd6cf');rr(b,x,y+7,9,1,'#37827f')}
  // xà nhà
  rr(b,0,0,W,9,'#6b4423');rr(b,0,0,W,2,'#8b5a2b');rr(b,0,8,W,1,'#3a2412');
  for(let x=30;x<W;x+=90){rr(b,x,9,6,6,'#5a3a20');rr(b,x,14,6,1,'#3a2412')}
  // cửa sổ nhìn sông + rèm
  blk(b,14,14,62,54,'#7a4a24');rr(b,19,19,52,44,'#8ed0ee');rr(b,19,19,52,14,'#a8dcf2');
  disc(b,56,28,5,'#ffe27a');rr(b,19,38,52,5,'#7fb06a');
  [[24,34],[34,32],[62,35]].forEach(([x,y])=>{rr(b,x,y,2,6,'#6b4423');rr(b,x-3,y-3,8,4,'#3f9a4a')});
  rr(b,19,44,52,19,'#4a9ad0');rr(b,24,50,10,1,'#9ad4f0');rr(b,44,55,14,1,'#9ad4f0');rr(b,58,48,8,1,'#9ad4f0');
  rr(b,44,19,2,44,'#7a4a24');rr(b,19,40,52,2,'#7a4a24');
  blk(b,14,12,11,36,'#d8553a');blk(b,65,12,11,36,'#d8553a');rr(b,18,16,1,28,'#f08060');rr(b,69,16,1,28,'#f08060');
  rr(b,14,34,11,2,'#f2d04a');rr(b,65,34,11,2,'#f2d04a');rr(b,10,10,70,3,'#8b5a2b');
  blk(b,10,66,70,5,'#a8733a');A.pot(b,38,50);
  // tranh làng dừa
  blk(b,86,22,26,20,'#8b5a2b');rr(b,89,25,20,14,'#bfe6f2');rr(b,89,35,20,4,'#f2d04a');rr(b,99,28,2,8,'#6b4423');rr(b,94,26,12,3,'#3f9a4a');
  // đèn lồng
  A.lantern(b,100,24);A.lantern(b,196,16,'#f2a82a');A.lantern(b,270,24);
  // kệ hũ phải
  blk(b,284,28,96,6,'#8b5a2b');blk(b,284,64,96,6,'#8b5a2b');
  ['#c8462e','#8fc8e0','#d9a066','#6fb04e','#e8d27a'].forEach((c,i)=>A.jar(b,290+i*18,17,c));
  ['#a8573a','#5a3a20','#c08a4c','#3b6ea5'].forEach((c,i)=>A.jar(b,294+i*20,53,c));
  for(let i=0;i<4;i++){rr(b,300+i*18,38,1,8,'#6b4423');orb(b,300+i*18,48,2,i%2?'#e8483a':'#f2f0d8')}
  // giá treo vá muỗng trên bếp
  rr(b,126,30,142,3,'#5a3a20');
  for(let i=0;i<6;i++){const x=136+i*22;rr(b,x,33,1,10,'#6b4423');if(i%2)orb(b,x,46,3,'#b0b8c0');else blk(b,x-3,42,6,8,'#c8643a')}
  // hậu bếp: mặt bàn đá + lò gạch có 3 miệng lửa + tủ gỗ
  blk(b,112,86,162,9,'#d8b88a');
  blk(b,116,95,154,22,'#9a5a3c');
  for(let y=98;y<116;y+=5)for(let x=118+(y%2)*5;x<268;x+=10)rr(b,x,y,9,1,'#6a3a24');
  for(let i=0;i<3;i++){const x=134+i*40;rr(b,x,100,24,17,OL);rr(b,x+1,101,22,15,'#1a0e08');rr(b,x+4,110,16,5,'#e8892a');rr(b,x+7,112,10,3,'#ffd86a')}
  blk(b,116,117,154,35,'#7a4a24');
  for(let i=0;i<3;i++){const x=122+i*48;blk(b,x,121,44,28,'#8b5a2b');rr(b,x+4,125,36,20,'#9a6a38');rr(b,x+19,132,6,3,'#f2d04a')}
  // bồn rửa + thớt
  blk(b,72,86,38,8,'#d8b88a');blk(b,74,94,34,58,'#7a4a24');blk(b,77,98,28,24,'#8b5a2b');blk(b,77,125,28,22,'#8b5a2b');
  rr(b,92,76,3,10,'#c0c8d0');rr(b,92,76,10,2,'#c0c8d0');rr(b,100,76,2,5,'#c0c8d0');blk(b,78,82,12,5,'#c4a06a');orb(b,83,80,2,'#e8483a');
  // củi chất đống
  for(let r=0;r<3;r++)for(let i=0;i<5-r;i++){const x=24+i*10+r*5,y=144-r*8;orb(b,x,y,4,'#a8733a');rr(b,x-1,y-1,2,2,'#d8a468')}
  // bao gạo + rổ trứng + tủ lạnh + chậu cây
  A.sack(b,288,134,'#e8d9b0');A.sack(b,303,138,'#d8c090');A.basket(b,318,138,'#f6ecd2');
  blk(b,336,82,34,68,'#eef3f6');rr(b,337,110,32,2,OL);rr(b,361,90,2,12,'#9098a0');rr(b,361,116,2,18,'#9098a0');
  rr(b,342,120,4,4,'#d8553a');rr(b,350,126,4,4,'#f2d04a');rr(b,342,90,10,8,'#fff6e4');rr(b,343,92,8,1,'#d8553a');
  A.pot(b,376,134,'#3b8a8a');A.pot(b,2,134,'#c8643a');
  // sàn gỗ + chân tường
  rr(b,0,148,W,8,'#5a3a20');rr(b,0,148,W,1,'#8b5a2b');
  A.boards(b,0,156,W,H-156,'#7a4e2a','#6f4524');
  // thảm tròn
  for(let j=-14;j<=14;j++){const w=Math.sqrt(1-j*j/196)*68|0;for(let i=-w;i<=w;i++){const d=i*i/4624+j*j/196,c=d>.82?'#8a2d1c':d>.58?'#e8c878':d>.3?'#c8462e':'#f2d9a0';rr(b,170+i,196+j,1,1,c)}}
},400,230),
 draw(t){const S=G.S;
  // ánh lửa ấm
  R(112,60,162,60,'rgba(255,170,60,'+(.05+Math.sin(t/120)*.015).toFixed(3)+')');
  for(let i=0;i<3;i++){const x=134+i*40,h=4+Math.sin(t/80+i*2)*3;
   for(let k=0;k<3;k++){const hh=h+(k==1?3:0);R(x+6+k*6,115-hh,4,hh,'#e8892a');R(x+7+k*6,115-hh/2,2,hh/2,'#ffe27a')}}
  for(let i=0;i<3;i++){const x=132+i*40,y=62,q=S.cooking[i];
   blk(cx,x,y+18,30,14,'#8a929c');rr(cx,x+2,y+20,26,2,'#c0c8d0');
   blk(cx,x+2,y+8,26,11,'#d9a860');for(let k=0;k<5;k++)rr(cx,x+5+k*5,y+10,1,7,'#a87838');
   blk(cx,x+5,y+3,20,6,'#e8c878');rr(cx,x+13,y,4,3,'#8b5a2b');
   if(q){const r=G.RECIPES[q.r],f=q.done?1:q.t/r.time,w=q.w||0,st=G.quality(w);
    R(x,y-5,30,4,OL);R(x+1,y-4,28*f,2,q.done?'#f2c42a':'#4f9a45');BUB(x+3,y-30,q.r);
    if(q.done){ // món đã chín: thanh nhỏ cho biết còn bao lâu thì tụt sao, kèm số sao hiện tại
     const left=w<=20?1-w/20:w<=60?1-(w-20)/40:0;R(x,y-9,30,3,OL);R(x+1,y-8,28*left,1,st===3?'#f2c42a':st===2?'#bfe0f0':'#b8a890');TS('★'.repeat(st),x+15,y-33,'#ffd23a',9)}
    else for(let k=0;k<3;k++){const yy=(t/28+k*9+i*5)%16;R(x+8+k*6,y+1-yy,2,2,'#fff8')}}}
  // Bảng đơn trên tường trái: khung gỗ, nền bần, giấy ghim; chấm báo số đơn (xanh = có đơn giao được ngay)
  const nOrd=(S.orders||[]).length,nOk=G.ordReady?G.ordReady():0;
  blk(cx,6,42,50,58,'#8b5a2b');rr(cx,9,45,44,52,'#c89a5a');for(let i=0;i<26;i++)rr(cx,10+hs(i,1)%42,46+hs(i,2)%50,1,1,'#a8803e');
  [['#fff6a8',12,49],['#bfe8f6',32,51],['#f6c8d4',13,69],['#d4f0c0',31,71],['#fff6a8',22,59]].slice(0,Math.min(5,nOrd)).forEach(([c,x,y])=>{rr(cx,x,y,15,13,c);rr(cx,x+2,y+4,10,1,'#8a6a40');rr(cx,x+2,y+7,7,1,'#8a6a40');rr(cx,x+2,y+10,9,1,'#8a6a40');rr(cx,x+6,y-1,2,2,'#d8402e')});
  if(!nOrd)TS('Chưa có đơn',31,74,'#6b4423',7);
  TS('Bảng đơn',31,38,'#fff6e4',8);
  if(nOrd){orb(cx,52,46,6,nOk?'#4f9a45':'#d8402e');TS(nOk||nOrd,52,49,'#fff',8)}
  HOT(6,40,50,62,()=>{G.ui.modal='orders';G.refreshUI&&G.refreshUI()},{sx:50,sy:130});
  HOT(124,48,140,70,()=>{if(G.readyPots()){G.collectAll();G.refreshUI&&G.refreshUI()}else G.ui.modal='cook'},{sx:190,sy:130,anim:'stir',dur:.8});
  HOT(126,22,142,26,()=>{G.ui.modal='upgrade';G.refreshUI()},{sx:190,sy:130}); // giá treo dụng cụ → Nâng cấp
  if(G.kitCost()!=null)IM('coin',258,20+Math.sin(t/300)*1.5,12);
  // lá chuối để món chín
  blk(cx,248,166,124,32,'#3f7a32');for(let k=0;k<7;k++)rr(cx,256+k*16,170,1,24,'#5fb04a');rr(cx,250,181,120,1,'#2f6a2a');
  // kệ lá chuối: tối đa 4 món đang có (theo thứ tự công thức, sao cao trước), dư thì ghi "+n món"
  const rk=Object.keys(G.RECIPES),dishes=Object.keys(S.inv).filter(id=>G.RECIPES[G.baseOf(id)]).sort((a,b)=>rk.indexOf(G.baseOf(a))-rk.indexOf(G.baseOf(b))||G.starOf(b)-G.starOf(a));
  dishes.slice(0,4).forEach((id,i)=>{const x=252+i*30;IM(id,x,170,18);TS('×'+S.inv[id],x+9,198,'#fff6e4',7)});
  if(dishes.length>4)TS('+'+(dishes.length-4)+' món',352,167,'#fff6e4',7);
  if(!dishes.length)TS('Món nấu xong xếp ở đây',310,186,'#fff6e4',7);
  TS(G.readyPots()?'Chạm chõ để thu món':S.cooking.length?'Đang nấu…':'Chạm chõ để nấu',200,144,'#fff6e4',9);
  G.drawDoor(46,188,'farm',46,196);
  G.P.draw(t)}};
