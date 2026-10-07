Z.farm={bg:mkBg(b=>{
  grass(b);
  // Chuồng mái lá bên phải
  rr(b,392,28,118,128,'#6b4423');
  rr(b,396,34,110,118,'#c4a06a');
  for(let y=36;y<148;y+=7)rr(b,396,y,110,1,'#a8844a');
  for(let i=0;i<28;i++)rr(b,400+hs(i,3)%96,40+hs(i,4)%100,6,1,'#e8cd6e');
  rr(b,388,22,126,8,'#8b5a2b');rr(b,396,14,110,10,'#d8b56a');rr(b,408,8,86,8,'#e8c878');
  for(let x=392;x<510;x+=24){rr(b,x,18,4,18,'#5a3a20');rr(b,x,146,4,14,'#5a3a20')}
  rr(b,404,128,90,8,'#6b4423');rr(b,408,124,18,6,'#8fc8e0'); // máng nước
  // Đường đất ra cổng làng
  rr(b,0,198,520,26,'#c4a06a');rr(b,0,198,520,3,'#a8844a');rr(b,0,221,520,3,'#a8844a');
  river(b,248);
  // Giếng
  rr(b,300,158,28,16,'#6a6a72');rr(b,304,154,20,12,'#3f8fc4');rr(b,308,150,4,16,'#5a3a20');rr(b,322,150,4,16,'#5a3a20');rr(b,306,148,18,3,'#8b5a2b');
  // Hàng rào trước ruộng
  for(let x=150;x<430;x+=14){rr(b,x,168,3,12,'#8b5a2b');rr(b,x,168,12,2,'#c4a06a')}
},520,300),
 draw(t){const S=G.S,SP=G.SP;rip(t,254,520);
  S.plots.forEach((p,i)=>{const{x,y}=G.plotPos(i);
   R(x+1,y+2,24,24,'#0003');
   R(x,y,24,24,'#5a3a20');
   R(x+1,y+1,22,22,'#b07a42');R(x+2,y+2,20,20,'#c48a52');
   R(x+3,y+6,18,1,'#9a6a38');R(x+3,y+12,18,1,'#9a6a38');R(x+3,y+18,18,1,'#9a6a38');
   if(p){const c=G.CROPS[p.crop],g=p.t/c.time,s=g<.33?SP.sprout:g<1?SP.grow:SP[p.crop];
    D(s,x+12-s.width/2,y+22-s.height)}
   HOT(x,y,24,24,()=>G.plotClick(i),{sx:x+12,sy:y+28,anim:'dig'})});
  S.plots.forEach((p,i)=>{if(p&&p.t>=G.CROPS[p.crop].time){const{x,y}=G.plotPos(i),by=y-8+Math.sin(t/200+i)*2;BUB(x+1,by,p.crop)}});
  S.animals.forEach((a,i)=>{const bx=408+(i%2)*50,by=40+Math.floor(i/2)*32,wk=Math.sin(t/900+i*2)*4;
   R(bx+wk+4,by+26,20,4,'#0003');
   if(a.type==='ga'){const ci=G.loadImg(G.ASSETS.chicken);if(ci.complete)cx.drawImage(ci,bx+wk,by+Math.abs(Math.sin(t/180+i))*2,32,16);else D(SP.ga,bx+wk,by,2)}
   else{D(SP.bo,bx+wk,by,2,Math.cos(t/900+i*2)<0)}
   if(a.ready||!a.fed)BUB(bx+6,by-16+(a.ready?Math.sin(t/200)*2:0),a.ready?G.ANIMALS[a.type].make:'cam',a.ready?'#3ba56e':'#c8462e');
   HOT(bx-4,by-16,48,44,()=>a.ready?G.collect(i):a.fed?G.msg('Đang lớn…'):G.feed(i),{sx:bx+20,sy:by+34,anim:a.ready?'dig':'feed'})});
  // Nhà bếp lá dừa — vào bếp bằng cửa, không biển tên
  const hx=18,hy=48;
  R(hx+6,hy+62,70,8,'#0004');
  R(hx,hy+22,84,44,'#f3e2c0');R(hx+2,hy+24,80,40,'#fff6e4');
  R(hx+34,hy+40,16,26,'#5a3a20');R(hx+36,hy+42,12,24,'#8b5a2b');R(hx+44,hy+52,2,2,'#f2d04a');
  R(hx+8,hy+30,14,12,'#8ec8ea');R(hx+62,hy+30,14,12,'#8ec8ea');
  R(hx-6,hy+16,96,8,'#c8462e');R(hx+2,hy+10,80,8,'#e86848');R(hx+14,hy+5,56,6,'#f2d04a');
  R(hx+30,hy-2,8,8,'#d0d4d8');R(hx+32,hy-8,4,8,'#8a9098');
  for(let i=0;i<2;i++){const yy=(t/40+i*8)%14;R(hx+33,hy-10-yy,2,2,'#fff8')}
  HOT(hx,hy,90,70,()=>G.goZone('kitchen'),{sx:hx+42,sy:hy+66});
  D(G.SP.bush,120,170,1.3);D(G.SP.bush,250,176,1.2);
  for(let i=0;i<6;i++)D([G.SP.flower,G.SP.flower2,G.SP.flower3][i%3],130+i*18,188,1.2);
  D(G.SP.barrel,286,172,1.4);
  G.drawPOI(490,224,'Về làng','hub',470,214);
  G.P.draw(t);
  palm(24,246,t);palm(160,250,t+200);palm(340,248,t+500);palm(500,246,t+700)}
};
