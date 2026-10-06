Z.kitchen={bg:mkBg(b=>{
  // Tường gạch kiểu ảnh reference
  for(let y=0;y<H;y+=8)for(let x=0;x<W;x+=16){const off=(y/8%2)*8;rr(b,x+off,y,15,7,['#c07050','#b06040','#d08060'][hs(x,y)%3]);rr(b,x+off,y+7,15,1,'#8a4a30')}
  // Cửa sổ đêm
  rr(b,20,20,50,60,'#2a1a10');rr(b,23,23,44,54,'#1a2040');rr(b,30,23,3,54,'#2a1a10');rr(b,42,23,3,54,'#2a1a10');rr(b,54,23,3,54,'#2a1a10');
  rr(b,40,35,8,6,'#f0e8c0'); // trăng
  // Kệ hủ
  rr(b,280,30,90,8,'#8b5a2b');rr(b,280,70,90,8,'#8b5a2b');
  for(let i=0;i<5;i++){rr(b,288+i*16,18,12,14,'#2a1a10');rr(b,289+i*16,19,10,12,['#c8462e','#8fc8e0','#d9a066','#6fb04e','#e8d27a'][i])}
  for(let i=0;i<4;i++){rr(b,292+i*18,58,14,14,'#2a1a10');rr(b,293+i*18,59,12,12,['#a8573a','#5a3a20','#c08a4c','#3b6ea5'][i])}
  // Nồi hấp lớn giữa (giống ảnh)
  rr(b,140,70,100,20,'#2a1a10');rr(b,145,50,90,25,'#a0a8b0');rr(b,148,52,84,20,'#c0c8d0');rr(b,155,40,70,15,'#9098a0');rr(b,158,42,64,12,'#b0b8c0');
  rr(b,160,85,60,30,'#8a4a30');rr(b,165,90,50,20,'#a05a38'); // bệ
  // Đống củi
  for(let i=0;i<6;i++)rr(b,30+i*12,160,14,10,'#8b5a2b');for(let i=0;i<5;i++)rr(b,36+i*12,150,14,10,'#a07040');for(let i=0;i<4;i++)rr(b,42+i*12,140,14,10,'#8b5a2b');
  // Hũ lớn
  rr(b,320,140,50,55,'#2a1a10');rr(b,323,143,44,50,'#8b5a2b');rr(b,328,150,34,30,'#a07040');
  // Sàn
  rr(b,0,190,W,H-190,'#5a3a20');for(let x=0;x<W;x+=20)rr(b,x,190,1,H-190,'#4a2a15')
 }),
 draw(t){const S=G.S;
  const di=k=>{const i=G.loadImg(G.ASSETS[k]);return(i&&i.complete)?i:null};
  cx.imageSmoothingEnabled=false;
  const fr=di('fridge'),fu=di('furnace'),sk=di('sink'),bn=di('bin'),wt=di('worktop'),pl=di('plant_g'),tb=di('table'),ch=di('chair');
  if(fr)cx.drawImage(fr,16,50,36,52);else R(16,50,36,52,'#8fc8e0');
  if(sk)cx.drawImage(sk,56,70,28,28);
  if(wt)cx.drawImage(wt,90,150,96,28);
  if(tb)cx.drawImage(tb,210,145,40,40);
  if(ch)cx.drawImage(ch,195,155,22,28);
  if(fu)cx.drawImage(fu,320,55,48,48);else R(320,55,48,48,'#c8462e');
  if(pl)cx.drawImage(pl,360,40,16,32);
  if(bn)cx.drawImage(bn,350,145,22,28);
  for(let i=0;i<4;i++){const h=6+Math.sin(t/80+i)*5;R(150+i*12,118-h,6,h,'#e8892a');R(151+i*12,118-h/2,4,h/2,'#f2d04a')}
  for(let i=0;i<3;i++){const x=140+i*42,y=55,q=S.cooking[i];
   R(x,y+12,28,20,'#2a1a10');R(x+2,y+14,24,16,'#8a9098');R(x+2,y+14,24,4,'#b0b8c0');R(x+10,y+8,8,6,'#2a1a10');
   if(q){const r=G.RECIPES[q.r],f=i?0:q.t/r.time;R(x,y-6,28,5,'#2a1a10');R(x+1,y-5,26*f,3,'#4f9a45');BUB(x+2,y-28,q.r);
    if(!i)for(let k=0;k<3;k++){const yy=(t/28+k*10)%18;R(x+8+k*5,y+6-yy,3,3,'#fff8')}}}
  HOT(140,50,130,90,()=>{G.ui.modal='cook'},{sx:200,sy:140,anim:'stir',dur:.8});
  Object.keys(G.RECIPES).forEach((k,i)=>{const n=S.inv[k]||0,x=300+i*22;IM(k,x,110,16,n?1:.35);TS('×'+n,x+8,132,'#fff3d6',7)});
  if(!S.cooking.length)TS('Chạm nồi để nấu',W/2,175,'#fff3d6',9);
  G.drawPOI(50,200,'Trại','farm',50,200,1);
  G.P.draw(t)}};
// ===== QUÁN =====
