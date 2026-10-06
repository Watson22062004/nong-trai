Z.farm={bg:mkBg(b=>{
  grass(b);
  // chuồng mái lá
  rr(b,390,36,122,118,'#6b4423');
  rr(b,394,42,114,108,'#e7c98a');
  for(let y=44;y<146;y+=6)rr(b,394,y,114,1,'#c4a06a');
  rr(b,386,28,130,10,'#8b5a2b');rr(b,398,18,106,12,'#d8b56a');rr(b,410,10,82,10,'#e8c878');
  for(let x=390;x<508;x+=22){rr(b,x,22,4,16,'#5a3a20');rr(b,x,146,4,12,'#5a3a20')}
  rr(b,404,128,86,8,'#6b4423');rr(b,410,124,20,6,'#8fc8e0');
  // đường + hàng rào
  rr(b,0,198,520,26,'#c4a06a');rr(b,0,198,520,3,'#a8844a');rr(b,0,221,520,3,'#a8844a');
  for(let x=150;x<430;x+=12){rr(b,x,176,3,12,'#8b5a2b');rr(b,x,176,11,2,'#c4a06a')}
  river(b,248);
  // giếng
  rr(b,292,156,30,16,'#8a9098');rr(b,296,152,22,12,'#3f8fc4');rr(b,300,146,4,18,'#5a3a20');rr(b,314,146,4,18,'#5a3a20');rr(b,298,144,18,3,'#8b5a2b');
},520,300),
 draw(t){const S=G.S,SP=G.SP;rip(t,254,520);
  S.plots.forEach((p,i)=>{const{x,y}=G.plotPos(i);
   R(x+1,y+2,24,24,'#0003');R(x,y,24,24,'#5a3a20');R(x+1,y+1,22,22,'#b07a42');R(x+2,y+2,20,20,'#c48a52');
   R(x+3,y+7,18,1,'#9a6a38');R(x+3,y+13,18,1,'#9a6a38');
   if(p){const c=G.CROPS[p.crop],g=p.t/c.time,s=g<.33?SP.sprout:g<1?SP.grow:SP[p.crop];D(s,x+12-s.width/2,y+22-s.height)}
   HOT(x,y,24,24,()=>G.plotClick(i),{sx:x+12,sy:y+28,anim:'dig'})});
  S.plots.forEach((p,i)=>{if(p&&p.t>=G.CROPS[p.crop].time){const{x,y}=G.plotPos(i);BUB(x+1,y-8+Math.sin(t/200+i)*2,p.crop)}});
  S.animals.forEach((a,i)=>{const bx=408+(i%2)*50,by=42+Math.floor(i/2)*32,wk=Math.sin(t/900+i*2)*4;
   R(bx+wk+4,by+26,20,4,'#0003');
   if(a.type==='ga'){const ci=G.loadImg(G.ASSETS.chicken);if(ci&&ci.complete)cx.drawImage(ci,bx+wk,by+Math.abs(Math.sin(t/180+i))*2,32,16);else D(SP.ga,bx+wk,by,2)}
   else D(SP.bo,bx+wk,by,2,Math.cos(t/900+i*2)<0);
   if(a.ready||!a.fed)BUB(bx+6,by-16+(a.ready?Math.sin(t/200)*2:0),a.ready?G.ANIMALS[a.type].make:'cam',a.ready?'#3ba56e':'#c8462e');
   HOT(bx-4,by-16,48,44,()=>a.ready?G.collect(i):a.fed?G.msg('Đang lớn…'):G.feed(i),{sx:bx+20,sy:by+34,anim:a.ready?'dig':'feed'})});
  // nhà bếp chibi
  const x=16,y=46;
  R(x+8,y+64,76,8,'#0004');
  R(x,y+24,88,46,'#fff6e4');R(x+3,y+27,82,40,'#f3e2c0');
  R(x+34,y+42,16,28,'#5a3a20');R(x+36,y+44,12,26,'#8b5a2b');R(x+44,y+54,2,2,'#f2d04a');
  R(x+8,y+32,16,12,'#8ec8ea');R(x+62,y+32,16,12,'#8ec8ea');
  R(x+10,y+34,4,4,'#fff');R(x+64,y+34,4,4,'#fff');
  R(x-4,y+16,96,8,'#c8462e');R(x+4,y+10,80,8,'#e86848');R(x+16,y+4,56,7,'#f2d04a');
  R(x+36,y-2,8,8,'#d0d4d8');
  for(let i=0;i<2;i++){const yy=(t/36+i*8)%12;R(x+38,y-8-yy,2,2,'#fff8')}
  HOT(x,y,92,72,()=>G.goZone('kitchen'),{sx:x+44,sy:y+68});
  D(G.SP.bush,124,174,1.3);D(G.SP.bush,248,178,1.2);
  for(let i=0;i<6;i++)D([G.SP.flower,G.SP.flower2,G.SP.flower3][i%3],132+i*16,190,1.2);
  G.drawPOI(470,214,'','hub',470,214,1);
  G.P.draw(t);
  palm(26,246,t);palm(168,250,t+200);palm(348,248,t+400);palm(504,246,t+600)}
};
